import React, { useContext } from 'react'
import { HelpDataContext } from "../../context/HelpDataContext";
import { PyComContext } from '../../context/PyComContext';


function DownloadBasket() {
  const { basket, removeItemFromBasket} = useContext(HelpDataContext);
  const {helpDataCache} =  useContext(HelpDataContext)
  const { proteinRepository } = useContext(PyComContext)
  // const { results, result_count, total_pages, page } = data || {};

  // console.log(`${JSON.stringify(helpDataCache)}`);
  console.log(`Protein Repository: ${JSON.stringify(proteinRepository)}` )
  return (
    <>
      <div>
        <br />
        <br />
        {basket.length > 0 ? (
          <>
          <div className='col-md-2'>{basket.length} items in your basket</div>
          <div>{basket.map(item => (
            <React.Fragment key={item}>{item}&nbsp; <button onClick={()=> removeItemFromBasket(item)}>delete</button><br /></React.Fragment>
          ))}</div>
          <div>download</div>
          </>
        ) : (
          <>
            <div>You have not added any proteins to your download basket</div>
          </>
        )}

      </div>

    </>
  )
}

export default DownloadBasket
