import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { RepositoryContext } from '../context/RepositorContext';
import { PYCOMWEB_BASE_URL, UNIPROT_DETAIL, PYCOMWEB_GET_PROTEIN } from '../constants';

const useFetchProteinAllData = (uniprot_id) => {
  const { proteinRepository, setProteinRepository } = useContext(RepositoryContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const summaryExists = proteinRepository[uniprot_id]?.fetchedSummaryData;
  const fullExists = proteinRepository[uniprot_id]?.fetchedFullData;

  useEffect(() => {
    const fetchAllData = async () => {
      if (summaryExists && fullExists) return;

      setLoading(true);

      try {
        const updatedData = { ...proteinRepository[uniprot_id] };

        // Fetch summary if missing
        if (!summaryExists) {
          const summaryRes = await axios.get(`${PYCOMWEB_BASE_URL}${UNIPROT_DETAIL}${uniprot_id}`);
          updatedData.summaryData = summaryRes.data;
          updatedData.fetchedSummaryData = true;
        }

        // Fetch full if missing
        if (!fullExists) {
          const fullRes = await axios.get(`${PYCOMWEB_BASE_URL}${PYCOMWEB_GET_PROTEIN}${uniprot_id}`);
          updatedData.fullData = fullRes.data[0];
          updatedData.fetchedFullData = true;
        }

        // Update context
        setProteinRepository(prev => ({
          ...prev,
          [uniprot_id]: updatedData
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [uniprot_id, summaryExists, fullExists, proteinRepository, setProteinRepository]);

  return { loading, error };
};

export default useFetchProteinAllData;