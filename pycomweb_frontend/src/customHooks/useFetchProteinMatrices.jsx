import axios from "axios"
import { useState, useEffect } from "react"
import { PYCOMWEB_BASE_URL, PYCOMWEB_GET_PROTEIN_MATRICES } from "../constants"
const useFetchProteinCoEvolutionMatrix = (uniprot_id) => {
    const [matricesError, setMatricesError] = useState(null);
    const [matricesLoaded, setMatricesLoaded] = useState(false);
    const [matricesData, setMatricesData] = useState(null);

    useEffect(() => {
        const fetchMatricesData = async (uniprot_id) => {

            setMatricesLoaded(false);

            try {
                const fetchProteinMatricesData = async (uniprot_id) => {

                    try {
                        const response = await axios.get(PYCOMWEB_BASE_URL + PYCOMWEB_GET_PROTEIN_MATRICES + uniprot_id);
                        
                        const { data } = response;
                        return data[0];
                    } catch (err) {
                        setMatricesError(err.message);
                        return {}
                    }
                };

                const proteinMatricesData = await fetchProteinMatricesData(uniprot_id);

                // set Matrices Data
                setMatricesData({ ...proteinMatricesData, entries: proteinMatricesData.matrix.length });
            } catch (err) {
                setMatricesError(err.message);
            } finally {
                setMatricesLoaded(true);
            }
        }

        fetchMatricesData(uniprot_id);
    }, [uniprot_id]);

    return { matricesError, matricesLoaded, matricesData }
}

export default useFetchProteinCoEvolutionMatrix
