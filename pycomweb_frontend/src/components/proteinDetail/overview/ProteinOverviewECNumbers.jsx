import React from 'react'
import styles from '../../../styles/ProteinDetail.module.css'; // Adjust the path as necessary

function ProteinOverviewECNumbers({ ec_numbers }) {
  
  return (
    <React.Fragment>
      {ec_numbers.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {ec_numbers.map((entry, index) => (
              <tr key={index}>
                <td>{entry}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No EC numbers associated with this protein.</p>
      )}

    </React.Fragment>
  )
}

export default ProteinOverviewECNumbers


