import React, { useEffect, useRef, useState, useContext, useMemo } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useParams } from 'react-router-dom';
// import Layout from '../Layout/Layout';
// import useFetchProteinDetail from '../customHooks/useFetchProteinDetail';
// import AnalysisSidebarOptions from '../components/proteinDetail/AnalysisSidebarOptions';
// import DetailComponent from '../components/proteinDetail/DetailComponent';
import ProteinOverview from '../components/proteinDetail/ProteinOverview';
import CoevolutionMatrix from '../components/proteinDetail/CoevolutionMatrix';
import CoevolutionAnalysis from '../components/proteinDetail/CoevolutionAnalysis';
import CoevolutionVisualization from '../components/proteinDetail/CoevolutionVisualization';
import { Button } from 'react-bootstrap';
import { FaCartPlus } from 'react-icons/fa';
import { DownloadContext } from '../context/DownloadContext';
import '../assets/css/proteinDetail.css'
// import useFetchProteinSummaryData from '../customHooks/useFetchProteinSummaryData';
// import useFetchProteinFullData from '../customHooks/useFetchProteinFullData';
// import useFetchProteinSummary from '../customHooks/useFetchProteinSummary';
import useFetchProteinAllData from '../customHooks/useFetchProteinAllData';
import { RepositoryContext } from '../context/RepositorContext';
// import styles from '../../styles/ViewTabs.module.css';
import styles from '../styles/ProteinDetail.module.css'; // Adjust the path as necessary

function ProteinDetail() {
  const { uniprot_id } = useParams(); // Get the uniprot_id from the URL

  //const { proteinData, loading} = useFetchProteinDetail(uniprot_id);
  const [selectedSection, setSelectedSection] = useState("detail");
  const [selectedMatrixType, setSelectedMatrixType] = useState(null); // 'simple', 'scaled', 'normalized'
  const [showMatrix, setShowMatrix] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false)
  const matrixRef = useRef(null);
  const [visualizationType, setVisualizationType] = useState('heatmap');

  const { proteinRepository } = useContext(RepositoryContext);
  // const {loadingSummary, error} = useFetchProteinSummaryData(true, [uniprot_id]);
  const { updateBasket } = useContext(DownloadContext);
  const uniprotIds = useMemo(() => [uniprot_id], [uniprot_id]);
  // const { loadingSummary, error } = useFetchProteinSummaryData(uniprotIds);
  //  const {  loadingFull, error } = useFetchProteinFullData(true, uniprotIds);
  const { loadingSummary, error } = useFetchProteinAllData(uniprot_id);

  const data = proteinRepository[uniprot_id] || {};
  const { protein_name = "" } = data.summaryData || {};
  const { organism_id = "" } = data.fullData || {};
  const [view, setView] = useState('overview');

  // console.log(`summaryData: ${JSON.stringify(summaryData)}`);

  // return (<div> I got to here okay</div>)

  // const handleSelectedSection = (section) => {
  //   setSelectedSection(section);
  // }
  // // Function to handle matrix type selection
  // const handleMatrixTypeSelection = (type) => {
  //   setSelectedMatrixType(type);
  // };
  // const handleShowAnalysis = () => {
  //   setShowAnalysis(true);
  //   setShowMatrix(false);
  // };
  // const handleVisualizationSelect = (type) => {
  //   setShowVisualization(true);
  // };

  // Error state
  if (error) {
    return <div>Error: {error}</div>;
  }

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



  // Check if proteinData is available
  // if (proteinData?.fetchedSummaryData === false) {
  //   return <div>No data available</div>;
  // }
  return (
    <>
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.titleNav}>
            <h1 className={styles.title}>{protein_name}</h1>
          </div>
          <div className={styles.identities}>
            <p><a className={styles.identity} href={`https://www.uniprot.org/uniprotkb/${uniprot_id}`} target="_blank" rel="noreferrer noopener"><span><span className={styles.strong}>UniProt ID:</span> <span className={styles.value}>{uniprot_id}</span></span><span className={styles.externalLink}>&#xe89e;</span></a></p>
            <p><a className={styles.identity} href={`https://www.uniprot.org/taxonomy/${organism_id}`} target="_blank" rel="noreferrer noopener"><span><span className={styles.strong}>Organism ID:</span> <span className={styles.value}>{organism_id}</span></span><span className={styles.externalLink}>&#xe89e;</span></a></p>
            {/* <p><span className={styles.strong}>Organism ID:</span> <span className={styles.value}>{organism_id}</span> <span className={styles.externalLink}>&#8599;</span></p> */}

            {/* <a class="organism-link" href="https://www.uniprot.org/taxonomy/561445" target="_blank" rel="noreferrer noopener">561445</a> */}
          </div>
          <nav className={styles.subNav}>
            <div className={styles.subNavPages}>
              <button
                className={`${styles.proteinOverviewNavButton} ${view === 'overview' ? styles.proteinOverviewNavButtonActive : ''}`}
                onClick={() => setView('overview')}
              >
                Overview
              </button>

              <button
                className={`${styles.proteinOverviewNavButton} ${view === 'coevolutionmatrix' ? styles.proteinOverviewNavButtonActive : ''}`}
                onClick={() => setView('coevolutionmatrix')}
              >
                Coevolution Matrix
              </button>

              <button
                className={`${styles.proteinOverviewNavButton} ${view === 'analysis' ? styles.proteinOverviewNavButtonActive : ''}`}
                onClick={() => setView('analysis')}
              >
                Analysis
              </button>

              <button
                className={`${styles.proteinOverviewNavButton} ${view === 'visualisations' ? styles.proteinOverviewNavButtonActive : ''}`}
                onClick={() => setView('visualisations')}
              >
                Visualisations
              </button>
            </div>
            <div>
              <div className={styles.addToDownloadsContainer} onClick={() => updateBasket(uniprot_id)}>
                <span className={styles.addToDownloadsIcon}>&#xf000;</span>
                <p className={styles.addToDownloads}>Add to downloads</p>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {view === 'overview' && (
        <ProteinOverview uniprot_id={uniprot_id} />
      )}

      {view === 'coevolutionmatrix' && (
        <CoevolutionMatrix uniprot_id={uniprot_id} />
      )}
      {view === 'analysis' && (
        <CoevolutionAnalysis uniprot_id={uniprot_id} />
      )}
      {view === 'visualisations' && (
        <CoevolutionVisualization uniprot_id={uniprot_id} />
      )}
    </>
  )
  // 
}

export default ProteinDetail
