import { useState, useEffect, useContext } from "react";

import { HelpDataContext } from "../context/HelpDataContext";

function useFetchHelpData(helpDataKey, url) {
    const {helpDataCache, setHelpDataCache} =  useContext(HelpDataContext)
    const [data, setData] = useState(helpDataCache[helpDataKey] || null);
    const [error, setError] =  useState(null);
    const [loading, setLoading] =  useState(!data);
  useEffect(()=>{
    if(!data){
        setLoading(true)
        fetch("https://pycom.brunel.ac.uk/api/"+url)
        .then((response) => response.json())
        .then((result)=>{
            setData(result)
            setHelpDataCache((prev) => ({...prev, helpDataKey:result}));
            setLoading(false);
        })
        .catch((err) => {
            setError(err)
            setLoading(false)
        })
    }
  },[url, data, setHelpDataCache]);

  return  {data, error, loading}
}

export default useFetchHelpData