import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { PYCOMWEB_BASE_URL, GENERATE_PLOTS } from "../../constants"
import { Button, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import useFetchProteinVisualisation from '../../customHooks/useFetchProteinVisualisation';
import { RepositoryContext } from '../../context/RepositorContext';

import styles from '../../styles/ProteinDetail.module.css';

const CoevolutionVisualization = ({ uniprot_id }) => {

    // const { proteinRepository } = useContext(RepositoryContext);
    // const data = proteinRepository[uniprot_id];
    // const { protein_name } = data.summaryData;

    const [selectedPlot, setSelectedPlot] = useState('heatmap'); // Default plot
    // const [imageUrl, setImageUrl] = useState('');
    const [imageData, setImageData] = useState(null);
    const [matrixType, setMatrixType] = useState('matrix_S');
    // const [selectedMatrix, setSelectedMatrix] = useState(proteinData.matrix)
    const [threshold, setThreshold] = useState(0.5);

    const { visualisationLoaded, visualisationData, visualisationError } = useFetchProteinVisualisation(uniprot_id, selectedPlot, threshold, matrixType);
    //  New Code Starts Here 
    const handlePlotTypeChange = (e) => {
        setSelectedPlot(e.target.value);
    };

    const handleMatrixTypeSelection = (e) => {
        setMatrixType(e.target.value)
    }

    useEffect(() => {
        if (visualisationLoaded && visualisationData) {
            const image = visualisationData;
            const imageData = image.proteinVisualisationData;
            const imageElement = `data:image/png;base64,${imageData}`
            setImageData(imageElement)
        }
    }, [visualisationLoaded, visualisationData])

    if (!visualisationLoaded) {
        return (
            <div>loading</div>
        )
    }

    if (visualisationData && visualisationError) {
        return (
            <div>{visualisationError}</div>
        )
    }

    return (
        <div className={styles.overviewPage}>
            <div className={styles.structures}>
                <form>
                    <div className={styles.formSection}>
                        <p className={styles.strong}>Plot Type:</p>
                        <input type="radio" name="plot_type" value="heatmap" checked={selectedPlot === 'heatmap'} onChange={handlePlotTypeChange} /> HeatMap
                        <input type="radio" name="plot_type" value="netwrokgraph" checked={selectedPlot === 'netwrokgraph'} onChange={handlePlotTypeChange} /> Network Graph
                        <input type="radio" name="plot_type" value="contactmap" checked={selectedPlot === 'contactmap'} onChange={handlePlotTypeChange} /> Contact Map
                    </div>
                    <div className={styles.formSection}>
                        <p className={styles.strong}>Matrix:</p>
                        <select type="select" value={matrixType} onChange={handleMatrixTypeSelection}>
                            <option value="matrix">Simple</option>
                            <option value="matrix_S">Scaled</option>
                            <option value="matrix_N">Normalised</option>
                        </select>
                    </div>
                </form>
            </div>

            {/* visualization Options */}
            <div>
                {imageData ? (
                    <img src={imageData} alt={selectedPlot} />
                ) : (<div>no image</div>)}
            </div>
        </div>

    );
};

export default CoevolutionVisualization;
