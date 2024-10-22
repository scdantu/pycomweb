import { createContext, useContext, useState } from "react";

export const HelpDataContext = createContext({

});

export const HelpDataProvider = ({children}) =>{
    const [helpDataCache, setHelpDataCache] = useState({});
    const [basket, setBasket] = useState([]);
    
    /*
        Receive a UniProtId and add it to the basket
    */
    const updateBasket = (UniProtId) => {
        
        //check if value is already in the basket
        if(!basket.includes(UniProtId)) {
            //add new id to basket
            setBasket(current => {
                return [
                ...current,
                UniProtId
                ]
            })
        }
    }

    return (
        <HelpDataContext.Provider value= {{helpDataCache, setHelpDataCache, basket, setBasket, updateBasket}}>
            {children}
        </HelpDataContext.Provider>
    )

}
