import { useState, useEffect } from "react"
import { SUMMARY_PROTEIN_DATA, PYCOM_PROTEIN_DATA, PYCOMWEB_BASE_URL, UNIPROT_DETAIL} from "../constants"
import useFetchProteinSummaryData from "./useFetchProteinSummaryData";
import useFetchProteinFullData from "./useFetchProteinFullData";

const useProteinDetailsDataLoader = (uniprot_ids) => {
    // console.log(requestedDataTypes);
    //dataTypes can be
    // summary this is data from UniProt
    // pycom this is pycom data
    // WIP matrix - we only keep 5 in memory
    // WIPanalysis - we only keep 5 in memory
    // WIP visualisations - we only keep 5 in memory
    
    //SUMMARY DATA
    // const isSummaryRequired = (requestedDataTypes.includes(SUMMARY_PROTEIN_DATA));
    // console.log(`isSummaryRequired: ${isSummaryRequired} ${uniprot_ids}`);
    const { loadingSummary } = useFetchProteinSummaryData([uniprot_ids]);
    
    //PYCOM DATA
    // const isPycomRequired = (requestedDataTypes.includes(PYCOM_PROTEIN_DATA));
    // console.log(`isPycomRequired: ${isPycomRequired} ${uniprot_ids}`);
    const { loadingFull } = useFetchProteinFullData(true, uniprot_ids);

    
    


    // const {proteinRepository, setProteinRepository} = useContext(RepositoryContext);
    // const [error, setError] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    
    //
    // const [summaryChecked, setSummaryChecked] = useState(false);
    // const [pyComChecked, setPyComChecked] = useState(false);
    // const [dataBeingLoaded, setDataBeingLoaded] = useState(null);

    useEffect(() => {
        if(!loadingSummary && !loadingFull) {
            setIsDataLoaded(true);
        }
    }, [loadingSummary, loadingFull]);

    return { isDataLoaded }
}

export default useProteinDetailsDataLoader
