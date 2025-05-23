import React, { useContext, useState } from 'react'
import { RepositoryContext } from '../../context/RepositorContext';
import { DownloadContext } from '../../context/DownloadContext';
import useFetchProteinSummaryData from '../../customHooks/useFetchProteinSummaryData';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import styles from '../../styles/DownloadBasket.module.css';


function DownloadBasket() {
  const { basket, removeBasketItem, emptyBasket} = useContext(DownloadContext);
  const { proteinRepository } = useContext(RepositoryContext);
  const [isDownloadingComplete, setIsDownloadingComplete] = useState(false);
  const {loadingSummary} = useFetchProteinSummaryData(basket);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [failedItems, setFailedItems] = useState([]);

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

  const updateProgress = (done, total) => {
    setProgress({ done, total });
  };

  const resetProgress = () => {
    setProgress({ done: 0, total: 0 });
    setIsDownloadingComplete(false);
    setFailedItems([]);
  };

  const downloadAll = async (zipFile) => {
    let completed = 0;
    let failedItems = [];
  
    for (const item of basket) {
      try {
        // Get alignment file
        let url = `https://pycom.brunel.ac.uk/alignments/${item}.aln`;
        let filename = `${item}.aln`;
  
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${filename}`);
        const blobData = await response.blob();
  
        // Get coevolution matrix 
        let url2 = `http://127.0.0.1:5000/getProteinMatrices/${item}`;
        let filename2 = `${item}.data`;
  
        const response2 = await fetch(url2);
        if (!response2.ok) throw new Error(`Failed to fetch ${filename2}`);
        const jsonData2 = await response2.json();
  
        // Convert JSON to ASCII string
        let asciiString = '';
        const jsonString = JSON.stringify(jsonData2, null, 2);
        for (let i = 0; i < jsonString.length; i++) {
          const charCode = jsonString.charCodeAt(i);
          if (charCode <= 127) asciiString += jsonString[i];
        }
        const blobData2 = new Blob([asciiString], { type: 'text/plain;charset=ascii' });
  
        // Add files to zip
        let folder = zipFile.folder(item);
        folder.file(filename, blobData);
        folder.file(filename2, blobData2);
  
        // Update progress
        completed += 1;
        updateProgress?.(completed, basket.length);
  
      } catch (error) {
        console.error(`Error processing ${item}:`, error);
        failedItems.push(item);
      }
  }
    // return { completed, failed: failedItems };
    return { failed: failedItems };
  };

  const handleDownloadAll = async () => {
    setIsDownloadingComplete(false);
    setFailedItems([]);

    const zipFile = new JSZip();
    const zipFileDate = getFormattedDate();
  
    const { failed } = await downloadAll(zipFile);
  
    const content = await zipFile.generateAsync({ type: 'blob' });
    saveAs(content, `PyComFiles_${zipFileDate}.zip`);
  
    if (failed.length > 0) {
      setFailedItems(failed);
      // alert(`Download complete with errors. Failed items:\n${failed.join(', ')}`);
    }
    
    setIsDownloadingComplete(true);
  };

//   <div>
//   Downloading... {progress.done} of {progress.total} complete
//   {isDownloadingComplete && (<div>OK</div>)}
// </div>

  return (
    <>
      <div className={styles.DownloadBasketContainer}>
        { /* progress and summary */ }
        {progress.total > 0 && ( 
          <>
          
          {isDownloadingComplete ? (
            <>
            <div>Downloaded {progress.done} of {progress.total}</div>
            
            {failedItems.length > 0 && (
              <div>Some items failed to download: {failedItems.join(', ')}</div>
            )}

            <button onClick={() => resetProgress()}>Okay</button>
            </>
          ) : (
            <div>Downloading... {progress.done} of {progress.total} complete</div>
          )}
          </>
        )}
        
        {loadingSummary ? (
          <React.Fragment><div><br /><br />Loading</div></React.Fragment>
        ) : (
          <React.Fragment>
          {basket.length > 0 ? (
            <>
            <div className={styles.DownloadBasketHeader}>
              <div>Items: <span style={{fontWeight: 700}}>{basket.length}</span></div>
              {/* <div className="DownloadOptions">
                <button onClick={handleDownloadAll}>Download All</button>
                <button onClick={()=> emptyBasket()}>Clear All</button>
              </div> */}
              </div>
            <table className={styles.DownloadBasketTable}>
                {/* header */}
                <tr className={styles.DownloadBasketTableHeader}>
                  <th>Uniprot ID</th>
                  <th>Protein Name</th>
                  <th>Actions</th>
                </tr>

                {/* items */}
                {basket.map(item => (
                  <tr key={item}>
                    <td>{proteinRepository[item]?.uniprot_id}</td>
                    <td>{proteinRepository[item]?.summaryData?.protein_name || "no name"}</td>
                    <td className={styles.DownloadBasketTableActions}>
                        <button className={styles.DownloadDangerButton} onClick={()=> removeBasketItem(item)}>Remove</button>
                        <button className={styles.DownloadActionButton} onClick={handleDownloadAll}>Download</button>
                    </td>
                  </tr>
                ))}
              </table>
              <div className={styles.DownloadBasketTableFooter}>
                <button className={styles.DownloadDangerButton} onClick={()=> emptyBasket()}>Remove All</button>
                <button className={styles.DownloadActionButton} onClick={handleDownloadAll}>Download All</button>
              </div>
            </>
          ) : (
            <>
              <div className={styles.DownloadBasketNoItemsFound}>You have not added any proteins to your download basket</div>
            </>
            
          )}
          </React.Fragment>
        )}


      </div>

    </>
  )
}

export default DownloadBasket
