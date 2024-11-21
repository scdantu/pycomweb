import { useContext, useEffect, useState } from "react"
import axios from "axios"

import { SearchContext } from "../context/SearchContext";

export default function useFetchSearchLookup(id, lookupEndPoint, focused) {

    const { setSingleSearchDataSets, singleSearchDataSets } = useContext(SearchContext);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function getData(lookupEndPoint) {
        // console.log(`got data`);

        // const absoluteURL = "https://pycom.brunel.ac.uk/api/get-development-stage-list";
        // const absoluteURL = "https://pycom.brunel.ac.uk/api/get-disease-list";
        // const url3 = 'get-disease-list'

        const absoluteURL = `https://pycom.brunel.ac.uk/api/${lookupEndPoint}`;

        //https://pycom.brunel.ac.uk/api/get-development-stage-list'

        try {
            setLoading(true)
            const response = await axios.get(absoluteURL)

            setSingleSearchDataSets((prev) => ({
                prev,
                [id]: response.data
            }))
            // console.log(response.data);
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        async function fetchData(lookupEndPoint) {
            // console.log(`getting data`);
            await getData(lookupEndPoint);
        }

        // console.log(`in search hook ${id} ${url} ${focused}`);

        // if the input is not focused return
        if (!focused) {
            // console.log('doing nothing not focused');
            return;
        }

        const { [id]: searchData = {} } = singleSearchDataSets;

        if (Object.keys(searchData).length < 1) {
            // console.log('no data - lets get some');

            fetchData(lookupEndPoint);
            // console.log(`ok we done`)
        }

    }, [id, lookupEndPoint, focused])

    return { loading, error }
    // return { data, error, loading }
}