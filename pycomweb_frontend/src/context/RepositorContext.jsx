import { createContext, useState } from "react";
import axios from "axios"
// import useFetchProteinSummaryData from "../customHooks/useFetchProteinSummaryData";
import { propTypes } from "react-bootstrap/esm/Image";
export const RepositoryContext = createContext(null);

import { PYCOMWEB_BASE_URL, PYCOMWEB_GET_PROTEIN, UNIPROT_DETAIL} from "../constants"




export const RepositoryProvider = ({children}) =>{
    const [proteinRepository, setProteinRepository] = useState({}); //repository of access proteins during a session
    
    // const { summaryData, loading, error } = useFetchProteinSummaryData(uniprot_ids); //hook to load summary data
    // const [proteinTabs, setProteinTabs] = useState({selectedIndex: -1, tabs: []});

    // const fetchProteinSummaryData = async (uniprot_id) => {
    //     const fetchProteinSummaryDataResult = {
    //         success: false,
    //         message: ""
    //     }

    //     try {
    //         const response = await axios.get(PYCOMWEB_BASE_URL + UNIPROT_DETAIL + uniprot_id);
    //         // const response = await axios.get(url);
    //         const data = response.data
    //         console.log(`data: ${JSON.stringify(data)}`)
    //         // setSummaryProteinData(data[0]);
    //         fetchProteinSummaryDataResult.success = true;
    //         fetchProteinSummaryDataResult.message = "Data Fetched Successfully"
            
    //         setProteinRepository(currentState => ({
    //             ...currentState,
    //             [uniprot_id]: {
    //                 ...currentState[uniprot_id],
    //                 fetchedSummaryData: true,
    //                 summaryData: data
    //             }
    //         }))

    //         // return data[0];
    //         return fetchProteinSummaryDataResult;

    //     } catch (err) {
    //         // setError(err.message);
    //     } finally {
    //         // setLoading(false);
    //     }
    // };


    // function GetSummaryData(value){
    //     const { summaryData } = useFetchProteinSummaryData(value);
    //     return summaryData;
    // }
    
    /**
     * Add protein to protein repository
     * 
     * Check if protein is already in repository using the uniprot_id
     * If it is not in the repository, add it
     * TODO: Optomise with keys for faster retreival options
     * 
     * @param {*} protein 
     */
    const addItemToProteinRepository = (protein) => {
        //get protein and set some default values for other properties we will populate later with help data
        const itemToAdd = {
            ...protein,
            isHelpDataLoaded: false, // for checking if we need to fetch additional data
            fetchedSummaryData: false, // for quick page load [details, downloads]
            fetchedFullData: false, // for quick page load [details]
            summaryData: {}
        }

        // const item = [protein]:
        
        //if item is not in the repository already
        // if(!proteinRepository.some(proteinRepositoryItem => proteinRepositoryItem.uniprot_id === protein.uniprot_id)) {
        // if(!proteinRepository.includes(protein.uniprot_id)) {
            //add new protein to the existing repository
        console.log(`protein ${JSON.stringify(protein)}`);
            if (!Object.prototype.hasOwnProperty.call(proteinRepository, protein.uniprot_id)) {
            setProteinRepository(currentProteins => ({
                ...currentProteins,
                [itemToAdd.uniprot_id]: itemToAdd
                })
            )
        }
    }

    /**
     * Add proteinList to protein respository
     * 
     * Iterate over protein list and call addItemToProteinRepository
     * @param {*} proteinList 
     */
    const addItemsToProteinRepository = (proteinList) => {
        {proteinList.map(protein => {
            addItemToProteinRepository(protein);
        })}
    }
    
    /**
     * Check if help data is loaded for a protein
     * 
     * @param {*} uniprot_id 
     * @returns 
     */
    const isHelpDataLoaded = (uniprot_id) => {
        const protein = proteinRepository.find(proteinRepositoryItem => proteinRepositoryItem.uniprot_id === uniprot_id);
        return protein.isHelpDataLoaded;
        // const  = protein ? protein.name : null;
    }

    /**
     * Add help data for a particular protein to the repository
     * 
     * TODO: Called when loading protein details or when accessing the basket via a fetcher 
     * @param {*} helpData 
     */
    const addHelpDataToProteinRespositoryItem = (helpData) => {
        console.log(JSON.stringify(helpData));
    }

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
    
    // /**
    //  * Remove a protein from the tabs
    //  * Todo: select a new protein
    //  * @param {*} uniprot_id 
    //  */

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

    // const setSummaryData = (uniprot_id, summaryData) => {
        
    //     setProteinRepository(currentState => ({
    //         ...currentState,
    //         [uniprot_id]: {
    //             ...currentState[uniprot_id],
    //             fetchedSummaryData: true,
    //             summaryData
    //         }
    //     }))
        
        
        
    //     console.log(`number of proteins to check ${uniprot_ids.length}`);
        
    //     // Object.keys
    //     // Object.values
    //     Object.entries(uniprot_ids).map(([key, value]) => {
    //         console.log(`${key} ${value}`);
    //         console.log(`datapoint: ${proteinRepository[value]?.fetchedSummaryData}`);

    //         if(!proteinRepository[value]?.fetchedSummaryData) {
    //             console.log(`Loading summary data for ${value}`);
                
    //             const summary = fetchProteinSummaryData(value);

    //             // const summary = GetSummaryData(value);
    //             console.log(summary);
    //         }
    //     });

    // const getProteinSummaryData = async (uniprot_ids) => {
    //     console.log(`number of proteins to check ${uniprot_ids.length}`);
        
    //     // Object.keys
    //     // Object.values
    //     Object.entries(uniprot_ids).map(([key, value]) => {
    //         console.log(`${key} ${value}`);
    //         console.log(`datapoint: ${proteinRepository[value]?.fetchedSummaryData}`);

    //         if(!proteinRepository[value]?.fetchedSummaryData) {
    //             console.log(`Loading summary data for ${value}`);
                
    //             const summary = fetchProteinSummaryData(value);

    //             // const summary = GetSummaryData(value);
    //             console.log(summary);
    //         }
    //     });

    //     const summaryData = []
    //     const proteinSummary = {
    //         "uniprot_id": "123",
    //         "protein_name": "Protein MGF 100-1R",
    //         "sequence_length": 122           
    //     }
    //     const proteinSummary2 = {
    //         "uniprot_id": "124",
    //         "protein_name": "Protein MGF 100-1R",
    //         "sequence_length": 124          
    //     }
    //     summaryData.push(proteinSummary);
    //     summaryData.push(proteinSummary2);

    //     return summaryData;
    // }

    return (
        <RepositoryContext.Provider value= {{proteinRepository, setProteinRepository, addItemToProteinRepository, addItemsToProteinRepository, addHelpDataToProteinRespositoryItem, isHelpDataLoaded}}>
            {children}
        </RepositoryContext.Provider>
    )
}

// PyComProvider.propTypes = {
//     children: propTypes.function
// }


