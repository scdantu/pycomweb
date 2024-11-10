import { createContext, useState } from "react";
import { propTypes } from "react-bootstrap/esm/Image";
export const PyComContext = createContext(null);

export const PyComProvider = ({children}) =>{
    const [proteinRepository, setProteinRepository] = useState([]); //repository of access proteins during a session
    const [proteinTabs, setProteinTabs] = useState({selectedIndex: -1, tabs: []});

    
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
            isHelpDataLoaded: false // for checking if we need to fetch additional data
        }
        
        //if item is not in the repository already
        if(!proteinRepository.some(proteinRepositoryItem => proteinRepositoryItem.uniprot_id === protein.uniprot_id)) {
            //add new protein to the existing repository
            setProteinRepository(currentProteins => {
                return [
                ...currentProteins,
                itemToAdd
                ]
            })
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

    return (
        <PyComContext.Provider value= {{proteinTabs, proteinRepository, addItemToProteinRepository, addItemsToProteinRepository, addHelpDataToProteinRespositoryItem, isHelpDataLoaded}}>
            {children}
        </PyComContext.Provider>
    )
}

// PyComProvider.propTypes = {
//     children: propTypes.function
// }


