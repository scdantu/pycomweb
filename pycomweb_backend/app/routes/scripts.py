import json
from flask import current_app, Blueprint, jsonify, request
import requests
import numpy as np
import os
from collections import defaultdict
import re


scripts_bp = Blueprint('scripts', __name__)

#Script Version 3 : This script  
#   1) considers AB != BA 
#   2) For each of the 400 Pairs (20*20), it evaluates 3 lists of coevolution scores from : normal coevolution matrix, 
#   scaled Coevolution matrix, normalized coevoltution matrix.
#   And creates a separate file for each of the pair with the pair name.


#helper functions to be used in script version 1

# Argument : numpy array (matrix)
# Return :  numpy array after applying min_max scaling
# Functionality: This function takes a matrix as an input and apply min-max scaling on the data and return the result.
# Created By: Hardeep Kaur(2316050@brunel.ac.uk)
def min_max_scaling(matrix):
    min_value = np.min(matrix)
    max_value  = np.max(matrix)
    return (matrix-min_value) / max_value - min_value

# Argument : numpy array (matrix)
# Return :  numpy array after applying Z-scaling or normalization
# Functionality: This function takes a matrix as an input and apply mean scaling or Normalization the matrix and return the result.
# Created By: Hardeep Kaur(2316050@brunel.ac.uk)
def normalize(matrix):
    mean = np.mean(matrix)
    std = np.std(matrix)
    return (matrix-mean) / std

# Functionality: save the pairwise coevolution data from the dictionary to their corresponding files with {pair_name}.txt
def save_to_files(coevolution_data):
    upload_folder = current_app.config['UPLOAD_FOLDER']+'/coevolution_scores/'

    for pair_key, scales in coevolution_data.items():
        for scale_type, scores in scales.items():
            filename = f"{upload_folder}{pair_key}_{scale_type}.txt"
            with open(filename, "a") as f:
                for score in scores:
                    f.write(f"{score}\n")

# Running status for first 10 matrices : Time 8.60s, size 8.35MB
# Runnin status for page 2, 10 matrices : Time 6.84s size 206B
# running status for pages 1 to 10, per-page 10 matrices : Time 28.41s 
# pages 11 to 20 , Time 41.87s
# pages 31 to 50 , Time 1m 43.74s
# pages 51 to 70, Time 1m 1.80s
# pages 71 to 100, Time 2m 17.88s
# pages 101 to 150, Time 3m 58.57s
# pages 151 to 200, Time 4m 36.54s
# 201-250, 3m16.62s
# 251-300 2m 52.80s
# 300-350 2m 32.88s
# 351-400 3m 32.10s
#401-450 3m 34.98s 
#451-500 2m 27.60s backup created
#501-550 3m 17.46s
#551-600 2m 38.52s backup created 
# 601-650 2m 23.76s
# 651-700 4m 35.16 s
# 701-750 3m 25.44 s
# 751-800 3m 59.53s backup created
# 800-850 4m 28.02s
# 851-900 4m 13.21s
# 900-950 3m 6.36s
# 951-1000 2m 54.48s
#QX pair and XX pair not in lists
# Script to get coevolution scores of all the pairs and save it in file with name as <pair>.txt
@scripts_bp.route('/get_residue_coevolution_scores_list', methods=['GET'])
def get_residue_coevolution_scores_list():
    # return jsonify(api_response)
    #get the data from WEBAPI
    base_url = current_app.config['PYCOM_API_URL']
    query_string = 'find?per_page=10&matrix=true&page='
    url_list = []
    for page in range(951, 1001):
        # Make the GET request to the third-party API
        response = requests.get(f'{base_url}{query_string}{page}')
        url_list.append(f'{base_url}{query_string}{page}')
        response_data = response.json()
        # return response_data;
        # get the data from the results key
        protein_data = response_data.get("results", [])
        coevolution_data = defaultdict(lambda: {'simple': [], 'scaled': [], 'normalized': []})
        for protein in protein_data:
            sequence = protein['sequence']
            # in_data['matrix'] = 
            coevo_matrix = np.array(protein['matrix'])
            scaled_coevo_matrix =  min_max_scaling(coevo_matrix)
            normalized_coevo_matrix = normalize(coevo_matrix)
            sequence_length = protein['sequence_length']

            for i in range(1, sequence_length):
                for j in range(0, i):
                    pair_key = sequence[i] + sequence[j]
                    # pair_data.append(pair_key)
                    coevolution_data[pair_key]['simple'].append(coevo_matrix[i, j])
                    coevolution_data[pair_key]['scaled'].append(scaled_coevo_matrix[i, j])
                    coevolution_data[pair_key]['normalized'].append(normalized_coevo_matrix[i, j])

    # Save the accumulated data to files after processing each batch
    save_to_files(coevolution_data)
    api_response = {"page":url_list}
    return jsonify(api_response)

    



