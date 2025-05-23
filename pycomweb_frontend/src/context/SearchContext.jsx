import { createContext, useEffect, useState, useMemo } from "react";
// import { PropTypes } from "prop-types";
import PropTypes from "prop-types";
import { SEARCH_FILTERS, ADV_FIL, ADV_FIL_TYPES} from '../constants';
import { FaX } from 'react-icons/fa6';
// import useFetchQueryProteins from "../customHooks/useFetchQueryProteins";
import useFetchHelpDataAll from "../customHooks/useFetchHelpDataAll";

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
    const [searchErrorMessage, setSearchErrorMessage] = useState({});

    const [filteredSearchList, setFilteredSearchList] = useState([]);

    const [singleSearchDataSets, setSingleSearchDataSets] = useState({});


    //Let's make a look up input, that is a custom component with individual hooks that are called on 'focus'
    const getSingleSearchDataSet = (elementName) => {
      
      if(!singleSearchDataSets[elementName])
      {
        setFilteredSearchList([]);
        const { data } = useFetchHelpDataAll('https://pycom.brunel.ac.uk/api/get-development-stage-list');

        // if(data) {
        //   let result = [];
        //   for (const item of data) {
        //   // if (item.toLowerCase().includes(inputVal.toLowerCase())) {
        //   result.push(item);
        //   if (result.length === resultLimit) break; // Stop once we have 10 matches
        //   }

        //   setFilteredSearchList(result);
        //   }

        // //fetch data
        // //then set filteredSearchList
        // }

        setSingleSearchDataSets((prev) => ({
          ...prev,
            [elementName]: data
          }));
      // console.log(elementName);
      // console.log(singleSearchDataSets[elementName])
    }}

    const validateFilter = (element) => {
      
      let errorMessage = {}
      let validationResult = true;
      
      if (element?.inputVal) {
      
        if (element.validation.regex && !element.validation.regex.test(element.inputVal)) {
        validationResult = false;
        
        errorMessage = ` is not in the correct format.`
        }
      }

      //update messaging
      if(!validationResult) {
        setSearchErrorMessage((prev) => ({
          ...prev,
            [element.id]: errorMessage
          }));
          setAdvancedFilters((prev) => ({
            ...prev,
            [element.id]: {
              ...prev[element.id],
              validation: {
                ...prev[element.id].validation,
                isValid: false}
            }}));
      } else {
        setSearchErrorMessage(prev => {
          const newFilters = { ...prev };
          delete newFilters[element.id];
          return newFilters;
        });
        setAdvancedFilters((prev) => ({
          ...prev,
          [element.id]: {
            ...prev[element.id],
            validation: {
              ...prev[element.id].validation,
              isValid: true}
          }}));
      }
    }

    // filters
    const filterDefaults = {
      [ADV_FIL.SEQUENCE_LENGTH.ID]: {applied: false, apiParamId: 'length', isAdvancedFilter: false, id: ADV_FIL.SEQUENCE_LENGTH.ID, displayname: ADV_FIL.SEQUENCE_LENGTH.DISPLAY_NAME, type: ADV_FIL_TYPES.RANGE, min: 1, max: 500, range: {min: 1, max: 500}},
      [ADV_FIL.HELICAL_STRUCTURE.ID]: {applied: false, apiParamId: 'helix', isAdvancedFilter: true, id: ADV_FIL.HELICAL_STRUCTURE.ID, displayname: ADV_FIL.HELICAL_STRUCTURE.DISPLAY_NAME, type: ADV_FIL_TYPES.RANGE, min: 0, max: 100, range: {min: 0, max: 100}},
      [ADV_FIL.TURN_STRUCTURE.ID]: {applied: false, apiParamId: 'turn', isAdvancedFilter: true, id: ADV_FIL.TURN_STRUCTURE.ID, displayname: ADV_FIL.TURN_STRUCTURE.DISPLAY_NAME, type: ADV_FIL_TYPES.RANGE, min: 0, max: 100, range: {min: 0, max: 100}},
      [ADV_FIL.BETA_STRAND.ID]: {applied: false, apiParamId: 'strand', isAdvancedFilter: true, id: ADV_FIL.BETA_STRAND.ID, displayname: ADV_FIL.BETA_STRAND.DISPLAY_NAME, type: ADV_FIL_TYPES.RANGE, min: 0, max: 100, range: {min: 0, max: 100}},
      [ADV_FIL.PDB.ID]: {applied: false, apiParamId: 'has_pdb', isAdvancedFilter: false, id: ADV_FIL.PDB.ID, displayname: ADV_FIL.PDB.DISPLAY_NAME, type: ADV_FIL_TYPES.BOOLEAN, isEnabled: false},
      [ADV_FIL.PTM.ID]: {applied: false, apiParamId: 'has_ptm', isAdvancedFilter: false, id: ADV_FIL.PTM.ID, displayname: ADV_FIL.PTM.DISPLAY_NAME, type: ADV_FIL_TYPES.BOOLEAN, isEnabled: false},
      [ADV_FIL.SUBTRATE.ID]: {applied: false, apiParamId: 'has_substrate', isAdvancedFilter: false, id: ADV_FIL.SUBTRATE.ID, displayname: ADV_FIL.SUBTRATE.DISPLAY_NAME, type: ADV_FIL_TYPES.BOOLEAN, isEnabled: false},
      [ADV_FIL.DISEASES.ID]: {applied: false, apiParamId: 'has_disease', isAdvancedFilter: false, id: ADV_FIL.DISEASES.ID, displayname: ADV_FIL.DISEASES.DISPLAY_NAME, type: ADV_FIL_TYPES.BOOLEAN, isEnabled: false},
      [ADV_FIL.CATH.ID]: {applied: false, apiParamId: 'cath', isAdvancedFilter: true, id: ADV_FIL.CATH.ID, displayname: ADV_FIL.CATH.DISPLAY_NAME, type: ADV_FIL_TYPES.MAJORSUB_INPUT, inputVal: "", placeholder: "3.* or 3.4.52.48", validation: { isValid: true, regex: /^(\d+)\.?(\d+|\*)?\.?(\d+|\*)?\.?(\d+|\*)?$/ }},
      [ADV_FIL.EC.ID]: {applied: false, apiParamId: 'enzyme', isAdvancedFilter: true, id: ADV_FIL.EC.ID, displayname: ADV_FIL.EC.DISPLAY_NAME, type: ADV_FIL_TYPES.MAJORSUB_INPUT, inputVal: "", placeholder: "3.* or 3.4.52.48", validation: { isValid: true, regex: /^(\d+)\.?(\d+|\*)?\.?(\d+|\*)?\.?(\d+|\*)?$/ }},
      [ADV_FIL.TESTA.ID]: {applied: false, isAdvancedFilter: true, id: ADV_FIL.TESTA.ID, displayname: ADV_FIL.TESTA.DISPLAY_NAME, type: ADV_FIL_TYPES.SINGLE_LOOKUP, inputVal: "", placeholder: "None", validation: { isValid: true, regex: /^(\d+)\.?(\d+|\*)?\.?(\d+|\*)?\.?(\d+|\*)?$/ }},
      [ADV_FIL.BIOLOGICAL_PROCESS.ID]: {applied: false, apiParamId: 'biological_process', isAdvancedFilter: true, id: ADV_FIL.BIOLOGICAL_PROCESS.ID, displayname: ADV_FIL.BIOLOGICAL_PROCESS.DISPLAY_NAME, type: ADV_FIL_TYPES.SINGLE_LOOKUP, inputVal: "", lookupEndPoint: "get-biological-process-list", placeholder: "None", validation: { isValid: true, regex: /^(\d+)\.?(\d+|\*)?\.?(\d+|\*)?\.?(\d+|\*)?$/ }},
      [ADV_FIL.CELLULAR_COMPONENT.ID]: {applied: false, apiParamId: 'cellular_component', isAdvancedFilter: true, id: ADV_FIL.CELLULAR_COMPONENT.ID, displayname: ADV_FIL.CELLULAR_COMPONENT.DISPLAY_NAME, type: ADV_FIL_TYPES.SINGLE_LOOKUP, inputVal: "", lookupEndPoint: "get-cellular-component-list", placeholder: "None", validation: { isValid: true, regex: /^(\d+)\.?(\d+|\*)?\.?(\d+|\*)?\.?(\d+|\*)?$/ }},
      [ADV_FIL.DEVELOPMENTAL_STAGE.ID]: {applied: false, apiParamId: 'developmental_stage', isAdvancedFilter: true, id: ADV_FIL.DEVELOPMENTAL_STAGE.ID, displayname: ADV_FIL.DEVELOPMENTAL_STAGE.DISPLAY_NAME, type: ADV_FIL_TYPES.SINGLE_LOOKUP, inputVal: "", lookupEndPoint: "get-development-stage-list", placeholder: "None", validation: { isValid: true, regex: /^(\d+)\.?(\d+|\*)?\.?(\d+|\*)?\.?(\d+|\*)?$/ }},
      [ADV_FIL.DOMAIN.ID]: {applied: false, apiParamId: 'domain', isAdvancedFilter: true, id: ADV_FIL.DOMAIN.ID, displayname: ADV_FIL.DOMAIN.DISPLAY_NAME, type: ADV_FIL_TYPES.SINGLE_LOOKUP, inputVal: "", lookupEndPoint: "get-domain-list", placeholder: "None", validation: { isValid: true, regex: /^(\d+)\.?(\d+|\*)?\.?(\d+|\*)?\.?(\d+|\*)?$/ }},
      [ADV_FIL.LIGAND.ID]: {applied: false, apiParamId: 'ligand', isAdvancedFilter: true, id: ADV_FIL.LIGAND.ID, displayname: ADV_FIL.LIGAND.DISPLAY_NAME, type: ADV_FIL_TYPES.SINGLE_LOOKUP, inputVal: "", lookupEndPoint: "get-ligand-list", placeholder: "None", validation: { isValid: true, regex: /^(\d+)\.?(\d+|\*)?\.?(\d+|\*)?\.?(\d+|\*)?$/ }},
      [ADV_FIL.MOLECULAR_FUNCTION.ID]: {applied: false, apiParamId: 'molecular_function', isAdvancedFilter: true, id: ADV_FIL.MOLECULAR_FUNCTION.ID, displayname: ADV_FIL.MOLECULAR_FUNCTION.DISPLAY_NAME, type: ADV_FIL_TYPES.SINGLE_LOOKUP, inputVal: "", lookupEndPoint: "get-molecular-function-list", placeholder: "None", validation: { isValid: true, regex: /^(\d+)\.?(\d+|\*)?\.?(\d+|\*)?\.?(\d+|\*)?$/ }},
      [ADV_FIL.PTM_SEARCH.ID]: {applied: false, apiParamId: 'ptm', isAdvancedFilter: true, id: ADV_FIL.PTM_SEARCH.ID, displayname: ADV_FIL.PTM_SEARCH.DISPLAY_NAME, type: ADV_FIL_TYPES.SINGLE_LOOKUP, inputVal: "", lookupEndPoint: "get-ptm-list", placeholder: "None", validation: { isValid: true, regex: /^(\d+)\.?(\d+|\*)?\.?(\d+|\*)?\.?(\d+|\*)?$/ }},
      [ADV_FIL.DISEASES_FILTER.ID]: {applied: false, apiParamId: 'disease', isAdvancedFilter: true, id: ADV_FIL.DISEASES_FILTER.ID, displayname: ADV_FIL.DISEASES_FILTER.DISPLAY_NAME, type: ADV_FIL_TYPES.SINGLE_LOOKUP, inputVal: "", lookupEndPoint: "get-disease-list", placeholder: "None"},
      [ADV_FIL.COFACTORS_FILTER.ID]: {applied: false, apiParamId: 'cofactor', isAdvancedFilter: true, id: ADV_FIL.COFACTORS_FILTER.ID, displayname: ADV_FIL.COFACTORS_FILTER.DISPLAY_NAME, type: ADV_FIL_TYPES.SINGLE_LOOKUP, inputVal: "", lookupEndPoint: "get-cofactor-list", placeholder: "None"},
      [ADV_FIL.ORGANISM_FILTER.ID]: {applied: false, apiParamId: 'organism', isAdvancedFilter: true, id: ADV_FIL.ORGANISM_FILTER.ID, displayname: ADV_FIL.ORGANISM_FILTER.DISPLAY_NAME, type: ADV_FIL_TYPES.SINGLE_LOOKUP, inputVal: "", lookupEndPoint: "get-organism-list", placeholder: "None"}
    };

    // useEffect(() => {
    //   console.log('filterDefaults updated:', filterDefaults);
    // }, [filterDefaults]);

    const [advancedFilters, setAdvancedFilters] = useState(filterDefaults);

     //update applied Filters when advanced filters is updated
     const appliedFilterList = useMemo(() => {
      return Object.values(advancedFilters).filter(filter => filter.applied && filter.isAdvancedFilter);
    }, [advancedFilters]);

    // const [searchLookupData, setSearchLookupData] = useState();

    const resetFilters = () => {
      setAdvancedFilters(filterDefaults);
      setSearchErrorMessage({});
      setFilters({});
      setIsSearchUpdateRequired(true);
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
      console.log('hi');
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
          case ADV_FIL_TYPES.SINGLE_LOOKUP:
            // console.log(`updating ${elementID} ${elementType} ${payload.inputVal}`);
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

  function formatClassification(input, partsCount) {
    // Split the input by dots, filter out empty strings (handles trailing dots)
    const parts = input.split('.').filter(part => part !== '');
  
    // Fill with '*' to ensure 4 parts
    while (parts.length < partsCount) {
      parts.push('*');
    }
  
    // If more than 4 parts, slice down to 4
    return parts.slice(0, 4).join('.');
  }

  const performSearch = () => {
    //reset page for new search results
    setPagination((prev) => ({ ...prev, page: 1 }));
    
    //process advanced filters
    const requestBody = [];
    
    for (const key in advancedFilters) {
      const item = advancedFilters[key];
      // console.log(item);
      switch(item.type) {
        case "BOOLEAN":
          console.log(item);
          if(item.applied === true) {
            requestBody.push({[item.apiParamId]: item.isEnabled});
          }
          break;
        case "RANGE":
          if(item.applied === true) {
            requestBody.push({["min_" + item.apiParamId]: item.min});
            requestBody.push({["max_" + item.apiParamId]: item.max});
          }
          break;
        case "SINGLE_LOOKUP":
          if(item.applied === true) {
            requestBody.push({[item.apiParamId]: item.inputVal});
          }
          break;
        case "MAJORSUB_INPUT":
          if(item.applied === true) {
            requestBody.push({[item.apiParamId]: formatClassification(item.inputVal, 4)});
          }
          break;
      }
      // if (item.valid === true) {
      //   body[item.id] = item.value;
      // }
    }

    console.log(requestBody);
    // setFilters(requestBody);
    // console.log(filters);
    setFilters(requestBody.reduce((acc, curr) => {
       return { ...acc, ...curr };
     }, {}));
    console.log(filters);
    setIsSearchUpdateRequired(true);
    //submit
  }

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
        <SearchContext.Provider value= {{performSearch, filterDefaults, filteredSearchList, getSingleSearchDataSet, setSingleSearchDataSets, singleSearchDataSets, validateFilter, searchErrorMessage, appliedFilterList, clearIndividualFilter, isRunUniProtSearchById, advancedFilters, updateFilters, resetFilters, setIsRunUniProtSearchById, uniProtSearchId, setUniProtSearchId, isSearchUpdateRequired, setIsSearchUpdateRequired, isFormChanged, setIsFormChanged, searchData, setSearchData, filters, setFilters, pagination, setPagination, handleFiltersChange, handlePageChange, handleRecordsPerPageChange, handleRemoveFilter, getAppliedFilters}}>
            {children}
        </SearchContext.Provider>
    )
}

SearchProvider.propTypes = {
    children: PropTypes.any
}


