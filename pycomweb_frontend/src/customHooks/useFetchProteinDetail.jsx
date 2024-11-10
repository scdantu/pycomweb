import axios from "axios"
import { useState, useEffect } from "react"
import { PYCOMWEB_BASE_URL, PYCOMWEB_GET_PROTEIN, UNIPROT_DETAIL} from "../constants"

const useFetchProteinDetail = (uniprot_id) => {
    const [proteinData, setProteinData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    console.log("in detail hook .......")
    console.log(uniprot_id)

    useEffect(() => {
        setLoading(true);
        // Function to fetch product data based on the ID
        console.log(PYCOMWEB_BASE_URL + PYCOMWEB_GET_PROTEIN + uniprot_id)
        console.log(PYCOMWEB_BASE_URL + UNIPROT_DETAIL + uniprot_id)
        
        const fetchProteinData = async () => {
            try {
                const response = await axios.get(PYCOMWEB_BASE_URL + PYCOMWEB_GET_PROTEIN + uniprot_id);
                // const response = await axios.get(url);
                const data = response.data
                console.log(data)
                setProteinData(data[0]);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchSubProteinData = async () => {
            try {
                const response = await axios.get(PYCOMWEB_BASE_URL + UNIPROT_DETAIL + uniprot_id);
                // const response = await axios.get(url);
                const data = response.data
                console.log(`data: ${JSON.stringify(data)}`)
                // setProteinData(data[0]);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProteinData();
        fetchSubProteinData();
    }, [uniprot_id]);

    return { proteinData, error, loading }
}

export default useFetchProteinDetail
