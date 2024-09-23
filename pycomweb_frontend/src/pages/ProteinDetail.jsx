import React, { useEffect, useRef, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useParams } from 'react-router-dom';
import Layout from '../Layout/Layout';
import useFetchProteinDetail from '../customHooks/useFetchProteinDetail';
import AnalysisSidebarOptions from '../components/proteinDetail/AnalysisSidebarOptions';
import DetailComponent from '../components/proteinDetail/DetailComponent';
import CoevolutionMatrix from '../components/proteinDetail/CoevolutionMatrix';
import CoevolutionAnalysis from '../components/proteinDetail/CoevolutionAnalysis';
import CoevolutionVisualization from '../components/proteinDetail/CoevolutionVisualization';
import { Button } from 'react-bootstrap';
import '../assets/css/proteinDetail.css'


function ProteinDetail() {
  const { uniprot_id } = useParams(); // Get the uniprot_id from the URL
  const { proteinData, loading, error } = useFetchProteinDetail(uniprot_id)
  const [selectedSection, setSelectedSection] = useState("detail");
  const [selectedMatrixType, setSelectedMatrixType] = useState(null); // 'simple', 'scaled', 'normalized'
  const [showMatrix, setShowMatrix] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false)
  const matrixRef = useRef(null);
  const [visualizationType, setVisualizationType] = useState('heatmap');

  // Scroll to matrix when a new type is selected
  // useEffect(() => {
  //   if (selectedMatrixType && matrixRef.current) {
  //     matrixRef.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }, [selectedMatrixType]);

  const handleSelectedSection = (section) => {
    setSelectedSection(section);
  }
  // Function to handle matrix type selection
  const handleMatrixTypeSelection = (type) => {
    setSelectedMatrixType(type);
  };
  const handleShowAnalysis = () => {
    setShowAnalysis(true);
    setShowMatrix(false);
  };
  const handleVisualizationSelect = (type) => {
    setShowVisualization(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="d-flex align-items-center">
        <Button variant="dark" disabled>
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          Loading...
        </Button>
      </div>

    );
  }

  // Error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Check if proteinData is available
  if (!proteinData || proteinData.length === 0) {
    return <div>No data available</div>;
  }
  return (
    <>
      <Layout
        sidebar={
          <AnalysisSidebarOptions
            onSectionSelected={handleSelectedSection}
            selectedSection={selectedSection}
            onMatrixTypeSelect={handleMatrixTypeSelection}
            onShowAnalysis={handleShowAnalysis}
            onVisualizationSelect={handleVisualizationSelect}
          />}>

        {console.log(selectedSection)}
        {selectedSection === "detail" &&
          <DetailComponent data={proteinData} />
        }
        {selectedSection === "matrix" &&
          <CoevolutionMatrix proteinData={proteinData} />
        }
        {selectedSection === "analysis" &&
          <CoevolutionAnalysis proteinData={proteinData} />
        }
        {selectedSection === "visualization" &&
          <CoevolutionVisualization proteinData={proteinData} />
        }


        {/* {selectedMatrixType && proteinData && (
          <div ref={matrixRef}>
            <h3>Matrix: {selectedMatrixType.charAt(0).toUpperCase() + selectedMatrixType.slice(1)}</h3>
            <CoevolutionMatrix
              matrix={proteinData[`matrix${selectedMatrixType === 'simple' ? '' : `_${selectedMatrixType.charAt(0).toUpperCase()}`}`]}
              residues={proteinData.sequence.split('')}
              matrixType={selectedMatrixType}
            />
          </div>
        )}
        {showAnalysis && proteinData && (
          <CoevolutionAnalysis proteinData={proteinData} />
        )}
        {console.log("before visual")}
        {console.log(proteinData)}
        {showVisualization && proteinData && (
          <CoevolutionVisualization proteinData={proteinData} />
        )} */}
      </Layout>
    </>
  )


  // return (
  //   <div>
  //     <h2>Protein Data Table</h2>
  //     <table>
  //       <thead>
  //         <tr>
  //           <th>Key</th>
  //           <th>Value</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {Object.entries(proteinData).map(([key, value], index) => {
  //           if (key !== "matrix") {
  //             return (
  //               <tr key={index}>
  //                 <td>{key}</td>
  //                 <td>{value.toString()}</td>
  //               </tr>
  //             );
  //           }
  //           return null; // Skip matrix key
  //         })}
  //       </tbody>
  //     </table>

  //     <div className="matrix-container">
  //       <h2>Matrix Data</h2>
  //       <table>
  //         <tbody>
  //           {firstProteinData.matrix.map((row, rowIndex) => (
  //             <tr key={rowIndex}>
  //               {row.map((cell, cellIndex) => (
  //                 <td key={cellIndex}>{cell}</td>
  //               ))}
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>
  //   </div>
  // );

}

export default ProteinDetail
