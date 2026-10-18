import React from 'react'
import styles from '../../../styles/ProteinDetail.module.css'; // Adjust the path as necessary

function ProteinOverviewPDB({ pdb }) {
  
  return (
    <React.Fragment>
      {pdb.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {pdb.map((entry, index) => (
              <tr key={index}>
                <td>{entry}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No PDB associated with this protein.</p>
      )}

    </React.Fragment>
  )
}

export default ProteinOverviewPDB


