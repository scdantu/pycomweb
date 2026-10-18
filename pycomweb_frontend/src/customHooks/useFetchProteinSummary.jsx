import axios from "axios"
import { useState, useEffect, useContext, useRef } from "react"
import { PYCOMWEB_BASE_URL, UNIPROT_DETAIL } from "../constants"
// import { RepositoryContext } from "../context/RepositorContext"

const useFetchProteinSummary = (uniprot_id) => {
  console.log('oh hello');
  // const { setProteinRepository } = useContext(RepositoryContext);
  const [error, setError] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryData, setSummaryData] = useState({});
  const fetchedIdsRef = useRef(new Set()); // prevent re-fetching attempts

  useEffect(() => {
    // const idsToFetch = uniprot_id.filter(id => !fetchedIdsRef.current.has(id));

    // if(!fetchedIdsRef.current.has(uniprot_id)) return;

    const fetchData = async () => {
      setLoadingSummary(true);

      try {

        const res = await axios.get(`${PYCOMWEB_BASE_URL}${UNIPROT_DETAIL}${uniprot_id}`);
        setSummaryData(res.data);
        fetchedIdsRef.current.add(uniprot_id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingSummary(false);
      }
    };

    fetchData();
  }, [uniprot_id]); // depend only on the incoming prop

  return { summaryData, error, loadingSummary };
};

export default useFetchProteinSummary;