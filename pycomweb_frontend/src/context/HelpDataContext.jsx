import { createContext, useState } from "react";
import PropTypes from "prop-types";
export const HelpDataContext = createContext({

});

export const HelpDataProvider = ({children}) =>{
    const [helpDataCache, setHelpDataCache] = useState({});
    return (
        <HelpDataContext.Provider value= {{helpDataCache, setHelpDataCache}}>
            {children}
        </HelpDataContext.Provider>
    )

}

HelpDataProvider.propTypes = {
    children: PropTypes.any
}
