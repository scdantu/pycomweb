import axios from "axios"
import { useState, useEffect } from "react"
import { PYCOMWEB_BASE_URL, GENERATE_PLOTS, TOP_SCORING_RESIDUES2, PYCOMWEB_GET_PROTEIN_MATRICES } from "../constants"
const useFetchProteinVisualisation = (uniprot_id, selectedPlot, threshold, matrixType) => {
    const [visualisationError, setVisualisationError] = useState(null);
    const [visualisationLoaded, setVisualisationLoaded] = useState(false);
    const [visualisationData, setVisualisationData] = useState(null);
    console.log(`uniprot_id: ${uniprot_id}`);
    console.log(`selectedPlot: ${selectedPlot}`);
    console.log(`threshold: ${threshold}`);
    console.log(`matrixType: ${matrixType}`);
    useEffect(() => {
        const fetchVisualisationData = async (uniprot_id, selectedPlot, threshold, matrixType) => {

            // visualisationLoaded(false);

            try {
                const fetchProteinVisualisationData = async (uniprot_id, selectedPlot, threshold, matrixType) => {
                    try {
                        // console.log(`a: ${uniprot_id}`)
                        // const response = await axios.get(PYCOMWEB_BASE_URL + PYCOMWEB_GET_PROTEIN_MATRICES + uniprot_id);
                        const response = await axios.post(PYCOMWEB_BASE_URL + GENERATE_PLOTS, 
                            {uniprot_id, selectedPlot, threshold, matrixType}, 
                            { responseType: 'image/png' });
                        const { data } = response;
                        return data;
                    } catch (err) {
                        setVisualisationError(err.message);
                        return {}
                    }
                };

                const proteinVisualisationData = await fetchProteinVisualisationData(uniprot_id, selectedPlot, threshold, matrixType);

                // set Visualisation Data
                setVisualisationData({proteinVisualisationData});
            } catch (err) {
                setVisualisationError(err.message);
            } finally {
                setVisualisationLoaded(true);
            }
        }

        fetchVisualisationData(uniprot_id, selectedPlot, threshold, matrixType);
    }, [uniprot_id, selectedPlot, threshold, matrixType]);

    return { visualisationError, visualisationLoaded, visualisationData }
}

export default useFetchProteinVisualisation