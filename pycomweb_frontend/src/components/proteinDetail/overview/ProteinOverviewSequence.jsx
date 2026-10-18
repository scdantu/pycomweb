import React from 'react'
import styles from '../../../styles/ProteinDetail.module.css'; // Adjust the path as necessary

function ProteinOverviewSequence({ sequence }) {

  const formattedSequence = sequence.replace(/(.{10})/g, "$1 ");

  const copyToClipboard = () => {

    navigator.clipboard.writeText(sequence)
      .then(() => {
        //console.log("Copied to clipboard!");
      })
      .catch((err) => {
        //console.error("Failed to copy: ", err);
      });
  };

  return (
    <React.Fragment>
      <div className={styles.dataGridItemHeader}>
        <span></span>
        <div><button className={styles.overviewHeaderAction} onClick={() => copyToClipboard()}>Copy</button></div>
      </div>
      <div className={styles.dataGridItemSequence}>
        {formattedSequence}
      </div>
    </React.Fragment>
  )
}

export default ProteinOverviewSequence
