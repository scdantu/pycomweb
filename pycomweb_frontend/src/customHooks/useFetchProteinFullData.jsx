import axios from "axios"
import { useState, useEffect, useContext, useMemo } from "react"
import { PYCOMWEB_BASE_URL, PYCOMWEB_GET_PROTEIN } from "../constants"
import { RepositoryContext } from "../context/RepositorContext"

const useFetchProteinFullData = (isRequired, uniprot_ids) => {

    const { proteinRepository, setProteinRepository } = useContext(RepositoryContext);
    const [error, setError] = useState(null);
    const [loadingFull, setLoadingFull] = useState(true);

    const idsToFetch = useMemo(() =>
        uniprot_ids.filter(uniprot_id => !proteinRepository[uniprot_id]?.fetchedFullData), // filter out data already fetched
        [uniprot_ids, proteinRepository]
    );

    useEffect(() => {

        // if (!summaryRequired) return; // Skip if summary is not required
        if (!isRequired) {
            setLoadingFull(false);
            return;
        }
        if (idsToFetch.length === 0) {
            setLoadingFull(false);
            return;
        }
        const fetchFullData = async (idsToFetch) => {

            setLoadingFull(true);

            try {

                const fetchProteinFullData = async (uniprot_id) => {

                    try {
                        const response = await axios.get(PYCOMWEB_BASE_URL + PYCOMWEB_GET_PROTEIN + uniprot_id);
                        const { data } = response;
                        return { [uniprot_id]: data };
                    } catch (err) {
                        setError(err.message);
                        return {}
                    }
                };

                const proteinSummaryPromises = idsToFetch.map(uniprot_id => fetchProteinFullData(uniprot_id));
                const proteinSummaryData = await Promise.all(proteinSummaryPromises); // wait for all requests to be fulfilled

                //update the protein repository with received data
                setProteinRepository(prevState => {
                    const updated = { ...prevState };

                    proteinSummaryData.forEach(item => {
                        Object.entries(item).forEach(([key, value]) => {
                            const previous = prevState[key] || {};
                            updated[key] = {
                                ...previous,
                                fetchedFullData: true,
                                fullData: value[0]
                            };
                        });
                    });

                    return updated;
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoadingFull(false);
            }
        }

        fetchFullData(idsToFetch);
    }, [isRequired, idsToFetch, setProteinRepository, proteinRepository]);

    return { error, loadingFull }
}

export default useFetchProteinFullData
