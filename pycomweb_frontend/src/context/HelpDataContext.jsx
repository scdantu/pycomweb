import { createContext, useState } from "react";
import { propTypes } from "react-bootstrap/esm/Image";
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
    children: propTypes.any
}
