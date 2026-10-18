import React from 'react'
import styles from '../../../styles/ProteinDetail.module.css'; // Adjust the path as necessary

function ProteinOverviewDiseases({ diseases }) {
  return (
    <React.Fragment>
      {diseases.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {diseases.map((entry, index) => (
              <tr key={index}>
                <td>{entry.disease_id}</td>
                <td>{entry.disease || 'No description available.'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No diseases associated with this protein.</p>
      )}
    </React.Fragment>
  )
}

export default ProteinOverviewDiseases


