import React from 'react'

function AnalysisSidebarOptions({ selectedSection, onSectionSelected }) {
  return (
    <div className="sidebar">
      <div className="sidebar-heading">
        <h2>Analysis Options</h2>
      </div>
      <div className="coevolution-sidebar-options">
        <div className="sidebar-Option-wrapper">
          <button onClick={() => onSectionSelected("detail")}
            className={selectedSection === "detail" ? "active" : ""}>View Details</button>
        </div>
        <div className="sidebar-Option-wrapper">
          <button onClick={() => onSectionSelected("matrix")}
            className={selectedSection === "matrix" ? "active" : ""}>Coevolution Matrix</button>
        </div>
        <div className="sidebar-Option-wrapper">
          <button onClick={() => onSectionSelected("analysis")}
            className={selectedSection === "analysis" ? "active" : ""}>Analysis</button>
        </div>
        <div className="sidebar-Option-wrapper">
          <button onClick={() => onSectionSelected("visualization")}
            className={selectedSection === "visualization" ? "active" : ""}>Visualizations</button>
        </div>
      </div>
    </div>
  )
}

export default AnalysisSidebarOptions
