import React, { useContext } from 'react'
import { RepositoryContext } from '../../context/RepositorContext';
import { DownloadContext } from '../../context/DownloadContext';
import useFetchProteinSummaryData from '../../customHooks/useFetchProteinSummaryData';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function DownloadBasket() {
  const { basket, removeBasketItem, emptyBasket} = useContext(DownloadContext);
  const { proteinRepository } = useContext(RepositoryContext);
  
  const {loadingSummary} = useFetchProteinSummaryData(basket);

  function getFormattedDate(date = new Date()) {
    const year = date.toLocaleString('default', { year: 'numeric' });
    const month = date.toLocaleString('default', { month: '2-digit' }).padStart(2, 0);
    const day = date.toLocaleString('default', { day: '2-digit' }).padStart(2, 0);
    const hour = date.toLocaleString('default', { hour: '2-digit'}).padStart(2, 0);
    const minute = date.toLocaleString('default', { minute: '2-digit'}).padStart(2, 0);
    const second = date.toLocaleString('default', { second: '2-digit'}).padStart(2, 0);
    
    const datePart = [year, month, day].join('-');
    const timePart = [hour, minute, second].join('-');
    return `${datePart}_${timePart}`;
  }

  const downloadAll = async () => {
    const zipFileDate = getFormattedDate();
    const zipFile = new JSZip();

    // Sarath what data needs to be downloaded?
    // -- Can that be selectable, ie include Matrix, Bar charts, etc.
    // -- What format?

    // Sarath needs to let us know what the api is for download - does it exist?

    // 50 ids
    // take 10
    // download, make a zip
    // get next 10, make a zip

    //Pycom file set 1 - yymmdd
    //Pycom file set 2...


    await Promise.all(
      basket.map(async (item) => {
        //get alignment file
        let url = `https://pycom.brunel.ac.uk/alignments/${item}.aln`
        let filename = `${item}.aln`
        const response = await fetch(url)
        const blobData = await response.blob();
        
        //create a folder for the data
        let folder = zipFile.folder(item);
        //add file to the folder
        folder.file(filename, blobData);
      })
    )

    // save zip file to user computer
    zipFile.generateAsync({type: 'blob'}).then((content) => {
      saveAs(content, `PyComFiles_${zipFileDate}.zip`);
    });
  }

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
            <button onClick={() => downloadAll()}>Download All</button>
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
