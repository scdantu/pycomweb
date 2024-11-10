import React, { useEffect, useRef, useState, useContext, useMemo} from 'react';
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
import useFetchProteinSummaryData from '../customHooks/useFetchProteinSummaryData';
import { RepositoryContext } from '../context/RepositorContext';

function ProteinDetail() {
  const { uniprot_id } = useParams(); // Get the uniprot_id from the URL
  
  const { proteinData, loading} = useFetchProteinDetail(uniprot_id);
  const [selectedSection, setSelectedSection] = useState("detail");
  const [selectedMatrixType, setSelectedMatrixType] = useState(null); // 'simple', 'scaled', 'normalized'
  const [showMatrix, setShowMatrix] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false)
  const matrixRef = useRef(null);
  const [visualizationType, setVisualizationType] = useState('heatmap');

  const {proteinRepository} = useContext(RepositoryContext);
  // const {loadingSummary, error} = useFetchProteinSummaryData(true, [uniprot_id]);
  const {loadingSummary, error} = useFetchProteinSummaryData([uniprot_id]);
  // const [proteinData, setProteinData] = useState({});
  // const proteinDataForId = useMemo(() => proteinRepository[uniprot_id], [proteinRepository, uniprot_id]);
  // useEffect(() => {
  //   // console.log(`proteinDataForId: ${JSON.stringify(proteinDataForId)}`);
  //   // if (proteinDataForId) {
  //     // If data is available in the context, update the local state
  //     setProteinData(proteinRepository[uniprot_id]);
  // // }
  // }, [proteinDataForId]);

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
  if (loadingSummary) {
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
  // if (proteinData?.fetchedSummaryData === false) {
  //   return <div>No data available</div>;
  // }
  // 
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

          {/* {console.log(selectedSection)} */}
          {selectedSection === "detail" &&
            <>
            <DetailComponent uniprot_id={uniprot_id} />
            </>
          }
          {selectedSection === "matrix" &&
            // <CoevolutionMatrix proteinData={proteinData} />
            <CoevolutionMatrix uniprot_id={uniprot_id} />
            
          }
          {selectedSection === "analysis" &&
            <CoevolutionAnalysis uniprot_id={uniprot_id} />
          }
          {selectedSection === "visualization" &&
            <CoevolutionVisualization uniprot_id={uniprot_id} />
          }
        </Layout>
      </>
    )
  // 
}

export default ProteinDetail
