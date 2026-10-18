import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';
import useFetchProteinAnalysis from '../../customHooks/useFetchProteinAnalysis';

import styles from '../../styles/ProteinDetail.module.css';

function CoevolutionAnalysis({uniprot_id}) {
    const [percentile, setPercentile] = useState(90); // Default percentile
    const [residuesData, setResiduesData] = useState([]);
    const [matrixType, setMatrixType] = useState('matrix')
    const [matrixTypeTitle, setMatrixTypeTitle] = useState('Without scaling')
    
    const {analysisLoaded, analysisData} = useFetchProteinAnalysis(uniprot_id, percentile, matrixType);
    
    const percentile_options = [90, 80, 75, 70, 60, 50, 40, 30, 20, 10, 5];


    useEffect(() => {
        if(analysisLoaded){
            if(analysisData){
                setResiduesData(analysisData.proteinAnalysisData);
            }
        }
    }, [analysisLoaded, analysisData]);

    if(!analysisData){
        return(
            <div className={styles.overviewPage}><div className={styles.loadingState} role="status">Loading analysis…</div></div>
        )
    }

    const handleMatrixTypeChange = (e) => {
        const val = e.target.value
        setMatrixType(val)
        if (val == 'matrix_S') {
            setMatrixTypeTitle("Min-max scaling")
        } else if (val == "matrix_N") {
            setMatrixTypeTitle("Normalized")
        } else {
            setMatrixTypeTitle("Without scaling")
        }
    }

    const handlePercentileChange = (event) => {
        setPercentile(event.target.value);
    };

    return (

        <div className={styles.overviewPage}>
            <div className={styles.sectionHeader}>
                <div>
                    <div className={styles.sectionTitleRow}>
                        <h2>Top scoring residues</h2>
                        <span className={styles.sectionMeta}>{residuesData.length} results</span>
                    </div>
                    <p>{matrixTypeTitle}, {percentile}th percentile</p>
                </div>
            </div>
            <div className={styles.detailLayout}>
                <div className={`${styles.detailMain} ${styles.contentSurface}`}>
                    <div className="analysis-table-container">
                        <Table striped>
                            <thead>
                                <tr>
                                    <th>Residue A position</th>
                                    <th>Residue B position</th>
                                    <th>Residue Pair</th>
                                    <th>Coevolution Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {residuesData.map((residue, index) => (
                                    <tr key={index}>
                                        <td>{residue.ResA}</td>
                                        <td>{residue.ResB}</td>
                                        <td>{residue.pair}</td>
                                        <td>{residue.coevolution_score.toFixed(5)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>

                <aside className={styles.detailSidebar} aria-label="Analysis controls">
                    <fieldset className={styles.detailOptions}>
                        <legend>Matrix Type</legend>
                        <label><input type="radio" name="analysis_matrix_type" value="matrix" checked={matrixType === 'matrix'} onChange={handleMatrixTypeChange} /> Without scaling</label>
                        <label><input type="radio" name="analysis_matrix_type" value="matrix_S" checked={matrixType === 'matrix_S'} onChange={handleMatrixTypeChange} /> Min-max scaling</label>
                        <label><input type="radio" name="analysis_matrix_type" value="matrix_N" checked={matrixType === 'matrix_N'} onChange={handleMatrixTypeChange} /> Normalized</label>
                    </fieldset>

                    <label>
                        <span className={styles.strong}>Percentile</span>
                        <select className={styles.detailSelect} value={percentile} onChange={handlePercentileChange}>
                            {percentile_options.map(val => <option key={`perVal_${val}`} value={val}>{val}</option>)}
                        </select>
                    </label>
                </aside>
            </div>
        </div>

    )
}

export default CoevolutionAnalysis

CoevolutionAnalysis.propTypes = {
    uniprot_id: PropTypes.string.isRequired,
};
