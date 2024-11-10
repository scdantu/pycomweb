import { createContext, useState } from "react";
import { propTypes } from "react-bootstrap/esm/Image";
import useFetchProteinSummaryData from "../customHooks/useFetchProteinSummaryData";
export const DownloadContext = createContext(null);

export const DownloadProvider = ({ children }) => {

    const [basket, setBasket] = useState([]);
    useFetchProteinSummaryData(basket); //update summary data when the basket changes

    /**
     * Receive a UniProtId and add it to the basket if it doesn't already exist
     * @param {*} UniProtId 
     */
    const updateBasket = (UniProtId) => {

        //check if value is already in the basket
        if (!basket.includes(UniProtId)) {
            //add new id to basket
            setBasket(current => {
                return [
                    ...current,
                    UniProtId
                ]
            })
        }
    }

    /**
     * Remove item from basket
     * @param {*} UniProtId 
     */
    const removeBasketItem = (UniProtId) => {
        setBasket(arr => arr.filter(arrItem => arrItem !== UniProtId));
    }
    const emptyBasket = () => {
        setBasket([]);
    }

    return (
        <DownloadContext.Provider value={{ basket, updateBasket, removeBasketItem, emptyBasket}}>
            {children}
        </DownloadContext.Provider>
    )
}

DownloadProvider.propTypes = {
    children: propTypes.any
}


