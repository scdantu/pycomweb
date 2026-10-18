import { useContext, useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import PropTypes from 'prop-types';
import { DownloadContext } from '../../context/DownloadContext';
import { FaCartPlus } from 'react-icons/fa';
import { RepositoryContext } from '../../context/RepositorContext';
import { ProteinTabContext } from '../../context/ProteinTabContext'; // Import the AddProtein function
import useFetchProteinFullData from '../../customHooks/useFetchProteinFullData.jsx';

import ProteinOverviewSequence from './overview/ProteinOverviewSequence.jsx'; // Import the sequence component
import ProteinOverviewDiseases from './overview/ProteinOverviewDiseases.jsx'; // Import the diseases component
import ProteinOverviewLigands from './overview/ProteinOverviewLigands.jsx';
import ProteinOverviewECNumbers from './overview/ProteinOverviewECNumbers.jsx';
import ProteinOverviewPDB from './overview/ProteinOverviewPDB.jsx'; // Import the PDB component
import ProteinOverviewPTM from './overview/ProteinOverviewPTM.jsx';

import styles from '../../styles/ProteinDetail.module.css'; // Adjust the path as necessary

const ProteinOverview = ({ uniprot_id }) => {

    // const { updateBasket } = useContext(DownloadContext);
    const { proteinRepository } = useContext(RepositoryContext);
    const { loadingFull, error } = useFetchProteinFullData(true, [uniprot_id])
    //ensure browsed to protein is in the tabs
    
    const data = proteinRepository[uniprot_id];
    
    const decimalPlaces = 3; //number of decimal places for display


    const [view, setView] = useState('sequence');

    const roundFigure = (item) => {
        if(item !== 0) {
            return item.toFixed(decimalPlaces);
        }
        return 0;
    }

    const renderTrueFalse = (item) => {
        if(item) {
            return (<span className={styles.green}>&#xe86c;</span>); //material check
        } else {
            return (<span className={styles.red}>&#xe5c9;</span>); //material cross
        }
    }

    const renderLink = (item) => {
        if(item.length > 0) {
            let hrefLink = `https://www.uniprot.org/taxonomy/${item}`
            return (<a className="organism-link" href={hrefLink} target="_blank" rel="noreferrer">{item}</a>);
            
         } else {
             return "\u2716"; //unicode cross
         }
    }

    if(loadingFull) {
        return <div>Loading...</div>;
    }
    if(error) {
        return <div>Error: {error}</div>;
    }
    if (!data) {
       return <div>Initialising protein data…</div>;
    }
    if(!data.summaryData) {
        return <div>No data found for this UniProt ID.</div>;
    }
    if (!data?.fullData) {
        return <div>Loading full data…</div>;
    }
    // if (!ready) return <div>Waiting for protein data...</div>;

    if (!data || !data.fetchedFullData) {
    return <p>Loading protein data...</p>;
  }


    const {
        protein_name = "" ,
        diseases = [],
        ligands = [],
        ec_numbers = [],
        pdb = [],
        ptm = [],
    } = data?.summaryData || {};
    // = data?.summaryData || {};

    const {
        organism_id = "",
        sequence_length = 0,
        sequence = "",
        neff = 0,
        helix_frac = 0,
        turn_frac = 0,
        strand_frac = 0,
        has_ptm = false,
        has_pdb = false,
        has_substrate = false
    } = data?.fullData || {};

    return (
        <div className={styles.overviewPage}>
        <div className={styles.structures}>
            <p className={styles.truefalseline}><span className={styles.strong}>PTM:</span> <span className={styles.value}>{renderTrueFalse(has_ptm)}</span></p>
            <p className={styles.truefalseline}><span className={styles.strong}>PDB:</span> <span className={styles.value}>{renderTrueFalse(has_pdb)}</span></p>
            <p className={styles.truefalseline}><span className={styles.strong}>Substrate:</span> <span className={styles.value}>{renderTrueFalse(has_substrate)}</span></p>
        </div>
        
        <div className={styles.structures}>
            <p><span className={styles.strong}>N<sup>eff</sup>:</span> <span className={styles.value}>{roundFigure(neff)}</span></p>
            <p><span className={styles.strong}>Helix Fraction:</span> <span className={styles.value}>{roundFigure(helix_frac)}</span></p>
            <p><span className={styles.strong}>Turn Fraction:</span> <span className={styles.value}>{roundFigure(turn_frac)}</span></p>
            <p><span className={styles.strong}>Standard Fraction:</span> <span className={styles.value}>{roundFigure(strand_frac)}</span></p>
        </div>
        

        <div className={styles.dataGrid}>
            <ul>
                <li
  className={`${styles.proteinOverviewNavLi} ${view === 'sequence' ? styles.proteinOverviewNavLiActive : ''}`}
  onClick={() => setView('sequence')}
>
  Sequence: <span className={styles.value}>122</span>
</li>

<li
  className={`${styles.proteinOverviewNavLi} ${view === 'diseases' ? styles.proteinOverviewNavLiActive : ''}`}
  onClick={() => setView('diseases')}
>
  Diseases: <span className={styles.value}>{diseases.length}</span>
</li>

<li
  className={`${styles.proteinOverviewNavLi} ${view === 'ligands' ? styles.proteinOverviewNavLiActive : ''}`}
  onClick={() => setView('ligands')}
>
  Ligands: <span className={styles.value}>{ligands.length}</span>
</li>

<li
  className={`${styles.proteinOverviewNavLi} ${view === 'ec_numbers' ? styles.proteinOverviewNavLiActive : ''}`}
  onClick={() => setView('ec_numbers')}
>
  EC Numbers: <span className={styles.value}>{ec_numbers.length}</span>
</li>

<li
  className={`${styles.proteinOverviewNavLi} ${view === 'pdb' ? styles.proteinOverviewNavLiActive : ''}`}
  onClick={() => setView('pdb')}
>
  PDB: <span className={styles.value}>{pdb.length}</span>
</li>

<li
  className={`${styles.proteinOverviewNavLi} ${view === 'ptm' ? styles.proteinOverviewNavLiActive : ''}`}
  onClick={() => setView('ptm')}
>
  PTM: <span className={styles.value}>{ptm.length}</span>
</li>
            </ul>
            <div className={styles.dataGridData}>
                <div className={styles.dataGridItemData}>
                    {view === 'sequence' && (<ProteinOverviewSequence sequence={sequence} />)}
                    {view === 'diseases' && (<ProteinOverviewDiseases diseases={diseases} />)}
                    {view === 'ligands' && (<ProteinOverviewLigands ligands={ligands} />)}
                    {view === 'ec_numbers' && (<ProteinOverviewECNumbers ec_numbers={ec_numbers} />)}
                    {view === 'pdb' && (<ProteinOverviewPDB pdb={pdb} />)}
                    {view === 'ptm' && (<ProteinOverviewPTM ptm={ptm} />)}
                </div>
            </div>
        </div>
        </div>
    );
};

ProteinOverview.propTypes = {
    data: PropTypes.object,
    uniprot_id: PropTypes.string
}

export default ProteinOverview;