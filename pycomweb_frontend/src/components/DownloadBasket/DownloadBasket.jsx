import React, { useContext, useEffect, useState } from 'react'
import { RepositoryContext } from '../../context/RepositorContext';
import { DownloadContext } from '../../context/DownloadContext';
import useFetchProteinSummaryData from '../../customHooks/useFetchProteinSummaryData';
// import useDataLoader from '../../customHooks/useDataLoader';
import { SUMMARY_PROTEIN_DATA } from '../../constants';

function DownloadBasket() {
  const { basket, removeBasketItem, emptyBasket} = useContext(DownloadContext);
  const { proteinRepository } = useContext(RepositoryContext);
  // const [downloadSummaryData, setDownloadSummaryData] = useState([]);
  // const [loading, setLoading] = useState(true);
  
  const {loadingSummary} = useFetchProteinSummaryData(basket);
  // const dataRequired = [SUMMARY_PROTEIN_DATA];
  // const {isDataLoaded} = useDataLoader(dataRequired, basket);

  return (
    <>
      <div>
        <br />
        <br />
        {loadingSummary ? (
          <React.Fragment><div><br /><br />Loading</div></React.Fragment>
        ) : (
          <React.Fragment>
          {basket.length > 0 ? (
            <>
            <div className='col-md-2'>{basket.length} items in your basket</div>
            <div>{basket.map(item => (
              <React.Fragment key={item}>
              <>{proteinRepository[item]?.uniprot_id} {proteinRepository[item]?.summaryData?.protein_name || "no name"}&nbsp;<button onClick={()=> removeBasketItem(item)}>delete</button><br /></>
              </React.Fragment>
            ))}</div>
            <div>Download All</div>
            <br />
            <button onClick={()=> emptyBasket()}>Clear All</button>
            </>
          ) : (
            <>
              <div>You have not added any proteins to your download basket</div>
            </>
            
          )}
          </React.Fragment>
        )}
      </div>

    </>
  )
}

export default DownloadBasket
