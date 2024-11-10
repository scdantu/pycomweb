import json
from flask import current_app,  Blueprint, jsonify, request
import requests
import numpy as np
import pandas as pd
from collections import defaultdict
from pycom import PyCom,CoMAnalysis 

proteins_bp = Blueprint('proteins', __name__)
# Api is use to list all the proteins in dataset based on the Filters applied.
# Method: POST
# Parameter : Filters received in post request
@proteins_bp.route('/queryProteinsData', methods = ['POST'])
def queryProteinsData():
    if request.method == 'POST':
        api_url = current_app.config['PYCOM_API_URL'] + '/find'
        # disease = request.form.get('disease')
        # Get the POST parameters
        params = request.get_json()
        # Construct the query string
        query_string = '&'.join([f"{key}={value}" for key, value in params.items()])
        url = f"{api_url}?{query_string}"
    
        # Make the GET request to the third-party API
        response = requests.get(url)
    
        # Return the response from the third-party API
        return jsonify(response.json())
    else:
        return "Search Protein Function" 

@proteins_bp.route('/getProteinData/<string:uniprot_id>', methods = ['GET'])
def getProteinData(uniprot_id):
    if request.method == 'GET':
        protein_data = addProteinDetailFromUniprotDB2(uniprot_id)
        return protein_data
    
@proteins_bp.route('/getProteinMatrices/<string:uniprot_id>', methods = ['GET'])
def getProteinMatrices(uniprot_id):
    if request.method == 'GET':
        api_url = current_app.config['PYCOM_API_URL'] + '/find'
        query_string = 'uniprot_id='+uniprot_id+"&matrix=true"
        url = f"{api_url}?{query_string}"
        # Make the GET request to the third-party API
        response = requests.get(url)
        response = response.json() 
        protein_data = response.get("results")
        # protein_data[0] = addProteinDetailFromUniprotDB(uniprot_id, protein_data[0])
        protein_dataframe = pd.DataFrame.from_dict(protein_data)    #convert it into pandas dataframe
        # Convert the matrix column (list of lists) to a NumPy array
        protein_dataframe['matrix'] = protein_dataframe['matrix'].apply(lambda x: np.array(x))
        
        #Use Pycom Library to create scale and normalize the matrix
        obj_com_analysis=CoMAnalysis()
        protein_dataframe = obj_com_analysis.scale_and_normalise_coevolution_matrices(protein_dataframe)
        matrix_S = protein_dataframe['matrix_S']
        # Below function is removing matrix_S
        result_protein_dataframe = obj_com_analysis.add_contact_predictions(protein_dataframe, contact_factor=1.5) 
        # # if 'matrix_S' in protein_dataframe.columns:
        # #     return f'exists'    
        result_protein_dataframe['matrix_S'] = matrix_S
        json_response = result_protein_dataframe.to_json(orient='records')
        return json_response    
    else:
        return "Incorrect Method" 
    
# Api is use to fetch single Protein data using UniPrt_id
# Method: Get
# Parameter : Id
@proteins_bp.route('/getProtein/<string:uniprot_id>', methods = ['GET'])
def getProtein(uniprot_id):
    if request.method == 'GET':
        api_url = current_app.config['PYCOM_API_URL'] + '/find'
        query_string = 'uniprot_id='+uniprot_id+"&matrix=true"
        url = f"{api_url}?{query_string}"
        # Make the GET request to the third-party API
        response = requests.get(url)
        response = response.json() 
        protein_data = response.get("results")
        protein_data[0] = addProteinDetailFromUniprotDB(uniprot_id, protein_data[0])
        protein_dataframe = pd.DataFrame.from_dict(protein_data)    #convert it into pandas dataframe
        # Convert the matrix column (list of lists) to a NumPy array
        protein_dataframe['matrix'] = protein_dataframe['matrix'].apply(lambda x: np.array(x))
        
        #Use Pycom Library to create scale and normalize the matrix
        obj_com_analysis=CoMAnalysis()
        protein_dataframe = obj_com_analysis.scale_and_normalise_coevolution_matrices(protein_dataframe)
        matrix_S = protein_dataframe['matrix_S']
        # Below function is removing matrix_S
        result_protein_dataframe = obj_com_analysis.add_contact_predictions(protein_dataframe, contact_factor=1.5) 
        # # if 'matrix_S' in protein_dataframe.columns:
        # #     return f'exists'    
        result_protein_dataframe['matrix_S'] = matrix_S
        json_response = result_protein_dataframe.to_json(orient='records')
        return json_response    
    else:
        return "Incorrect Method" 

# function that calls Uniprot API to fetch details of proteins
    
