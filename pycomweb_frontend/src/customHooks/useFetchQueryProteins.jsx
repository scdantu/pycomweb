/*Description: This hook is to fetch data from API using filters, page, recordsPerPage.
 Additionaly it savs the filters, data and pagination information in Local Storage and retrieves the same from Local Storage in different navigation.
 
 Hook returns data, total records, total pages, current Page,filters 
 and methods for updating Filters, changing Page number, change Records Per Page,
 */
import { useState, useEffect } from "react";
import {PYCOMWEB_BASE_URL, PYCOMWEB_QUERY_PROTEINS_API} from "../constants"

const useFetchQueryProteins = (filters, pagination) => {
    console.log("Fetch Proteins Hook is called ");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const cleanFilters = (filters) => {
      console.log(filters)
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
              setData(result);
            } catch (err) {
              setError(err);
            } finally {
              setLoading(false);
            }
          };
      
        fetchData();
    }, [filters, pagination]);
  
    return {
        loading,
        error,
        data
    };
  };
  
  export default useFetchQueryProteins;

//   const fetchData = async () => {
    //     setLoading(true);
    //     setError(null);
    //     try {
    //         // Prepare the POST body with only non-empty filters
    //         const formData = new FormData();
    //         // Add filters to formData if they have values
    //         Object.keys(filters).forEach((key) => {
    //             if (filters[key]) {
    //             formData.append(key, filters[key]);
    //             }
    //         });
    
    //       // Add pagination details
    //       formData.append('page', pagination.page);
    //       formData.append('records_per_page', pagination.recordsPerPage);
    //       formData.append('extra_param', "Testing");
    //       console.log()
    //         // const body = {
    //         //     ...filters,
    //         //     page: pagination.page,
    //         //     records_per_page: pagination.recordsPerPage,
    //         // };
    //         console.log(body);
    //         const response = await axios.post('http://127.0.0.1:5000/queryProteinsData', formData);
    //         // const { results, result_count, page, total_pages } = response.data;
    //         setData(response.data);
    //         // setTotalRecords(result_count);
    //         // setTotalPages(total_pages)

    //         // localStorage.setItem('filters', JSON.stringify(filters));
    //         // localStorage.setItem('currentPage', page);
    //         // localStorage.setItem('recordsPerPage', recordsPerPage);
    //         // localStorage.setItem('totalPages', totalPages)
    //     } catch (err) {
    //         setError(err.message || 'Something went wrong');
    //     } finally {
    //         setLoading(false);
    //     }
    //   };
  