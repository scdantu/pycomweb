from flask import  request, send_file,  Blueprint, jsonify, Response
from app.utils.coevolution_analysis import read_scores_from_file, generate_boxplot, calculate_top_scoring_residues, calculate_coevolution_score_stats,util_generate_plots
import plotly.graph_objs as go
import plotly.io as pio
import io
import base64
import networkx as nx
import matplotlib.pyplot as plt
import numpy as np
from flask_cors import CORS

coevolution_bp = Blueprint('coevolution_analysis', __name__)


@coevolution_bp.route('/check_coevolution_score_significance', methods=['GET'])
def check_coevolution_score_significance():
    residue_pair = request.args.get('residue_pair')
    selected_score = float(request.args.get('score'))

    # Read scores from file using the utility function
    scores = read_scores_from_file(residue_pair)

    #Get statistics and T-test result
    descriptive_stats = calculate_coevolution_score_stats(scores, selected_score)
    
    # Generate boxplot using the utility function
    buf = generate_boxplot(scores, selected_score, residue_pair)
    plot_image = base64.b64encode(buf.getvalue()).decode('utf-8')
    
    return jsonify({
        'descriptive_statistics': descriptive_stats,
        'plotImage': plot_image
    })

    # return send_file(buf, mimetype='image/png')


@coevolution_bp.route('/get_top_scoring_residues', methods=['POST'])
def get_top_scoring_residues():
    # Get the POST parameters
    input_params = request.get_json()
    matrix = input_params.get('matrix')
    percentile = int(input_params.get('percentile'))
    sequence = input_params.get('sequence')
    df_top_scoring_residues = calculate_top_scoring_residues(matrix, percentile, sequence)
    response = df_top_scoring_residues.to_dict(orient='records')
    return jsonify(response)


@coevolution_bp.route('/get_frequency_matrix', methods=['POST'])
def get_frequency_matrix():
    # Get the POST parameters
    input_params = request.get_json()
    matrix = input_params.get('matrix')
    percentile = int(input_params.get('percentile'))
    sequence = input_params.get('sequence')
    df_top_scoring_residues = calculate_top_scoring_residues(matrix, percentile, sequence)
    response = df_top_scoring_residues.to_dict(orient='records')
    return jsonify(response)


#NOt-used
@coevolution_bp.route('/get_plots', methods=['POST'])
def get_plots():
    data = request.get_json()
    matrix = np.array(data['matrix'])
    plot_type = data['plotType']
    

    fig, ax = plt.subplots()
    
    if plot_type == 'heatmap':
        cax = ax.matshow(matrix, cmap='viridis')
        fig.colorbar(cax)
        ax.set_title('Heatmap of Coevolution Scores')
    elif plot_type == 'contact':
        cax = ax.matshow(matrix, cmap='RdYlBu')
        fig.colorbar(cax)
        ax.set_title('Contact Map Prediction')

    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close(fig)
    buf.seek(0)
    plot_image = base64.b64encode(buf.getvalue()).decode('utf-8')

    return jsonify({'plotImage': plot_image})


# NOt Used#
@coevolution_bp.route('/generate_plots', methods=['POST'])
def generate_plot():
    data = request.get_json()
    matrix = np.array(data['matrix'])
    plot_type = data['plotType']
    buf = util_generate_plots(matrix, plot_type)    
    if(buf):
        return send_file(buf, mimetype='image/png')
    else:
        return jsonify({'error': 'Error While genearting Plot'}), 400

# 
# @app.route('/generate_network', methods=['GET'])
# def generate_network():
#     matrix_type = request.args.get('matrix_type', 'matrix_S')  # Default to 'matrix_S'
#     threshold = float(request.args.get('threshold', 0.5))  # Default threshold for significance

#     # Example: Fetch matrix based on the type requested
#     if matrix_type == 'matrix_S':
#         matrix_data = protein_dataframe['matrix_S']
#     elif matrix_type == 'matrix_N':
#         matrix_data = protein_dataframe['matrix_N']
#     else:
#         matrix_data = protein_dataframe['matrix']

#     # Convert to NumPy array for easier manipulation
#     matrix_array = np.array(matrix_data)

#     # Create a NetworkX graph
#     G = nx.Graph()

#     # Add edges based on threshold
#     size = matrix_array.shape[0]
#     for i in range(size):
#         for j in range(i + 1, size):  # No need to check i=j and avoid double counting
#             if matrix_array[i, j] > threshold:
#                 G.add_edge(i, j, weight=matrix_array[i, j])

#     # Draw the network
#     pos = nx.spring_layout(G)  # Positioning algorithm
#     plt.figure(figsize=(10, 10))
#     nx.draw_networkx(G, pos, with_labels=True, node_color='lightblue', edge_color='gray', node_size=500, font_size=10)

#     # Save the plot to a BytesIO object
#     buf = io.BytesIO()
#     plt.savefig(buf, format='png')
#     buf.seek(0)
#     plt.close()

#     return send_file(buf, mimetype='image/png')