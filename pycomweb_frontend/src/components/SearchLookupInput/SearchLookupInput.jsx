import React, { useContext, useEffect, useRef, useState } from 'react'
import { SearchContext } from '../../context/SearchContext';
import useFetchSearchLookup from '../../customHooks/useFetchSearchLookup';
import styles from "../../styles/SearchLookupInput.module.css";

const SearchLookupInput = (element) => {

    const { singleSearchDataSets } = useContext(SearchContext);

    const [focused, setFocused] = React.useState(false)
    const onFocus = () => { setShowList(true), setFocused(true)}
    const onBlur = () => {setFocused(false)}
    const [filteredList, setFilteredList] = useState([]);
    const [showList, setShowList] = useState(false);
    // return <input type="text" onFocus={onFocus} onBlur={onBlur} />
    const [searchType, setSearchType] = useState("LIST");

    const { loading, error } = useFetchSearchLookup(element.id, element.lookupEndPoint, focused);

    const { [element.id]: lookUpItems = {} } = singleSearchDataSets;
    const lookUpItemsCount = Object.keys(lookUpItems).length;

    const inputRef = useRef();
    const resultLimit = 5;


    const filterFunction = () => {
        //we only want the first x matches
        let result = [];
        if (lookUpItemsCount > 0) {
        for (const item of lookUpItems) {
            if (
                Object.values(item).some((value) =>
                    String(value).toLowerCase().includes(element.inputVal.toLowerCase().trim())
                )
            ) {
                // console.log(item);
                // result.push(item); // Add the matching item to the result array
                result.push(Object.values(item).join(' '));
                if (result.length === resultLimit) break; // Stop after collecting 5 matches
            }

            // console.log(item);
            //   if (item.toLowerCase().includes(element.inputVal.toLowerCase())) {
            // result.push(item);
            if (result.length === resultLimit) break; // Stop once we have 10 matches
            //   }

            setFilteredList(result);
        }
    }
    }

    const filterFunctionStart = () => {
        //we only want the first x matches
        let result = [];
        if (lookUpItemsCount > 0) {
        for (const item of lookUpItems) {
            if (
                Object.values(item).some((value) =>
                    String(value).toLowerCase().startsWith(element.inputVal.toLowerCase().trim())
                )
            ) {
                // console.log(item);
                // result.push(item); // Add the matching item to the result array
                result.push(Object.values(item).join(' '));
                if (result.length === resultLimit) break; // Stop after collecting 5 matches
            }

            // console.log(item);
            //   if (item.toLowerCase().includes(element.inputVal.toLowerCase())) {
            // result.push(item);
            if (result.length === resultLimit) break; // Stop once we have 10 matches
            //   }

            setFilteredList(result);
        }
    }
    }

    //debounce input
    useEffect(() => {
        switch(searchType){
            case "LIST":
                if (inputRef.current.value) {
                    const getData = setTimeout(() => {
                        filterFunction();
                    }, 200)
        
                    return () => clearTimeout(getData)
                } else {
                    if (inputRef.current.value === "") {
                        //show first x results
                        if (lookUpItemsCount > 0) {
                            let result = [];
                            for (const item of lookUpItems) {
                                // console.log(item);
                                result.push(Object.values(item).join(' ')); // Add the matching item to the result array
                                if (result.length === resultLimit) break; // Stop after collecting 5 matches
                            }
                            setFilteredList(result);
                        }
                    }
                }


            break;
            case "INCLUDES":
                console.log('sorting includes');
                if (inputRef.current.value) {
                    const getData = setTimeout(() => {
                        filterFunction();
                    }, 200)
        
                    return () => clearTimeout(getData)
                } else {
                    if (inputRef.current.value === "") {
                        //show first x results
                        if (lookUpItemsCount > 0) {
                            let result = [];
                            for (const item of lookUpItems) {
                                // console.log(item);
                                result.push(Object.values(item).join(' ')); // Add the matching item to the result array
                                if (result.length === resultLimit) break; // Stop after collecting 5 matches
                            }
                            setFilteredList(result);
                        }
                    }
                }
            break;
            case "STARTS":
                console.log('sorting includes');
                if (inputRef.current.value) {
                    const getData = setTimeout(() => {
                        filterFunctionStart();
                    }, 200)
        
                    return () => clearTimeout(getData)
                } else {
                    if (inputRef.current.value === "") {
                        //show first x results
                        if (lookUpItemsCount > 0) {
                            let result = [];
                            for (const item of lookUpItems) {
                                // console.log(item);
                                result.push(Object.values(item).join(' ')); // Add the matching item to the result array
                                if (result.length === resultLimit) break; // Stop after collecting 5 matches
                            }
                            setFilteredList(result);
                        }
                    }
                }
            break;
        }
        
        
        
    }, [element.inputVal, lookUpItems, searchType])




    // useEffect = () => {
    //     if(focused)
    // }, [focused];

    const { updateFilters } = useContext(SearchContext);

    const handleSearchInputChange = (e) => {
        if (e != element.inputVal) {
            let payload = {
                inputVal: e
            }
            updateFilters(element.id, element.type, payload)
        }
    };

    const setInputValue = (e) => {
        if (e != element.inputVal) {
            let payload = {
                inputVal: e
            }
            updateFilters(element.id, element.type, payload)
        }
        
        setShowList(false)
        // listRef.current.style.visiblity = "initial";
        //inputRef.current.blur();
        // setInputVal(val);
        // setFilteredList([]);
    
        // inputRef.currentValue = val;
      }

      const SearchList = () => { 
        
        if(lookUpItems <1 && !loading) {
            return (<li>No items</li>)
        }

        if(lookUpItemsCount < 1 && loading) {
            return (<li>Fetching data</li>)
        }

        if(lookUpItemsCount > 0 && filteredList.length > 0) {
            const formattedResults = filteredList.map(item =>
                item.replace(new RegExp(element.inputVal, 'gi'), match => `<span style="color: red;">${match}</span>`)
            );
            
            return (
                formattedResults.map((item, index) => (
            // <li key={item} onClick={() => setInputValue(item)}><p>{item}</p></li>
            <li key={filteredList[index]} onMouseDown={() => setInputValue(filteredList[index])}><p dangerouslySetInnerHTML={{ __html: item }} /></li>
        )
        ))}

        if(lookUpItemsCount > 0 && filteredList.length === 0) {
            return (<li>No items found with input</li>)
        }

        return (<li>Error in Data Fetch</li>);
    }

    const IncludesList = () => {
        //colour match

        
        
        
        if(lookUpItemsCount > 0 && filteredList.length > 0) {
            const formattedResults = filteredList.map(item =>
                item.replace(new RegExp(element.inputVal, 'gi'), match => `<span style="color: red;">${match}</span>`)
            );
            
            // const output = formattedResults.slice(0, -1).join(', ') + (filteredList.length > 1 ? ' and ' : '') + formattedResults.slice(-1);
            const output = formattedResults.join('<br />');// + (filteredList.length > 1 ? ' and ' : '') + formattedResults.slice(-1);

            return (<div style={{color: "#ffffff"}}>Submitting this search would include values such as: <div dangerouslySetInnerHTML={{ __html: output }} /></div>);
        }
        
        return (<div>includes</div>)
    }

    const StartList = () => {
        //colour match

        
        
        
        if(lookUpItemsCount > 0 && filteredList.length > 0) {
            const formattedResults = filteredList.map(item =>
                item.replace(new RegExp(element.inputVal, 'gi'), match => `<span style="color: red;">${match}</span>`)
            );
            
            // const output = formattedResults.slice(0, -1).join(', ') + (filteredList.length > 1 ? ' and ' : '') + formattedResults.slice(-1);
            const output = formattedResults.join('<br />');// + (filteredList.length > 1 ? ' and ' : '') + formattedResults.slice(-1);

            return (<div style={{color: "#ffffff"}}>Submitting this search would include values such as: <div dangerouslySetInnerHTML={{ __html: output }} /></div>);
        }
        
        return (<div>includes</div>)
    }

    const SetTypeAndFocus = (t) => {
        setSearchType(t);
        inputRef.current.focus();
    }
    
    return (
        <React.Fragment>
            <div className={styles.DropDownContent}>
                <label>{element.displayname}</label>
                <div>
                    <input ref={inputRef} className={styles.InputList} type="text" placeholder={element.placeholder} onFocus={onFocus} onBlur={onBlur} value={element.inputVal} onChange={(event) => handleSearchInputChange(event.target.value)} />

                    {showList && (
                    <div className={styles.List}>
                        <div className={styles.searchInputType}>
                            <input type="radio" onClick={() => SetTypeAndFocus("LIST")} checked={searchType == "LIST" && "checked"} name="searchInputType" /> List
                            <input type="radio" onClick={() => SetTypeAndFocus("INCLUDES")} checked={searchType == "INCLUDES" && "checked"}name="searchInputType"/> Includes
                            <input type="radio" onClick={() => SetTypeAndFocus("STARTS")} checked={searchType == "STARTS" && "checked"}name="searchInputType"/> Starts
                            <input type="radio" onClick={() => SetTypeAndFocus("MULTI")} checked={searchType == "MULTI" && "checked"}name="searchInputType"/> Multi
                        </div>

                        {searchType == "LIST" && (<SearchList />) }
                        {searchType == "INCLUDES" && (<IncludesList />) }
                        {searchType == "STARTS" && (<StartList />) }

                        {/* {lookUpItemsCount < 1 && !loading && (
                            <li>No items</li>
                        )}
                        {lookUpItemsCount < 1 && loading && (
                            <li>Fetching data</li>
                        )}
                        {lookUpItemsCount > 0 && filteredList.length > 0 && filteredList.map(item => (
                            <li key={item} onClick={() => setInputValue(item)}><p>{item}</p></li>
                        )
                        )}
                        {lookUpItemsCount > 0 && filteredList.length === 0 && (
                            <li>No items found with input</li>

                        )} */}
                    </div>
                    )}
                </div>
            </div>


        </React.Fragment>
    )
}

export default SearchLookupInput;