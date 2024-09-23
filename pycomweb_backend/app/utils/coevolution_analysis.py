from flask import current_app 

import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import networkx as nx
import numpy as np
import pandas as pd
from pycom import PyCom,CoMAnalysis 
from scipy import stats
import io
import base64
from flask_cors import CORS


# Utility function to read all the scores for the given residue pair saved in the uploads/coevolution_scores  
def read_scores_from_file(residue_pair):
    upload_folder = current_app.config['UPLOAD_FOLDER'] + "/coevolution_scores"
    file_paths = [
        os.path.join(upload_folder, f"{residue_pair}_simple.txt"),
        os.path.join(upload_folder, f"{residue_pair[::-1]}_simple.txt")
    ]
    scores = []
    for file_path in file_paths:
        if os.path.isfile(file_path):
            file_found = True
            with open(file_path, 'r') as file:
                for line in file:
                    score = float(line.strip())
                    scores.append(round(score, 2))
        else:
            scores.append(file_path)
    return scores

#Function generates statisctics related to list of Coevolution scores and check the significance of selected score 
def calculate_coevolution_score_stats(scores, selected_score):
    scores = np.array(scores)
    # Calculate Descriptive statistics
    descriptive_stats = {
        'mean': round(np.mean(scores), 2),
        'median': round(np.median(scores), 2),
        'std_dev': round(np.std(scores), 2),
        'variance': round(np.var(scores), 2),
        'min': round(np.min(scores), 2),
        'max': round(np.max(scores), 2),
        'quartiles': list(np.percentile(scores, [25, 50, 75]))  # Convert numpy array to list
    }
    # Calculate Z-score for selected score
    z_score = (selected_score - np.mean(scores)) / np.std(scores)
    descriptive_stats['z_score'] = round(z_score, 2)

    # Perform a t-test comparing the selected score with the sample distribution
    t_stat, p_value = stats.ttest_1samp(scores, selected_score)

    descriptive_stats['t_test'] = {'t_stat': float(t_stat), 'p_value': float(p_value)}

    # set significance level (alpha)
    alpha = 0.05

    # check if the result is significant
    if p_value < alpha:
        descriptive_stats['significance'] = "Coevolution score is Significant at 0.05 level of significance"
    else:
        descriptive_stats['significance'] = "Coevolution score is Not Significant at 0.05 level of significance"

    
    return descriptive_stats

# function geneartes the box-plots for diplaying significance of Residue   
def generate_boxplot(scores, selected_score, residue_pair):
    fig, ax = plt.subplots()
    ax.boxplot(scores, patch_artist=False)
    ax.plot(1, selected_score, 'ro', label=f'Selected Score: {round(selected_score, 2)}')
     # Adding title and labels for better readability
    ax.set_title('Sgnificance of Coevolution Score for residue pair ' +     residue_pair)
    ax.set_ylabel('Score')
    ax.set_xticks([1])
    ax.set_xticklabels(['Scores'])
    
    # # Add grid for better visualization
    # ax.grid(True, linestyle='--', alpha=0.7)
    
    # Add legend
    ax.legend()
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    plt.close(fig)
    return buf
    

#utility to funciton that calls ComAnalysis Library to get Top scoring residues
# Insert the residue Pair in the result along with the positions number
def calculate_top_scoring_residues(matrix, percentile = 90, sequence=""):
    # Convert the matrix into a NumPy array
    np_matrix = np.array(matrix)
    #Use Pycom Library to create scale and normalize the matrix
    obj_com_analysis=CoMAnalysis()
    top_scoring_residues_df = obj_com_analysis.get_top_scoring_residues(np_matrix, percentile = percentile)
    # add residue pair in this dataframe by mapping positions to letters from the sequence
    #step1 convert the values in Integer
    # top_scoring_residues_df['ResA'] = top_scoring_residues_df['ResA'].astype(int)
    # top_scoring_residues_df['ResB'] = top_scoring_residues_df['ResB'].astype(int)
    #step 2 Use the integer values to get sequence letter
    top_scoring_residues_df['pair'] = top_scoring_residues_df.apply(lambda row: sequence[int(row['ResA']) -1 ] + sequence[int(row['ResB']) -1], axis=1)
    return top_scoring_residues_df
    # Convert DataFrame to a dictionary for JSON response
    result = df.to_dict(orient='records')



# Util finction that generates heatmap, contact map, network graph based on plot type
def util_generate_plots(matrix, plot_type):
    matrix = np.array(matrix)
    fig, ax = plt.subplots()
    
    if plot_type == 'heatmap':
        cax = ax.matshow(matrix, cmap='viridis')
        fig.colorbar(cax)
        ax.set_title('Heatmap of Coevolution Scores')

    elif plot_type == 'contactmap':
        # contact_matrix = (matrix > threshold).astype(int)
        cax = ax.matshow(matrix, cmap='viridis', vmin=0, vmax=1)  # Subtle colors for contact map
        fig.colorbar(cax)
        ax.set_title('Contact Map Prediction')

    elif plot_type == 'netwrokgraph':
        # Create a graph based on coevolution scores
        threshold = 0.5  # Adjust this threshold as needed
        G = nx.Graph()
        size = matrix.shape[0]

        # Add nodes
        G.add_nodes_from(range(size))

        # Add edges based on the coevolution scores
        threshold = 0.5  # Threshold to determine significant interactions
        for i in range(size):
            for j in range(i + 1, size):
                if matrix[i, j] > threshold:
                    G.add_edge(i, j, weight=matrix[i, j])
        
        # Draw the network graph
        pos = nx.spring_layout(G, seed=42)  # Seed for reproducibility
        edges = G.edges(data=True)
        weights = [edge[2]['weight'] for edge in edges]
        nx.draw(G, pos, ax=ax, with_labels=True, node_color='skyblue', edge_color=weights, edge_cmap=plt.cm.Blues, width=2)
        ax.set_title('Network Graph of Coevolution Scores')

        # Draw the network
        # plt.figure(figsize=(10, 10))
#     nx.draw_networkx(G, pos, with_labels=True, node_color='lightblue', edge_color='gray', node_size=500, font_size=10)

    else:
        return False

    # Convert plot to PNG image and send back as response
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    plt.close(fig)
    return buf;
    
    
# NOt used
def generate_plot(matrix, plot_type):
    matrix = np.array(matrix)
    fig, ax = plt.subplots()
    
    if plot_type == 'heatmap':
        cax = ax.matshow(matrix, cmap='viridis')
        fig.colorbar(cax)
        ax.set_title('Heatmap of Coevolution Scores')
    elif plot_type == 'contact':
        # cax = ax.matshow(matrix, cmap='RdYlBu')
        plt.imshow(matrix)
        # fig.colorbar(cax)
        ax.set_title('Contact Map Prediction')

    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close(fig)
    buf.seek(0)
    return buf
    # plot_image = base64.b64encode(buf.getvalue()).decode('utf-8')
    # return plot_image