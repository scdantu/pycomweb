import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { PYCOMWEB_BASE_URL, TOP_SCORING_RESIDUES } from "../../constants"
import { Col, Form, Table } from 'react-bootstrap';
import useFetchProteinAnalysis from '../../customHooks/useFetchProteinAnalysis';

import styles from '../../styles/ProteinDetail.module.css';

import { RepositoryContext } from '../../context/RepositorContext';

function CoevolutionAnalysis({uniprot_id}) {
    
    //need to control matrix type information
 
    const { proteinRepository } = useContext(RepositoryContext);
    const proteinData = proteinRepository[uniprot_id];
    const { protein_name } = proteinData.summaryData;
    
    const [percentile, setPercentile] = useState(90); // Default percentile
    const [residuesData, setResiduesData] = useState([]);
    // const [matrixData, setMatrixData] = useState(proteinData.matrix); // Default to simple
    const [matrixType, setMatrixType] = useState('matrix')
    const [matrixTypeTitle, setMatrixTypeTitle] = useState('Without Scaling')
    
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
            <div>loading</div>
        )
    }

    const handleMatrixTypeChange = (e) => {
        const val = e.target.value
        setMatrixType(val)
        if (val == 'matrix_S') {
            // setMatrixData(proteinData.matrix_S)
            setMatrixTypeTitle("Scaling")
        } else if (val == "matrix_N") {
            // setMatrixData(proteinData.matrix_N)
            setMatrixTypeTitle("Normalize")
        } else {
            // setMatrixData(proteinData.matrix)
            setMatrixTypeTitle("Without Scaling")
        }
    }

    const handlePercentileChange = (event) => {
        setPercentile(event.target.value);
    };

    return (

        <div className={styles.overviewPage}>
            {/* header */}
            <div className={styles.structures}>
                <form>
                    <div className={styles.formSection}>
                        <p className={styles.strong}>Matrix Type:</p>
                        <input type="radio" name="matrix_type" value="matrix" checked={matrixType === 'matrix'} onChange={handleMatrixTypeChange} /> Without Scaling
                        <input type="radio" name="matrix_type" value="matrix_S" checked={matrixType === 'matrix_S'} onChange={handleMatrixTypeChange} /> Min-Max Scaling
                        <input type="radio" name="matrix_type" value="matrix_N" checked={matrixType === 'matrix_N'} onChange={handleMatrixTypeChange} /> Normalized
                    </div>
                    <div className={styles.formSection}>
                        <p className={styles.strong}>Percentile:</p>
                        <select type="select" value={percentile} onChange={handlePercentileChange}>
                            {percentile_options.map(val => { return (<option key={`perVal_${val}`} value={val}>{val}</option>) })}
                        </select>
                    </div>
                </form>
            </div>

            <div className={styles.analysisHeader}>
                <div>
                    <h2>Top Scoring Residues</h2>
                    <p className={styles.analysisHeaderTableType}>{matrixTypeTitle}, {percentile}th percentile</p>
                </div>
                <div>
                    <p className={styles.analysisHeaderTableResults}><span className={styles.strong}>Results:</span> <span className={styles.value}>{residuesData.length}</span></p>
                </div>
            </div>

            <div className="analysis-table-container" >
                <Table stripped="true">
                    <thead>
                        <tr>
                            <th>Residue Position </th>
                            <th>Residue Position</th>
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

    )
}

export default CoevolutionAnalysis