def addProteinDetailFromUniprotDB(uniprot_id, protein_data):
    uniprot_URL = 'https://rest.uniprot.org/uniprotkb/search?query='+uniprot_id
    response = requests.get(uniprot_URL)
    response = response.json().get("results")[0]
    protein_data['protein_name'] = response.get("proteinDescription").get("recommendedName").get("fullName").get("value") 
    # protein_data['ec_number'] = response.get("proteinDescription").get("recommendedName").get("ecNumbers")[0].get("value")
    # Initialize lists to store extracted information
    diseases = []
    ec_numbers = []
    ligands = []
    pdb_ids = []
    ptm = []

    # Extract from "comments"
    comments = response.get("comments", [])
    for comment in comments:
        comment_type = comment.get("commentType", "")
        if comment_type == "DISEASE":
            disease_info = comment.get("disease", {})
            disease = disease_info.get("diseaseId", "")
            disease_accession = disease_info.get("diseaseAccession", "")
            diseases.append({"disease": disease, "disease_id": disease_accession})
        elif comment_type == "CATALYTIC ACTIVITY":
            # ec_number_list = comment.get("reaction", {}).get("ecNumber", [])
            # ec_numbers.extend(ec_number_list)
            ec_numbers.append(comment.get("reaction", {}).get("ecNumber", []))

    # Extract from "keywords"
    keywords = response.get("keywords", [])
    for keyword in keywords:
        if keyword.get("category", "") == "Ligand":
            ligands.append({"name": keyword.get("name", ""), "id": keyword.get("id", "")})
        elif keyword.get("category","") == "PTM":
            ptm.append(keyword.get("name", ""))

    # Extract from "uniProtKBCrossReferences"
    cross_references = response.get("uniProtKBCrossReferences", [])
    for ref in cross_references:
        database = ref.get("database", "")
        ref_id = ref.get("id", "")
        if database == "PDB":
            pdb_ids.append(ref_id)

    # Update the protein_data dictionary
    protein_data['diseases'] = diseases
    protein_data['ec_numbers'] = [ec for ec in ec_numbers if ec]
    protein_data['ligands'] = ligands
    protein_data['pdb'] = pdb_ids
    protein_data['ptm'] = ptm

    return  protein_data

def addProteinDetailFromUniprotDB2(uniprot_id):
    uniprot_URL = 'https://rest.uniprot.org/uniprotkb/search?query='+uniprot_id
    response = requests.get(uniprot_URL)
    response = response.json().get("results")[0]
    protein_data = {}
    protein_data['protein_name'] = response.get("proteinDescription").get("recommendedName").get("fullName").get("value") 
    # protein_data['ec_number'] = response.get("proteinDescription").get("recommendedName").get("ecNumbers")[0].get("value")
    # Initialize lists to store extracted information
    diseases = []
    ec_numbers = []
    ligands = []
    pdb_ids = []
    ptm = []

    # Extract from "comments"
    comments = response.get("comments", [])
    for comment in comments:
        comment_type = comment.get("commentType", "")
        if comment_type == "DISEASE":
            disease_info = comment.get("disease", {})
            disease = disease_info.get("diseaseId", "")
            disease_accession = disease_info.get("diseaseAccession", "")
            diseases.append({"disease": disease, "disease_id": disease_accession})
        elif comment_type == "CATALYTIC ACTIVITY":
            # ec_number_list = comment.get("reaction", {}).get("ecNumber", [])
            # ec_numbers.extend(ec_number_list)
            ec_numbers.append(comment.get("reaction", {}).get("ecNumber", []))

    # Extract from "keywords"
    keywords = response.get("keywords", [])
    for keyword in keywords:
        if keyword.get("category", "") == "Ligand":
            ligands.append({"name": keyword.get("name", ""), "id": keyword.get("id", "")})
        elif keyword.get("category","") == "PTM":
            ptm.append(keyword.get("name", ""))

    # Extract from "uniProtKBCrossReferences"
    cross_references = response.get("uniProtKBCrossReferences", [])
    for ref in cross_references:
        database = ref.get("database", "")
        ref_id = ref.get("id", "")
        if database == "PDB":
            pdb_ids.append(ref_id)

    # Update the protein_data dictionary
    protein_data['diseases'] = diseases
    protein_data['ec_numbers'] = [ec for ec in ec_numbers if ec]
    protein_data['ligands'] = ligands
    protein_data['pdb'] = pdb_ids
    protein_data['ptm'] = ptm

    return  protein_data

@proteins_bp.route('/demo_search', methods =['GET'])
def demo_search():
    base_url = 'https://pycom.brunel.ac.uk/api/find'
    query_string = '?uniprot_id=Q96BI1&matrix=true'
    per_page = '10'
    # Make the GET request to the third-party API
    response = requests.get(base_url+'?per_page=100&matrix=false')
    response_data = response.json()

    # return f'the id is {response_data['page']}'
    return jsonify(response_data)
    




