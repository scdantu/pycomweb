import { createContext, useEffect, useState } from "react";
import { propTypes } from "react-bootstrap/esm/Image";
import { SEARCH_FILTERS } from '../constants';
import { FaX } from 'react-icons/fa6';
import useFetchQueryProteins from "../customHooks/useFetchQueryProteins";


export const SearchContext = createContext(null);

export const SearchProvider = ({children}) =>{
    const [proteinRepository, setProteinRepository] = useState([]); //repository of access proteins during a session
    const [proteinTabs, setProteinTabs] = useState({selectedIndex: -1, tabs: []});
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
    // console('changed');
    setFilters(newFilters);
    // setPagination((prev) => ({ ...prev, page: 1 })); // Reset page to 1 on filter change
    // setIsFormChanged(true);
  };

  const handlePageChange = (newPage) => {
    console.log(newPage);
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


    /**
     * Add protein to protein repository
     * 
     * Check if protein is already in repository using the uniprot_id
     * If it is not in the repository, add it
     * TODO: Optomise with keys for faster retreival options
     * 
     * @param {*} protein 
     */
    // const addItemToProteinRepository = (protein) => {
    //     //get protein and set some default values for other properties we will populate later with help data
    //     const itemToAdd = {
    //         ...protein,
    //         isHelpDataLoaded: false // for checking if we need to fetch additional data
    //     }
        
    //     //if item is not in the repository already
    //     if(!proteinRepository.some(proteinRepositoryItem => proteinRepositoryItem.uniprot_id === protein.uniprot_id)) {
    //         //add new protein to the existing repository
    //         setProteinRepository(currentProteins => {
    //             return [
    //             ...currentProteins,
    //             itemToAdd
    //             ]
    //         })
    //     }
    // }

    /**
     * Add proteinList to protein respository
     * 
     * Iterate over protein list and call addItemToProteinRepository
     * @param {*} proteinList 
     */
    // const addItemsToProteinRepository = (proteinList) => {
    //     {proteinList.map(protein => {
    //         addItemToProteinRepository(protein);
    //     })}
    // }
    
    /**
     * Check if help data is loaded for a protein
     * 
     * @param {*} uniprot_id 
     * @returns 
     */
    // const isHelpDataLoaded = (uniprot_id) => {
    //     const protein = proteinRepository.find(proteinRepositoryItem => proteinRepositoryItem.uniprot_id === uniprot_id);
    //     return protein.isHelpDataLoaded;
    //     // const  = protein ? protein.name : null;
    // }

    /**
     * Add help data for a particular protein to the repository
     * 
     * TODO: Called when loading protein details or when accessing the basket via a fetcher 
     * @param {*} helpData 
     */
    // const addHelpDataToProteinRespositoryItem = (helpData) => {
    //     console.log(JSON.stringify(helpData));
    // }

    /**
     * Add protein to tabs
     * @param {*} uniprot_id 
     */
    // const addProteinToTab = (uniprot_id) => {
    //     const tabs = proteinTabs.tabs;
        
    //     if(!tabs.includes(uniprot_id)){
    //         tabs.push(uniprot_id);
    //         const length = tabs.length;
    //         const updatedProteinTabs = {selectedIndex: length-1, tabs};
            
    //         setProteinTabs(updatedProteinTabs);
    //     }
    // }
    
    /**
     * Remove a protein from the tabs
     * Todo: select a new protein
     * @param {*} uniprot_id 
     */

    // const isSelectedTab = async(uniprot_id) => {
    //     const tabs = proteinTabs.tabs;
    //     const index = tabs.findIndex(protein => protein === uniprot_id);
    //     const results = {
    //         selected: false,
    //         tabIndex: index,
    //         tabCount: tabs.length -1
    //     }

    //     if(index === proteinTabs.selectedIndex){
    //         results.selected = true;
    //         return results;
    //     }

    //     return results;
    // }

    // const removeProteinFromTabs = async (uniprot_id) => {
    //     //check if item is currently selected item
    //     const isSelectedResult = await isSelectedTab(uniprot_id);
    //     const {selected, tabIndex, tabCount} = isSelectedResult;
    //     let newSelectedIndex = proteinTabs.selectedIndex;
    //     const tabs = proteinTabs.tabs;

    //     //calculate new tab index if it is valid
    //     // we don't need to worry about unselcted tabs that are after the selected tab, no navigation/ui update is required
    //     if (tabIndex !== -1) {
    //         //if the tab to be deleted isn't selected
    //         if(!selected){
    //             // and its position is before the selected tab
    //             if(tabIndex < proteinTabs.selectedIndex) {
    //                 newSelectedIndex = proteinTabs.selectedIndex -1;
    //             }
    //         } else { //if the tab to be deleted is selected
    //             if(tabIndex !== 0){ //and it isn't the first tab
    //                 newSelectedIndex = tabCount -1;
    //             } else if(!tabCount > 0) { //or it is the first and only tab
    //                 newSelectedIndex = -1;
    //             }
    //         }
            
    //         //remove selected protein
    //         tabs.splice(tabIndex, 1);
            
    //         //get current proteins
    //         // const updatedProteinTabs = {selectedIndex: -1, tabs};
    //         const updatedProteinTabs = {selectedIndex: newSelectedIndex, tabs};
            
    //         //update state
    //         setProteinTabs(updatedProteinTabs);
    //     }
    //     //return path to navigate to
    //     if(newSelectedIndex != -1) {
    //         return `protein/${tabs[newSelectedIndex]}`
    //     } else {
    //         return `/`;
    //     }
    // }

    // const updateSelectedProtein = (uniprot_id) => {
        
    //     const tabs = proteinTabs.tabs;
    //     const index = tabs.findIndex(protein => protein === uniprot_id);
    //     // index can be -1 if not found, i.e the user selects Search so we currently don't need to test for -1

    //     //update tab selected index
    //     const updatedProteinTabs = {selectedIndex: index, tabs};
            
    //     //update state
    //     setProteinTabs(updatedProteinTabs);
    // }

    return (
        <SearchContext.Provider value= {{isRunUniProtSearchById, setIsRunUniProtSearchById, uniProtSearchId, setUniProtSearchId, isSearchUpdateRequired, setIsSearchUpdateRequired, isFormChanged, setIsFormChanged, searchData, setSearchData, filters, setFilters, pagination, setPagination, handleFiltersChange, handlePageChange, handleRecordsPerPageChange, handleRemoveFilter, getAppliedFilters}}>
            {children}
        </SearchContext.Provider>
    )
}

// PyComProvider.propTypes = {
//     children: propTypes.function
// }


