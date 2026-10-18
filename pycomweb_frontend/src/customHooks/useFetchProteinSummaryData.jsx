import axios from "axios"
import { useState, useEffect, useContext, useRef } from "react"
import { PYCOMWEB_BASE_URL, UNIPROT_DETAIL } from "../constants"
import { RepositoryContext } from "../context/RepositorContext"

const useFetchProteinSummaryData = (uniprot_ids) => {
  const { setProteinRepository } = useContext(RepositoryContext);
  const [error, setError] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const fetchedIdsRef = useRef(new Set()); // prevent re-fetching attempts

  useEffect(() => {
    const idsToFetch = uniprot_ids.filter(id => !fetchedIdsRef.current.has(id));

    if (idsToFetch.length === 0) return;

    const fetchData = async () => {
      setLoadingSummary(true);

      try {
        const results = await Promise.all(idsToFetch.map(async id => {
          try {
            const res = await axios.get(`${PYCOMWEB_BASE_URL}${UNIPROT_DETAIL}${id}`);
            return { id, data: res.data };
          } catch (err) {
            setError(err.message);
            return { id, data: null };
          }
        }));

        setProteinRepository(prev => {
          const updated = { ...prev };

          results.forEach(({ id, data }) => {
            if (data) {
              updated[id] = {
                ...updated[id],
                fetchedSummaryData: true,
                summaryData: data,
              };
              fetchedIdsRef.current.add(id); // mark as fetched
            }
          });

          return updated;
        });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoadingSummary(false);
      }
    };

    fetchData();
  }, [uniprot_ids.join(",")]); // depend only on the incoming prop

  return { error, loadingSummary };
};

export default useFetchProteinSummaryData;