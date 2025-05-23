import axios from "axios"
import { useState, useEffect } from "react"
import { PYCOMWEB_BASE_URL, PYCOMWEB_GET_PROTEIN } from "../constants"

const useFetchProteinDetail = (uniprot_id) => {
    const [proteinData, setProteinData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true);
        // Function to fetch product data based on the ID
        const fetchProteinData = async () => {
            try {
                const response = await axios.get(PYCOMWEB_BASE_URL + PYCOMWEB_GET_PROTEIN + uniprot_id);
                const data = response.data
                setProteinData(data[0]);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProteinData();
    }, [uniprot_id]);

    return { proteinData, error, loading }
}

export default useFetchProteinDetail