#script Version 2 : This script considers AB and BA as different but it evaluates average coevolution score per pair
#  i.e. it returns single average value for each of the 20*20 Pairs. 
@scripts_bp.route('/average_score_script_demo', methods=['POST'])
def average_score_script_demo():

    #get json string from post
    input_data = request.get_json()
    # get the data from the results key
    protein_data = input_data.get("result", [])
    pair_scores = defaultdict(float)
    pair_counts = defaultdict(int)

    for protein in protein_data:
        sequence = protein['sequence']
        # in_data['matrix'] = 
        coevo_matrix = np.array(protein['matrix'])
        sequence_length = protein['sequence_length']
        for i in range(1, sequence_length):
            for j in range(0, i):
                pair = sequence[i] + sequence[j]
                pair_scores[pair] +=  coevo_matrix[i,j]
                pair_counts[pair] += 1
    average_scores = {pair: pair_scores[pair] / pair_counts[pair] for pair in pair_scores}

    return jsonify(dict(average_scores))


# Script Version1: this consider AB Pair equivalaent to BA Pair and likewise.
@scripts_bp.route('/average_score_script', methods=['GET'])
def average_score_script():
    #get the data from WEBAPI
    base_url = 'https://pycom.brunel.ac.uk/api/find'
    query_string = '?per_page=10&matrix=true'
    # Make the GET request to the third-party API
    response = requests.get(base_url+query_string)
    response_data = response.json()
    # return response_data;
    # get the data from the results key
    protein_data = response_data.get("results", [])
    pair_scores = defaultdict(float)
    pair_counts = defaultdict(int)

    for protein in protein_data:
        sequence = protein['sequence']
        # in_data['matrix'] = 
        coevo_matrix = np.array(protein['matrix'])
        sequence_length = protein['sequence_length']
        for i in range(1, sequence_length):
            for j in range(0, i):
                # pair = "".join(sorted(sequence[i] + sequence[j]))
                pair = sequence[i] + sequence[j]
                pair_scores[pair] +=  coevo_matrix[i,j]
                pair_counts[pair] += 1
    average_scores = {pair: pair_scores[pair] / pair_counts[pair] for pair in pair_scores}

    return jsonify(dict(average_scores))




@scripts_bp.route('/test_min_max', methods=['GET'])  
def test_min_max():
    # Define the provided coevolution matrix
    test_matrix = np.array([
        [0.0, 2.1606683731079102e-07, 1.564621925354004e-07, 0.0, 0.0],
        [2.1606683731079102e-07, 0.0, 4.6193599700927734e-07, 4.544854164123535e-07, 4.544854164123535e-07],
        [1.564621925354004e-07, 4.6193599700927734e-07, 0.0, 2.980232238769531e-07, 2.980232238769531e-07],
        [0.0, 4.544854164123535e-07, 2.980232238769531e-07, 0.0, 2.2351741790771484e-07],
        [0.0, 4.544854164123535e-07, 2.980232238769531e-07, 2.2351741790771484e-07, 0.0]
    ])
    # Extract non-diagonal values for scaling and normalization
    row, col = np.triu_indices_from(test_matrix, k=1)
    non_diagonal_values = test_matrix[np.triu_indices_from(test_matrix, k=1)]

    # Min-Max Scaling
    min_value = np.min(non_diagonal_values)
    max_value = np.max(non_diagonal_values)

    min_value_matrix = np.min(test_matrix)
    max_value_matrix = np.max(test_matrix)
    scaled_matrix = (test_matrix - min_value) / (max_value - min_value)
    new_scaled = np.around(scaled_matrix, decimals=2) 
    # return f'{test_matrix}, {min_value}, {max_value}, \n {min_value_matrix},\n {max_value_matrix}, \n {scaled_matrix}, \n {new_scaled}'
    api_response = {
        "row" : row.tolist(),
        "col" : col.tolist(),
        "non_diagonal_values": non_diagonal_values.tolist(),
        "test_matrix": test_matrix.tolist(),
        "min_value_normal" : min_value_matrix,
        "max_value_normal": max_value_matrix, 
        "min_value_diagnol":min_value, 
        "max_val_diagnol":max_value, 
        "scaled":scaled_matrix.tolist(), 
        "new_scaled":new_scaled.tolist()}
    return jsonify(api_response)

