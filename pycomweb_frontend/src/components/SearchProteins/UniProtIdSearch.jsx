import {useRef, useContext} from "react";
import styles from './UniProtIdSearch.module.css'; 
import { FaSearch } from "react-icons/fa";
import { SearchContext } from "../../context/SearchContext";

const UniProtIdSearch = () => {

    const {uniProtSearchId, setUniProtSearchId, setIsRunUniProtSearchById} = useContext(SearchContext);

    const UniProtIdSearchInputRef = useRef(); // create the ref for the search input box

    /**
     * Search by uniprot id
     */
    const handleSearchBtn = () => {
        setIsRunUniProtSearchById(true);
    }

    /**
     * Handle the user keyboard input for special keys
     * @param {*} event 
     */
    const handleSearchBoxKeyDown = (event) => {
        // if enter key is pressed, search for id
        if (event.key == "Enter") {
            handleSearchBtn();
        }

        //if the escape key is pressed, clear the field
        if(event.key === "Escape") {
            setUniProtSearchId("");
        }
    }

    return(
        <div className={styles.uniProtIdSearchContainer}>
            <input
                autoComplete="off"
                className={styles.uniProtIdSearchInput}
                name="uniprot_id"
                onChange={() => setUniProtSearchId(UniProtIdSearchInputRef.current.value)}
                onKeyUp={(e) => handleSearchBoxKeyDown(e)}
                placeholder='UniProt ID'
                ref={UniProtIdSearchInputRef}
                type="text"
                value={uniProtSearchId}
            />
            <button className={styles.uniProtIdSearchGo} onClick={handleSearchBtn} type="button"><FaSearch /></button>
        </div>
    )
}

export default UniProtIdSearch