import { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { RepositoryContext } from '../../context/RepositorContext';
import useFetchProteinFullData from '../../customHooks/useFetchProteinFullData.jsx';

import ProteinOverviewSequence from './overview/ProteinOverviewSequence.jsx';
import ProteinOverviewDiseases from './overview/ProteinOverviewDiseases.jsx';
import ProteinOverviewLigands from './overview/ProteinOverviewLigands.jsx';
import ProteinOverviewECNumbers from './overview/ProteinOverviewECNumbers.jsx';
import ProteinOverviewPDB from './overview/ProteinOverviewPDB.jsx';
import ProteinOverviewPTM from './overview/ProteinOverviewPTM.jsx';

import styles from '../../styles/ProteinDetail.module.css';

const ProteinOverview = ({ uniprot_id }) => {
    const { proteinRepository } = useContext(RepositoryContext);
    const { loadingFull, error } = useFetchProteinFullData(true, [uniprot_id]);
    const [view, setView] = useState('sequence');
    const data = proteinRepository[uniprot_id];

    if (error) return <div className={styles.overviewPage}>Error: {error}</div>;
    if (loadingFull || !data?.fullData) return <div className={styles.overviewPage}><div className={styles.loadingState} role="status">Loading protein data…</div></div>;
    if (!data.summaryData) return <div className={styles.overviewPage}>No data found for this UniProt ID.</div>;

    const {
        diseases = [], ligands = [], ec_numbers = [], pdb = [], ptm = [],
    } = data.summaryData;
    const {
        sequence_length = 0, sequence = '', neff = 0,
        helix_frac = 0, turn_frac = 0, strand_frac = 0,
        has_ptm = false, has_pdb = false, has_substrate = false,
    } = data.fullData;

    const sections = [
        { id: 'sequence', label: 'Sequence', count: sequence_length || sequence.length },
        { id: 'diseases', label: 'Diseases', count: diseases.length },
        { id: 'ligands', label: 'Ligands', count: ligands.length },
        { id: 'ec_numbers', label: 'EC numbers', count: ec_numbers.length },
        { id: 'pdb', label: 'PDB', count: pdb.length },
        { id: 'ptm', label: 'PTM', count: ptm.length },
    ];
    const selectedSection = sections.find(section => section.id === view);
    const formatNumber = value => Number(value || 0).toFixed(3);

    return (
        <div className={styles.overviewPage}>
            <div className={styles.sectionHeader}>
                <div>
                    <h2>Protein overview</h2>
                    <p>Sequence, structural properties and available annotations.</p>
                </div>
            </div>

            <div className={styles.overviewSummary} aria-label="Protein properties">
                {[
                    ['PTM', has_ptm ? 'Available' : 'None'],
                    ['PDB', has_pdb ? 'Available' : 'None'],
                    ['Substrate', has_substrate ? 'Available' : 'None'],
                    [<>N<sup>eff</sup></>, formatNumber(neff)],
                    ['Helix fraction', formatNumber(helix_frac)],
                    ['Turn fraction', formatNumber(turn_frac)],
                    ['Strand fraction', formatNumber(strand_frac)],
                ].map(([label, value], index) => (
                    <div className={styles.summaryItem} key={index}>
                        <span className={styles.summaryLabel}>{label}</span>
                        <span className={styles.summaryValue}>{value}</span>
                    </div>
                ))}
            </div>

            <div className={styles.detailLayout}>
                <div className={`${styles.detailMain} ${styles.contentSurface}`}>
                    <div className={styles.surfaceHeader}>
                        <h3>{selectedSection.label}</h3>
                        {view === 'sequence' && (
                            <button className={styles.overviewHeaderAction} onClick={() => navigator.clipboard.writeText(sequence)}>Copy sequence</button>
                        )}
                    </div>
                    <div className={styles.surfaceBody}>
                        {view === 'sequence' && <ProteinOverviewSequence sequence={sequence} />}
                        {view === 'diseases' && <ProteinOverviewDiseases diseases={diseases} />}
                        {view === 'ligands' && <ProteinOverviewLigands ligands={ligands} />}
                        {view === 'ec_numbers' && <ProteinOverviewECNumbers ec_numbers={ec_numbers} />}
                        {view === 'pdb' && <ProteinOverviewPDB pdb={pdb} />}
                        {view === 'ptm' && <ProteinOverviewPTM ptm={ptm} />}
                    </div>
                </div>

                <aside className={styles.detailSidebar} aria-label="Overview sections">
                    <h3 className={styles.sidebarHeading}>Explore protein</h3>
                    <nav className={styles.overviewNav} aria-label="Protein information">
                        {sections.map(section => (
                            <button
                                key={section.id}
                                className={`${styles.overviewNavButton} ${view === section.id ? styles.overviewNavButtonActive : ''}`}
                                aria-current={view === section.id ? 'page' : undefined}
                                onClick={() => setView(section.id)}
                            >
                                <span>{section.label}</span>
                                <span className={styles.overviewNavCount}>{section.count}</span>
                            </button>
                        ))}
                    </nav>
                </aside>
            </div>
        </div>
    );
};

ProteinOverview.propTypes = {
    uniprot_id: PropTypes.string.isRequired,
};

export default ProteinOverview;
