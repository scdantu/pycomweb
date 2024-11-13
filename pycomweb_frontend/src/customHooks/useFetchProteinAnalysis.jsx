import axios from "axios"
import { useState, useEffect } from "react"
import { PYCOMWEB_BASE_URL, TOP_SCORING_RESIDUES2 } from "../constants"
const useFetchProteinAnalysis = (uniprot_id, percentile, matrixType) => {
    const [analysisError, setAnalysisError] = useState(null);
    const [analysisLoaded, setAnalysisLoaded] = useState(false);
    const [analysisData, setAnalysisData] = useState(null);

    useEffect(() => {
        const fetchMatricesData = async (uniprot_id, percentile, matrixType) => {

            // analysisLoaded(false);

            try {
                const fetchProteinMatricesData = async (uniprot_id, percentile, matrixType) => {
                    try {
                        // const response = await axios.get(PYCOMWEB_BASE_URL + PYCOMWEB_GET_PROTEIN_MATRICES + uniprot_id);
                        const response = await axios.post(PYCOMWEB_BASE_URL + TOP_SCORING_RESIDUES2, {uniprot_id,percentile, matrixType});
                        const { data } = response;
                        return data;
                    } catch (err) {
                        setAnalysisError(err.message);
                        return {}
                    }
                };

                const proteinAnalysisData = await fetchProteinMatricesData(uniprot_id, percentile, matrixType);

                // set Matrices Data
                setAnalysisData({proteinAnalysisData});
            } catch (err) {
                setAnalysisError(err.message);
            } finally {
                setAnalysisLoaded(true);
            }
        }

        fetchMatricesData(uniprot_id, percentile, matrixType);
    }, [uniprot_id, percentile, matrixType]);

    return { analysisError, analysisLoaded, analysisData }
}

export default useFetchProteinAnalysis
