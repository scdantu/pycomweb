import axios from "axios"
import { useState, useEffect, useContext, useMemo } from "react"
import { PYCOMWEB_BASE_URL, UNIPROT_DETAIL} from "../constants"
import { RepositoryContext } from "../context/RepositorContext"

// const useFetchProteinSummaryData = (isRequired, uniprot_ids) => {
const useFetchProteinSummaryData = (uniprot_ids) => {
    
    

    const {proteinRepository, setProteinRepository} = useContext(RepositoryContext);
    const [error, setError] = useState(null);
    const [loadingSummary, setLoadingSummary] = useState(true);
    
    const idsToFetch = useMemo(() => 
        uniprot_ids.filter(uniprot_id => !proteinRepository[uniprot_id]?.fetchedSummaryData), // filter out data already fetched
        [uniprot_ids, proteinRepository]
    );

    // const idToFetch = useMemo(() =>


    useEffect(() => {
        // if (!summaryRequired) return; // Skip if summary is not required
        // if(!isRequired) {
        //     setLoadingSummary(false);
        //     // updateLoading(false);
        //     return;
        // }
        
        // if(!proteinRepository[uniprot_id]?.fetchedSummaryData)
        // {
        //     setLoadingSummary(false)
        //     return;
        // }

        if (idsToFetch.length === 0) {
            setLoadingSummary(false);
            return;
        }
        
        const fetchSummaryData = async (idsToFetch) => {
            
            setLoadingSummary(true);
            
            try {

                const fetchProteinSummaryData = async (uniprot_id) => {
            
                    try {
                        const response = await axios.get(PYCOMWEB_BASE_URL + UNIPROT_DETAIL + uniprot_id);
                        const {data} = response;
                        return {[uniprot_id]: data};
                    } catch (err) {
                        setError(err.message);
                        return {}
                    }
                };
            
                const proteinSummaryPromises = idsToFetch.map(uniprot_id => fetchProteinSummaryData(uniprot_id));
                const proteinSummaryData = await Promise.all(proteinSummaryPromises); // wait for all requests to be fulfilled

                //update the protein repository with received data
                setProteinRepository(prevState => {
                    const newState = { ...prevState };
                    
                    proteinSummaryData.forEach(item => {
                        const keys = Object.keys(item);
                        keys.forEach(key => {
                            newState[key] = {
                                ...newState[key],
                                fetchedSummaryData: true,
                                summaryData: item[key]
                            }
                        })
                    })
            
                    return newState;
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoadingSummary(false);
            }
        }

        fetchSummaryData(uniprot_ids);
    }, [idsToFetch]);

    return { error, loadingSummary }
}

export default useFetchProteinSummaryData
