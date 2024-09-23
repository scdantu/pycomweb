import { createContext, useContext, useState } from "react";

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
