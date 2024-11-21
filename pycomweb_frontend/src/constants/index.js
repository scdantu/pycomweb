export const PYCOM_API_URL = "https://pycom.brunel.ac.uk/api/"
export const PYCOMWEB_BASE_URL = "http://127.0.0.1:5000/"
export const PYCOMWEB_QUERY_PROTEINS_API = "queryProteinsData"
export const PYCOMWEB_GET_PROTEIN = "getProtein/"
export const PYCOMWEB_GET_PROTEIN_MATRICES = "getProteinMatrices/"
// export const UNIPROT_DETAIL = "https://www.uniprot.org/uniprotkb/A0JP26/entry"
export const UNIPROT_DETAIL = "getProteinData/"
export const COEVOLUTION_SCORE_SIGNIFICANCE = "check_coevolution_score_significance"
export const TOP_SCORING_RESIDUES = "get_top_scoring_residues"
export const TOP_SCORING_RESIDUES2 = "get_top_scoring_residues2"
export const GET_PLOTS = "get_plots"
export const GENERATE_PLOTS = "generate_plots"
export const SEARCH_FILTERS = {
    "has_pdb": "Has PDB",
    "has_ptm": "Has PTM",
    "uniprot_id": "Uniprot ID",
    "sequence": "Sequence",
    "min_length": "Min Length",
    "max_length": "Max Length",
    "max_strand": "Max Strand",
    "has_substrate": "Has Substrate",
    
}

export const ADV_FIL = {
    BETA_STRAND: {ID: "BETA_STRAND", DISPLAY_NAME: "Beta Strand"},
    CATH: {ID: "CATH", DISPLAY_NAME: "CATH"},
    DISEASES: {ID: "DISEASES", DISPLAY_NAME: "Diseases"},
    EC: {ID: "EC", DISPLAY_NAME: "EC"},
    HELICAL_STRUCTURE: {ID: "HELICAL_STRUCTURE", DISPLAY_NAME: "Helical Structure"},
    PDB: {ID: "PDB", DISPLAY_NAME: "PDB"},
    PTM: {ID: "PTM", DISPLAY_NAME: "PTM"},
    PTM_SEARCH: {ID: "PTM_SEARCH", DISPLAY_NAME: "PTM"},
    SEQUENCE_LENGTH: {ID: "SEQUENCE_LENGTH", DISPLAY_NAME: "Sequence Length"},
    SUBTRATE: {ID: "SUBTRATE", DISPLAY_NAME: "Subtrate"},
    TURN_STRUCTURE: {ID: "TURN_STRUCTURE", DISPLAY_NAME: "Turn Structure"},
    TESTA: {ID: "TESTA", DISPLAY_NAME: "TESTA"},
    BIOLOGICAL_PROCESS: {ID: "BIOLOGICAL_PROCESS", DISPLAY_NAME: "Biological Process"},
    CELLULAR_COMPONENT: {ID: "CELLULAR_COMPONENT", DISPLAY_NAME: "Cellular Component"},
    DEVELOPMENTAL_STAGE: {ID: "DEVELOPMENTAL_STAGE", DISPLAY_NAME: "Developmental Stage"},
    DOMAIN: {ID: "DOMAIN", DISPLAY_NAME: "Domain"},
    LIGAND: {ID: "LIGAND", DISPLAY_NAME: "Ligand"},
    MOLECULAR_FUNCTION: {ID: "MOLECULAR_FUNCTION", DISPLAY_NAME: "Molecular Function"},
}

export const ADV_FIL_TYPES = {
    RANGE: "RANGE",
    BOOLEAN: "BOOLEAN",
    SINGLE_LOOKUP: "SINGLE_LOOKUP",
    MULTIPLE_LOOKUP: "MULTIPLE_LOOKUP",
    MAJORSUB_INPUT: "MAJORSUB_INPUT",
}
//data hook consts
export const SUMMARY_PROTEIN_DATA = "SUMMARY_PROTEIN_DATA";
export const PYCOM_PROTEIN_DATA = "PYCOM_PROTEIN_DATA";