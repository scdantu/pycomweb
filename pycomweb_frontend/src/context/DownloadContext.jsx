import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import useFetchProteinSummaryData from "../customHooks/useFetchProteinSummaryData";
export const DownloadContext = createContext(null);
import { useCookies } from 'react-cookie';

export const DownloadProvider = ({ children }) => {

    const [basket, setBasket] = useState([]);
    const [cookies, setCookie, removeCookie] = useCookies(['downloadBasket']);
    const [loading, setLoading] = useState(true);
    useFetchProteinSummaryData(basket); //update summary data when the basket changes

    useEffect(() => {
            //check if cookie exists
            const cookieDownloadBasket = cookies.downloadBasket;
            if(cookieDownloadBasket){
                setBasket(cookieDownloadBasket);
            } else {
                //set default tabs
                const defaultBasket = [];
                setCookie('downloadBasket', defaultBasket, { path: '/', maxAge: 3600 });
                setBasket(defaultBasket);
            }
            setLoading(false);
    }
    , [cookies]);
    
    // useEffect(() => {
    //     //check if basket is empty
    //     if (basket.length === 0) {
    //         removeCookie('downloadBasket', { path: '/' });
    //     } else {
    //         //set cookie with basket
    //         setCookie('downloadBasket', basket, { path: '/', maxAge: 3600 });
    //     }
    // }
    // , [basket]);

    const handleSetCookie = () => {
        // console.log(basket);
        // setCookie('downloadBasket', basket, { path: '/', maxAge: 3600 });
    };

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
    children: PropTypes.any
}


