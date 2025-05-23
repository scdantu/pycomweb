/*Description: This hook is to fetch data from API using filters, page, recordsPerPage.
 Additionaly it savs the filters, data and pagination information in Local Storage and retrieves the same from Local Storage in different navigation.
 
 Hook returns data, total records, total pages, current Page,filters 
 and methods for updating Filters, changing Page number, change Records Per Page,
 */
import { useState, useEffect, useContext } from "react";
import { PYCOMWEB_BASE_URL, PYCOMWEB_QUERY_PROTEINS_API } from "../constants"
import { RepositoryContext } from "../context/RepositorContext";
import { SearchContext } from "../context/SearchContext";

const useFetchQueryProteins = (filters, pagination) => {
  //console.log("Hook is called ");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const {addItemsToProteinRepository } = useContext(PyComContext);
  const { addItemsToProteinRepository } = useContext(RepositoryContext);
  const { searchData, setSearchData } = useContext(SearchContext);
  const { isFormChanged, setIsFormChanged } = useContext(SearchContext);
  const { isSearchUpdateRequired, setIsSearchUpdateRequired, setIsRunUniProtSearchById } = useContext(SearchContext);

  const isEmptyObject = (object) => Object.keys(object).length === 0;

  const cleanFilters = (filters) => {
    const cleanedFilters = {};

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      // Check if value is not undefined, null, or an empty string
      if (value !== '' && value !== undefined && value !== null) {
        cleanedFilters[key] = value;
      }
    });

    return cleanedFilters;
  };

  useEffect(() => {
    // if our search results are not empty, and isFormChanged is false, don't do an update
    if (!isEmptyObject(searchData) && !isSearchUpdateRequired) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const cleanedFilters = cleanFilters(filters);
      const requestData = {
        ...cleanedFilters,
        page: pagination.page,
        per_page: pagination.recordsPerPage
      };

      try {
        const response = await fetch(PYCOMWEB_BASE_URL + PYCOMWEB_QUERY_PROTEINS_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const result = await response.json();
        addItemsToProteinRepository(result.results);
        setData(result);
        setSearchData(result);
        setIsFormChanged(false);
        setIsSearchUpdateRequired(false);
        setIsRunUniProtSearchById(false);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, pagination, isFormChanged, searchData, isSearchUpdateRequired]);

  return {
    loading,
    error,
    data
  };
};

export default useFetchQueryProteins;
