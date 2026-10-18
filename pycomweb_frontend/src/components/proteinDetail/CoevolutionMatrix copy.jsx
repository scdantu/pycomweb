import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { PYCOMWEB_BASE_URL, COEVOLUTION_SCORE_SIGNIFICANCE } from "../../constants"
import { VariableSizeGrid as Grid } from 'react-window';
import { Col, Form } from 'react-bootstrap';
// import useFetchProteinDetail from '../../customHooks/useFetchProteinDetail';
import useFetchProteinMatrices from '../../customHooks/useFetchProteinMatrices';

const CoevolutionMatrix = ({ uniprot_id, rowHeight = 35, labelWidth = 100 }) => {
    
    const { matricesData, matricesLoaded, matricesError } = useFetchProteinMatrices(uniprot_id);
    
    const [selectedData, setSelectedData] = useState(null);  // for selected residue Pair, score
    
    const [matrixType, setMatrixType] = useState('matrix')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [boxplotImage, setBoxplotImage] = useState('');
    const [descriptiveStatistics, setDescriptiveStatistics] = useState(null);
    
    const handleMatrixTypeChange = (e) => {
        const val = e.target.value
        setMatrixType(val)
    }

    const closeModal = () => {
        setIsModalOpen(false);
    };


    const fetchBoxPlotImage = async (residuePair, score) => {
        if (matrixType == 'contact_matrix')
            return;
        try {
            const response = await axios.get(PYCOMWEB_BASE_URL + COEVOLUTION_SCORE_SIGNIFICANCE, {
                params: {
                    residue_pair: residuePair,
                    score: score,
                    matrix_type: matrixType
                },
                // responseType: 'blob' // Expecting an image response
            });
            const { plotImage, descriptive_statistics } = response.data;
            // Create an image element and set its source to the base64 string
            // const img = new Image();
            // img.src = `data:image/png;base64,${plot}`;
            // const src = `data:image/png;base64,${plot}`

            // Set the image and statistics in your state
            setBoxplotImage(`data:image/png;base64,${plotImage}`);
            setSelectedData({ residuePair, score });
            setDescriptiveStatistics(descriptive_statistics);  // Store statistics in state
            setIsModalOpen(true);

            // const imageUrl = URL.createObjectURL(response.data);
            // setBoxplotImage(imageUrl);
            // setSelectedData({ residuePair, score });
            // setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching boxplot image:', error);
        }
    };

    // Render a cell of the grid
    const Cell = ({ columnIndex, rowIndex, style }) => {
        if (rowIndex === 0 && columnIndex === 0) {
            return <div style={style} className="grid-cell header-cell"></div>; // Empty top-left cell
        } else if (rowIndex === 0) {
            // First row, column labels
            return (
                <div style={style} className="grid-cell header-cell">
                    {matricesData.sequence[columnIndex - 1] + '(' + columnIndex + ')'}
                </div>
            );
        } else if (columnIndex === 0) {
            // First column, row labels
            return (
                <div style={style} className="grid-cell header-cell">
                    {matricesData.sequence[rowIndex - 1] + '(' + rowIndex + ')'}
                </div>
            );
        } else {
            // Data cells
            const score = matricesData[matrixType][rowIndex - 1][columnIndex - 1];
            const selectedPair = matricesData.sequence[rowIndex - 1] + matricesData.sequence[columnIndex - 1]
            return (
                <div
                    style={style}
                    onClick={() => fetchBoxPlotImage(selectedPair, score)}
                    title={"Residue-pair : " + selectedPair}
                    className="grid-cell"
                    data-residue={selectedPair}
                >
                    {score == 0 || score == 1 ? score : score.toFixed(3)}

                </div>
            );
        }
    };
    // Function to toggle the display of the matrix
    // const toggleMatrixDisplay = () => {
    //     setShowMatrix(!showMatrix);
    // };
    
    if(!matricesLoaded) {
        return(
            <div>loading</div>
        )
    }
    
    if(matricesLoaded && matricesData?.matrix){
    return (
        // <div>something</div>
        <Col md={12} className="coevolution-matrix-wrapper">
            {/* header */}
            <div className="col-md-12 mb-3 content-header-wrapper">
                <Col md={6}><h3>Coevolution Matrix </h3> </Col>
            </div>
            <div className='col-md-12 pb-3 flex-row-div content-header-wrapper'>
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
                        <Form.Check
                            inline
                            label="Contact Map (1.5 Contact factor)"
                            type="radio"
                            name="matrix_type"
                            id="contact_matrix"
                            value="contact_matrix"
                            onChange={handleMatrixTypeChange}
                            checked={matrixType == 'contact_matrix'}
                        />
                    </div>
                </div>
            </div>
            <div className="matrix-container-wrapper" style={{ width: '100%', maxHeight: '500px' }}>
                {matricesData && (
                    <Grid
                        columnCount={matricesData.entries}
                        columnWidth={() => 100}
                        height={500}
                        rowCount={matricesData.entries}
                        rowHeight={() => rowHeight}
                        width={1200} // Adjust width based on your layout
                    >
                        {Cell}
                    </Grid>
                )}

                {isModalOpen && (
                    <div className="modal">
                        {/* <h2>Significance of Coevolution Score for residue pair {residuePair}</h2> */}
                        <div className='flex-row-div' style={{ justifyContent: "space-around" }}>
                            <img src={boxplotImage} alt="Boxplot" />
                            <div>
                                <h3>Descriptive Statistics</h3>
                                <ul>
                                    <li>Mean: {descriptiveStatistics.mean}</li>
                                    <li>Median: {descriptiveStatistics.median}</li>
                                    <li>Standard Deviation: {descriptiveStatistics.std_dev}</li>
                                    <li>Variance: {descriptiveStatistics.variance}</li>
                                    <li>Min: {descriptiveStatistics.min}</li>
                                    <li>Max: {descriptiveStatistics.max}</li>
                                    <li>Quartiles: {descriptiveStatistics.quartiles.join(', ')}</li>
                                    <li>Z-Score: {descriptiveStatistics.z_score}</li>
                                    <li>T-Test: t-stat = {descriptiveStatistics.t_test.t_stat}, p-value = {descriptiveStatistics.t_test.p_value}</li>
                                    <li>{descriptiveStatistics.significance}</li>
                                </ul>
                            </div>
                            <button className="modal-close-button" onClick={closeModal}>Close</button>
                        </div>


                    </div>
                )}
            </div>
        </Col>

    );
}

};

export default CoevolutionMatrix;