import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PYCOMWEB_BASE_URL, GENERATE_PLOTS } from "../../constants"
import { Button, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

const CoevolutionVisualization = ({ proteinData }) => {
    const [selectedPlot, setSelectedPlot] = useState('heatmap'); // Default plot
    const [imageUrl, setImageUrl] = useState('');
    const [matrixType, setMatrixType] = useState('matrix_S');
    const [selectedMatrix, setSelectedMatrix] = useState(proteinData.matrix)
    const [threshold, setThreshold] = useState(0.5);

    //  New Code Starts Here 
    const handlePlotTypeChange = (e) => {
        setSelectedPlot(e.target.value);
    };

    const handleMatrixTypeSelection = (e) => {
        const val = e.target.value
        setMatrixType(e.target.value)
        if (val == 'matrix_S') {
            setSelectedMatrix(proteinData.matrix_S)
        } else if (val == "matrix_N") {
            setSelectedMatrix(proteinData.matrix_N)
        } else {
            setSelectedMatrix(proteinData.matrix)
        }
        console.log(e.target.value)
    }

    useEffect(() => {
        generatePlot()
    }, [selectedPlot, selectedMatrix]);

    const generatePlot = async () => {

        try {
            const response = await axios.post(PYCOMWEB_BASE_URL + GENERATE_PLOTS, {
                matrix: selectedPlot != "contactmap" ? selectedMatrix : proteinData.contact_matrix,
                plotType: selectedPlot,
                threshold: threshold
            }, { responseType: 'blob' });

            const url = URL.createObjectURL(new Blob([response.data], { type: 'image/png' }));
            setImageUrl(url);
        } catch (error) {
            console.error('Error generating plot:', error);
        }
    };

    return (
        <Col md={12} className="visualization-wrapper">
            {/* header */}
            <div className="col-md-12 mb-3 content-header-wrapper">
                <Col md={6}><h3>Visualization: {proteinData.protein_name} ({proteinData.uniprot_id}) </h3> </Col>
            </div>
            <div className='col-md-12 pb-3 flex-row-div content-header-wrapper' style={{ justifyContent: "flex-start" }}>
                <div className='flex-column-div'>
                    <h5 className='mb-0' >Select Plot</h5>
                    <div key="inline-radio" className="mb" style={{ background: "#eeebf7", padding: "5px 10px", display: "flex" }}>
                        <Form.Check
                            inline
                            label="HeatMap"
                            name="plot_type"
                            type="radio"
                            id="heatmap"
                            value="heatmap"
                            onChange={handlePlotTypeChange}
                            checked={selectedPlot === "heatmap"}
                        />
                        <Form.Check
                            inline
                            label="Network Graph"
                            name="plot_type"
                            type="radio"
                            id="netwrokgraph"
                            value="netwrokgraph"
                            onChange={handlePlotTypeChange}
                            checked={selectedPlot === "netwrokgraph"}
                        />
                        <Form.Check
                            inline
                            label="Contact Map"
                            type="radio"
                            name="plot_type"
                            id="contactmap"
                            value="contactmap"
                            onChange={handlePlotTypeChange}
                            checked={selectedPlot === "contactmap"}
                        />
                    </div>
                </div>
                <div className='flex-column-div'>
                    <h5 className='mb-0' >Select Matrix</h5>
                    <Form.Select aria-label="DChoose Matrix" onChange={handleMatrixTypeSelection}>
                        <option value="matrix" >Simple</option>
                        <option value="matrix_S" >Scaled</option>
                        <option value="matrix_N" >Normalize</option>
                    </Form.Select>
                </div>
                {/* <div className='flex-column-div'>
                    <h5 className='mb-0' >Threshold</h5>
                    <Form.Control
                        type="text"
                        id="threshold"
                        name="threshold"
                        disabled
                    />
                </div> */}
                {/* <div className='flex-column-div active-btn-wrapper' >
                    <button className="active-btn" id="generate_plot" name="generate_plot" onClick={generatePlot} >Generate Plot</button>
                </div> */}
            </div>
            {/* visualization Options */}
            <Col md={12} className='flex-column-div'>
                {imageUrl ? (
                    <img src={imageUrl} alt={selectedPlot} />
                ) : (
                    <p>Loading {selectedPlot} plot...</p>
                )}
            </Col>


        </Col >

    );
    // New Code ends 

};

export default CoevolutionVisualization;
