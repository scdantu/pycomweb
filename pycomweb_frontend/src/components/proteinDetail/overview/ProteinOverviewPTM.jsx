import React from 'react'
import styles from '../../../styles/ProteinDetail.module.css'; // Adjust the path as necessary

function ProteinOverviewPTM({ ptm }) {
  
  return (
    <React.Fragment>
      {ptm.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {ptm.map((entry, index) => (
              <tr key={index}>
                <td>{entry}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No PTM associated with this protein.</p>
      )}

    </React.Fragment>
  )
}

export default ProteinOverviewPTM


