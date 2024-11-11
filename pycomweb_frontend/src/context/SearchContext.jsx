import { createContext, useEffect, useState } from "react";
// import { PropTypes } from "prop-types";
import PropTypes from "prop-types";
import { SEARCH_FILTERS } from '../constants';
import { FaX } from 'react-icons/fa6';
// import useFetchQueryProteins from "../customHooks/useFetchQueryProteins";

export const SearchContext = createContext(null);

export const SearchProvider = ({children}) =>{
    const [isFormChanged, setIsFormChanged] = useState(false); //enables apply button
    const [isSearchUpdateRequired, setIsSearchUpdateRequired] = useState(false);

    const [filters, setFilters] = useState({});
    const [pagination, setPagination] = useState({
        page: 1,
        recordsPerPage: 10,
    });

    const [searchData, setSearchData] = useState({});
    const [uniProtSearchId, setUniProtSearchId] = useState("");
    const [isRunUniProtSearchById, setIsRunUniProtSearchById] = useState(false);

    //update setIsFormChanged on paginatin update
    useEffect(() => {
        if (pagination !== null) {
            setIsSearchUpdateRequired(true);
        }
      }, [pagination]);

      
    useEffect(() => {
      if(isRunUniProtSearchById === true)
        setFilters({"uniprot_id": uniProtSearchId});
    }, [isRunUniProtSearchById])


    useEffect(() => {
      if(isRunUniProtSearchById === true)
      {
        setIsSearchUpdateRequired(true)
      }
    }, [filters])
   
   
   
  // Called by apply filter button in advance filter component
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // setPagination((prev) => ({ ...prev, page: 1 })); // Reset page to 1 on filter change
    // setIsFormChanged(true);
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleRecordsPerPageChange = (recordsPerPage) => {
    setPagination((prev) => ({ ...prev, recordsPerPage, page: 1 }));
  };

  const handleRemoveFilter = (filterName) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterName];
      return newFilters;
    });
    setIsSearchUpdateRequired(true);
  };

  // To display applied filters as tags
  const getAppliedFilters = () => {
    const appliedFilters = Object.entries(filters)
    return (
      <div>
        {appliedFilters.map(([name, value]) => {
          const label = SEARCH_FILTERS[name];
          return label && value.length > 0 ? (
            <span key={name} style={{ margin: '5px', padding: '5px', border: '1px solid black', borderRadius: '3px' }}>
              {label}: {value} <FaX onClick={() => handleRemoveFilter(name)} />
            </span>
          ) : null;
        })}
      </div>
    );
  }

    return (
        <SearchContext.Provider value= {{isRunUniProtSearchById, setIsRunUniProtSearchById, uniProtSearchId, setUniProtSearchId, isSearchUpdateRequired, setIsSearchUpdateRequired, isFormChanged, setIsFormChanged, searchData, setSearchData, filters, setFilters, pagination, setPagination, handleFiltersChange, handlePageChange, handleRecordsPerPageChange, handleRemoveFilter, getAppliedFilters}}>
            {children}
        </SearchContext.Provider>
    )
}

SearchProvider.propTypes = {
    children: PropTypes.any
}


