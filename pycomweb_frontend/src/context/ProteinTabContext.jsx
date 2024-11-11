import { createContext, useState } from "react";
import { propTypes } from "react-bootstrap/esm/Image";
export const ProteinTabContext = createContext(null);

export const ProteinTabProvider = ({children}) =>{
    const [proteinTabs, setProteinTabs] = useState({selectedIndex: -1, tabs: []});
    
    /**
     * Add protein to tabs
     * @param {*} uniprot_id 
     */
    const addProteinToTab = (uniprot_id) => {
        const tabs = proteinTabs.tabs;
        
        if(!tabs.includes(uniprot_id)){
            tabs.push(uniprot_id);
            const length = tabs.length;
            const updatedProteinTabs = {selectedIndex: length-1, tabs};
            
            setProteinTabs(updatedProteinTabs);
        }
    }
    
    /**
     * Remove a protein from the tabs
     * Todo: select a new protein
     * @param {*} uniprot_id 
     */

    const isSelectedTab = async(uniprot_id) => {
        const tabs = proteinTabs.tabs;
        const index = tabs.findIndex(protein => protein === uniprot_id);
        const results = {
            selected: false,
            tabIndex: index,
            tabCount: tabs.length -1
        }

        if(index === proteinTabs.selectedIndex){
            results.selected = true;
            return results;
        }

        return results;
    }

    const removeProteinFromTabs = async (uniprot_id) => {
        //check if item is currently selected item
        const isSelectedResult = await isSelectedTab(uniprot_id);
        const {selected, tabIndex, tabCount} = isSelectedResult;
        let newSelectedIndex = proteinTabs.selectedIndex;
        const tabs = proteinTabs.tabs;

        //calculate new tab index if it is valid
        // we don't need to worry about unselcted tabs that are after the selected tab, no navigation/ui update is required
        if (tabIndex !== -1) {
            //if the tab to be deleted isn't selected
            if(!selected){
                // and its position is before the selected tab
                if(tabIndex < proteinTabs.selectedIndex) {
                    newSelectedIndex = proteinTabs.selectedIndex -1;
                }
            } else { //if the tab to be deleted is selected
                if(tabIndex !== 0){ //and it isn't the first tab
                    newSelectedIndex = tabCount -1;
                } else if(!tabCount > 0) { //or it is the first and only tab
                    newSelectedIndex = -1;
                }
            }
            
            //remove selected protein
            tabs.splice(tabIndex, 1);
            
            //get current proteins
            // const updatedProteinTabs = {selectedIndex: -1, tabs};
            const updatedProteinTabs = {selectedIndex: newSelectedIndex, tabs};
            
            //update state
            setProteinTabs(updatedProteinTabs);
        }
        //return path to navigate to
        if(newSelectedIndex != -1) {
            return `protein/${tabs[newSelectedIndex]}`
        } else {
            return `/`;
        }
    }

    const updateSelectedProtein = (uniprot_id) => {
        
        const tabs = proteinTabs.tabs;
        const index = tabs.findIndex(protein => protein === uniprot_id);
        // index can be -1 if not found, i.e the user selects Search so we currently don't need to test for -1

        //update tab selected index
        const updatedProteinTabs = {selectedIndex: index, tabs};
            
        //update state
        setProteinTabs(updatedProteinTabs);
    }

    return (
        <ProteinTabContext.Provider value= {{isSelectedTab, addProteinToTab, removeProteinFromTabs, updateSelectedProtein, proteinTabs}}>
            {children}
        </ProteinTabContext.Provider>
    )
}

ProteinTabProvider.propTypes = {
    children: propTypes.function
}


