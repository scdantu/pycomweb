import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PYCOMWEB_BASE_URL, TOP_SCORING_RESIDUES } from "../../constants"
import { Col, Form, Table } from 'react-bootstrap';

function CoevolutionAnalysis({ proteinData }) {
    const [percentile, setPercentile] = useState(90); // Default percentile
    const [residuesData, setResiduesData] = useState([]);
    const [matrixData, setMatrixData] = useState(proteinData.matrix); // Default to simple
    const [matrixType, setMatrixType] = useState('matrix')
    const [matrixTypeTitle, setMatrixTypeTitle] = useState('Without Scaling')

    const percentile_options = [90, 80, 70, 75, 70, 60, 50, 40, 30, 20, 10, 5]

    useEffect(() => {
        // Fetch top residues when component mounts or when selectedMatrixType/percentile changes
        fetchResidueData(matrixData, percentile);
    }, [matrixData, percentile]);

    const fetchResidueData = (matrixData, selectedPercentile) => {
        // Make an API call to fetch top residues
        axios.post(PYCOMWEB_BASE_URL + TOP_SCORING_RESIDUES, {
            matrix: matrixData,
            percentile: selectedPercentile,
            sequence: proteinData.sequence
        })
            .then(response => {
                setResiduesData(response.data); // Set the returned residue data
            })
            .catch(error => {
                console.error("Error fetching residue data:", error);
            });
    };

    const handleMatrixTypeChange = (e) => {
        const val = e.target.value
        setMatrixType(val)
        if (val == 'matrix_S') {
            setMatrixData(proteinData.matrix_S)
            setMatrixTypeTitle("Scaling")
        } else if (val == "matrix_N") {
            setMatrixData(proteinData.matrix_N)
            setMatrixTypeTitle("Normalize")
        } else {
            setMatrixData(proteinData.matrix)
            setMatrixTypeTitle("Without Scaling")
        }
        console.log(e.target.value)
    }

    const handlePercentileChange = (event) => {
        setPercentile(event.target.value);
    };
    return (

        <Col className="coevolution-analysis-wrapper">
            {/* header */}
            <div className="col-md-12 mb-3 content-header-wrapper">
                <Col md={12}><h3>Coevolution Analysis: {proteinData.protein_name} ({proteinData.uniprot_id})</h3> </Col>
            </div>
            <div className='col-md-12 pb-3 flex-row-div content-header-wrapper' style={{ justifyContent: "start" }}>
                <div className='flex-column-div'>
                    <h5 className='mb-0' >Select Coevolution Matrix</h5>
                    <div key="inline-radio" className="mb" style={{ background: "#eeebf7", padding: "5px 10px", display: "flex" }}>
                        <Form.Check
                            inline
                            label="Without Scaling"
                            name="matrix_type"
                            type="radio"
                            id="matrix"
                            value="matrix"
                            onChange={handleMatrixTypeChange}
                            checked={matrixType == 'matrix'}
                        />
                        <Form.Check
                            inline
                            label="Min-Max Scaling"
                            name="matrix_type"
                            type="radio"
                            id="matrix_S"
                            value="matrix_S"
                            onChange={handleMatrixTypeChange}
                            checked={matrixType == 'matrix_S'}
                        />
                        <Form.Check
                            inline
                            label="Normalized"
                            type="radio"
                            name="matrix_type"
                            id="matrix_N"
                            value="matrix_N"
                            onChange={handleMatrixTypeChange}
                            checked={matrixType == 'matrix_N'}
                        />
                    </div>
                </div>
                <div className='flex-column-div'>
                    <h5 className='mb-0' >Select Percentile</h5>
                    <Form.Select aria-label="Choose Matrix" value={percentile} onChange={handlePercentileChange}>

                        {percentile_options.map(val => { return (<option value={val}>{val}</option>) })}
                        {/* <option value={90}>90</option>
                        <option value={80}>80</option>
                        <option value={75}>75</option>
                        <option value={70}>70</option>
                        <option value={70}>70</option> */}
                    </Form.Select>
                </div>
            </div>

            <div className="analysis-table-header">
                <div className="analysis-title-subtitle mb-0">
                    <h4 className="analysis-title mb-0">Top Scoring Residues</h4>
                    <span className="analysis-subtitle mb-0">({matrixTypeTitle}, {percentile}th percentile)</span>
                </div>
                <h5 className="total-results mb-0">Total Results: {residuesData.length}</h5>
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
        </Col >

    )
}

export default CoevolutionAnalysis
