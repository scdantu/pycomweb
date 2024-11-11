import { createContext, useState } from "react";
import PropTypes from "prop-types";
export const RepositoryContext = createContext(null);

export const RepositoryProvider = ({children}) =>{
    const [proteinRepository, setProteinRepository] = useState({}); //repository of access proteins during a session
    
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
        // console.log(`protein ${JSON.stringify(protein)}`);
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

    return (
        <RepositoryContext.Provider value= {{proteinRepository, setProteinRepository, addItemToProteinRepository, addItemsToProteinRepository, isHelpDataLoaded}}>
            {children}
        </RepositoryContext.Provider>
    )
}

RepositoryProvider.propTypes = {
    children: PropTypes.any
}


