import React from 'react'
import styles from '../../../styles/ProteinDetail.module.css'; // Adjust the path as necessary

function ProteinOverviewLigands({ ligands }) {
  
  return (
    <React.Fragment>
      {ligands.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {ligands.map((entry, index) => (
              <tr key={index}>
                <td>{entry.id}</td>
                <td>{entry.name || 'No name data available.'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No ligands associated with this protein.</p>
      )}

    </React.Fragment>
  )
}

export default ProteinOverviewLigands


