import { createContext, useEffect, useState, useMemo } from "react";
// import { PropTypes } from "prop-types";
import PropTypes from "prop-types";
import { SEARCH_FILTERS, ADV_FIL, ADV_FIL_TYPES} from '../constants';
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

    // filters
    const filterDefaults = {
      [ADV_FIL.SEQUENCE_LENGTH.ID]: {applied: false, isAdvancedFilter: false, id: ADV_FIL.SEQUENCE_LENGTH.ID, displayname: ADV_FIL.SEQUENCE_LENGTH.DISPLAY_NAME, type: ADV_FIL_TYPES.RANGE, min: 1, max: 500, range: {min: 1, max: 500}},
      [ADV_FIL.HELICAL_STRUCTURE.ID]: {applied: false, isAdvancedFilter: true, id: ADV_FIL.HELICAL_STRUCTURE.ID, displayname: ADV_FIL.HELICAL_STRUCTURE.DISPLAY_NAME, type: ADV_FIL_TYPES.RANGE, min: 0, max: 100, range: {min: 0, max: 100}},
      [ADV_FIL.TURN_STRUCTURE.ID]: {applied: false,isAdvancedFilter: true, id: ADV_FIL.TURN_STRUCTURE.ID, displayname: ADV_FIL.TURN_STRUCTURE.DISPLAY_NAME, type: ADV_FIL_TYPES.RANGE, min: 0, max: 100, range: {min: 0, max: 100}},
      [ADV_FIL.BETA_STRAND.ID]: {applied: false, isAdvancedFilter: true, id: ADV_FIL.BETA_STRAND.ID, displayname: ADV_FIL.BETA_STRAND.DISPLAY_NAME, type: ADV_FIL_TYPES.RANGE, min: 0, max: 100, range: {min: 0, max: 100}},
      [ADV_FIL.PDB.ID]: {applied: false, isAdvancedFilter: false, id: ADV_FIL.PDB.ID, displayname: ADV_FIL.PDB.DISPLAY_NAME, type: ADV_FIL_TYPES.BOOLEAN, isEnabled: false},
      [ADV_FIL.PTM.ID]: {applied: false, isAdvancedFilter: false, id: ADV_FIL.PTM.ID, displayname: ADV_FIL.PTM.DISPLAY_NAME, type: ADV_FIL_TYPES.BOOLEAN, isEnabled: false},
      [ADV_FIL.SUBTRATE.ID]: {applied: false, isAdvancedFilter: false, id: ADV_FIL.SUBTRATE.ID, displayname: ADV_FIL.SUBTRATE.DISPLAY_NAME, type: ADV_FIL_TYPES.BOOLEAN, isEnabled: false},
      [ADV_FIL.DISEASES.ID]: {applied: false, isAdvancedFilter: false, id: ADV_FIL.DISEASES.ID, displayname: ADV_FIL.DISEASES.DISPLAY_NAME, type: ADV_FIL_TYPES.BOOLEAN, isEnabled: false},
      [ADV_FIL.CATH.ID]: {applied: false, isAdvancedFilter: true, id: ADV_FIL.CATH.ID, displayname: ADV_FIL.CATH.DISPLAY_NAME, type: ADV_FIL_TYPES.MAJORSUB_INPUT, inputVal: "", placeholder: "3.* or 3.4.52.48"},
      [ADV_FIL.EC.ID]: {applied: false, isAdvancedFilter: true, id: ADV_FIL.EC.ID, displayname: ADV_FIL.EC.DISPLAY_NAME, type: ADV_FIL_TYPES.MAJORSUB_INPUT, inputVal: "", placeholder: "3.* or 3.4.52.48"},
      // pdb: {type: 'boolean', default: false},
      ptm: {type: 'boolean', default: false},
      substrate: {type: 'boolean', default: false},
      diseases: {type: 'boolean', default: false}
    };

    const [advancedFilters, setAdvancedFilters] = useState(filterDefaults);

     //update applied Filters when advanced filters is updated
     const appliedFilterList = useMemo(() => {
      return Object.values(advancedFilters).filter(filter => filter.applied && filter.isAdvancedFilter);
    }, [advancedFilters]);

    const resetFilters = () => {
      setAdvancedFilters(filterDefaults);
    }

    const clearIndividualFilter = (element) => {
      switch(element.type){
        case ADV_FIL_TYPES.RANGE:
          setAdvancedFilters((prev) => ({
            ...prev,
            [element.id]: {
              ...prev[element.id],
              min: element.range.min,
              max: element.range.max,
              applied: false
            },
          }))
          break;
        case ADV_FIL_TYPES.MAJORSUB_INPUT:
          setAdvancedFilters((prev) => ({
            ...prev,
            [element.id]: {
              ...prev[element.id],
              inputVal: "",
              applied: false
            },
          }))
          break;
      }
    }

    const updateFilters = (elementID, elementType, payload = {}) => {
      // console.log(`${name} ${type} ${JSON.stringify(payload)}`);
      
      switch(elementType) {
        case ADV_FIL_TYPES.RANGE:
          setAdvancedFilters((prev) => ({
            ...prev,
            [elementID]: {
              ...prev[elementID],
              min: payload.min,
              max: payload.max,
              applied: true
            },
          }))
          break;
        case ADV_FIL_TYPES.BOOLEAN:
          setAdvancedFilters((prev) => ({
            ...prev,
            [elementID]: {
              ...prev[elementID],
              isEnabled: !prev[elementID].isEnabled,
              applied: !prev[elementID].applied
            },
          }))
          break;
          case ADV_FIL_TYPES.MAJORSUB_INPUT:
            setAdvancedFilters((prev) => ({
              ...prev,
              [elementID]: {
                ...prev[elementID],
                inputVal: payload.inputVal,
                applied: payload.inputVal === "" ? false : true
              },
            }))
            break;
      }

      // if(type == 'range'){
      //   // setAdvancedFilters((prev) => ({ ...prev, page: newPage }))
        
        
      // }
    }

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
        <SearchContext.Provider value= {{appliedFilterList, clearIndividualFilter, isRunUniProtSearchById, advancedFilters, updateFilters, resetFilters, setIsRunUniProtSearchById, uniProtSearchId, setUniProtSearchId, isSearchUpdateRequired, setIsSearchUpdateRequired, isFormChanged, setIsFormChanged, searchData, setSearchData, filters, setFilters, pagination, setPagination, handleFiltersChange, handlePageChange, handleRecordsPerPageChange, handleRemoveFilter, getAppliedFilters}}>
            {children}
        </SearchContext.Provider>
    )
}

SearchProvider.propTypes = {
    children: PropTypes.any
}


