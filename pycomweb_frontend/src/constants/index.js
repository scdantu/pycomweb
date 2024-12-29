
export const PYCOM_API_URL = "https://pycom.brunel.ac.uk/api/"
// export const PYCOMWEB_BASE_URL = "http://127.0.0.1:5000/pycomweb_api/"
export const PYCOMWEB_BASE_URL = import.meta.env.VITE_PYCOMWEB_BASE_URL
export const PYCOMWEB_QUERY_PROTEINS_API = "queryProteinsData"
export const PYCOMWEB_GET_PROTEIN = "getProtein/"
export const UNIPROT_DETAIL = "https://www.uniprot.org/uniprotkb/A0JP26/entry"
export const COEVOLUTION_SCORE_SIGNIFICANCE = "check_coevolution_score_significance"
export const TOP_SCORING_RESIDUES = "get_top_scoring_residues"
export const GET_PLOTS = "get_plots"
export const GENERATE_PLOTS = "generate_plots"
export const SEARCH_FILTERS = {
    "has_pdb": "Has PDB",
    "has_ptm": "Has PTM",
    "uniprot_id": "Uniprot ID",
    "sequence": "Sequence",
    "min_length": "Min Length",
    "max_length": "Max Length",
    "min_helix": "Min Helix",
    "max_helix": "Max Helix",
    "min_turn": "Min Turn",
    "max_turn": "Max Turn",
    "min_strand": "Min Strand",
    "max_strand": "Max Strand",
    "has_substrate": "Has Substrate",
    "cath": "Cath",
    "enzyme": "Enzyme",
    "organism_id": "Organism ID",
    "organism_name": "organism Name",
    "disease_id": "Disease Id",
    "disease": "Disease",
    "cofactor_id": "Cofactor ID",
    "cofactor": "Cofactor",
    "biological_process": "Biological Process",
    "cellular_component": "Cellular Component",
    "developmental_stage": "Developmental Stage",
    "domain": "Domain",
    "ligand": "Ligand",
    "molecular_function": "Molecular function",
    "ptm": "PTM"

}