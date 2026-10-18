import { useState, useContext } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useParams } from 'react-router-dom';
import ProteinOverview from '../components/proteinDetail/ProteinOverview';
import CoevolutionMatrix from '../components/proteinDetail/CoevolutionMatrix';
import CoevolutionAnalysis from '../components/proteinDetail/CoevolutionAnalysis';
import CoevolutionVisualization from '../components/proteinDetail/CoevolutionVisualization';
import { DownloadContext } from '../context/DownloadContext';
import '../assets/css/proteinDetail.css'
import useFetchProteinAllData from '../customHooks/useFetchProteinAllData';
import { RepositoryContext } from '../context/RepositorContext';
import styles from '../styles/ProteinDetail.module.css';

function ProteinDetail() {
  const { uniprot_id } = useParams();

  const { proteinRepository } = useContext(RepositoryContext);
  const { updateBasket } = useContext(DownloadContext);
  const { loadingSummary, error } = useFetchProteinAllData(uniprot_id);

  const data = proteinRepository[uniprot_id] || {};
  const { protein_name = "" } = data.summaryData || {};
  const { organism_id = "" } = data.fullData || {};
  const [view, setView] = useState('overview');

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loadingSummary) {
    return (
      <main className={styles.proteinContent}>
        <div className={styles.overviewPage}>
          <div className={styles.loadingState} role="status">
            <Spinner animation="border" size="sm" aria-hidden="true" />
            Loading protein…
          </div>
        </div>
      </main>
    );
  }



  return (
    <>
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.headerInner}>
            <div className={styles.titleNav}>
              <h1 className={styles.title}>{protein_name}</h1>
            </div>
            <div className={styles.identities}>
              <p><a className={styles.identity} href={`https://www.uniprot.org/uniprotkb/${uniprot_id}`} target="_blank" rel="noreferrer noopener"><span><span className={styles.strong}>UniProt ID:</span> <span className={styles.value}>{uniprot_id}</span></span><span className={styles.externalLink}>&#xe89e;</span></a></p>
              <p><a className={styles.identity} href={`https://www.uniprot.org/taxonomy/${organism_id}`} target="_blank" rel="noreferrer noopener"><span><span className={styles.strong}>Organism ID:</span> <span className={styles.value}>{organism_id}</span></span><span className={styles.externalLink}>&#xe89e;</span></a></p>
            </div>
            <nav className={styles.subNav}>
              <div className={styles.subNavPages}>
              <button
                className={`${styles.proteinOverviewNavButton} ${view === 'overview' ? styles.proteinOverviewNavButtonActive : ''}`}
                aria-current={view === 'overview' ? 'page' : undefined}
                onClick={() => setView('overview')}
              >
                Overview
              </button>

              <button
                className={`${styles.proteinOverviewNavButton} ${view === 'coevolutionmatrix' ? styles.proteinOverviewNavButtonActive : ''}`}
                aria-current={view === 'coevolutionmatrix' ? 'page' : undefined}
                onClick={() => setView('coevolutionmatrix')}
              >
                Coevolution Matrix
              </button>

              <button
                className={`${styles.proteinOverviewNavButton} ${view === 'analysis' ? styles.proteinOverviewNavButtonActive : ''}`}
                aria-current={view === 'analysis' ? 'page' : undefined}
                onClick={() => setView('analysis')}
              >
                Analysis
              </button>

              <button
                className={`${styles.proteinOverviewNavButton} ${view === 'visualisations' ? styles.proteinOverviewNavButtonActive : ''}`}
                aria-current={view === 'visualisations' ? 'page' : undefined}
                onClick={() => setView('visualisations')}
              >
                Visualisations
              </button>
              </div>
              <div>
                <button type="button" className={styles.addToDownloadsContainer} onClick={() => updateBasket(uniprot_id)}>
                  <span className={styles.addToDownloadsIcon}>&#xf000;</span>
                  <span className={styles.addToDownloads}>Add to downloads</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>

      <main className={styles.proteinContent}>
        {view === 'overview' && <ProteinOverview uniprot_id={uniprot_id} />}
        {view === 'coevolutionmatrix' && <CoevolutionMatrix uniprot_id={uniprot_id} />}
        {view === 'analysis' && <CoevolutionAnalysis uniprot_id={uniprot_id} />}
        {view === 'visualisations' && <CoevolutionVisualization uniprot_id={uniprot_id} />}
      </main>
    </>
  )
}

export default ProteinDetail
