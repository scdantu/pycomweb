import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useFetchProteinVisualisation from '../../customHooks/useFetchProteinVisualisation';

import styles from '../../styles/ProteinDetail.module.css';

const CoevolutionVisualization = ({ uniprot_id }) => {

    const [selectedPlot, setSelectedPlot] = useState('heatmap'); // Default plot
    const [imageData, setImageData] = useState(null);
    const [matrixType, setMatrixType] = useState('matrix_S');
    const threshold = 0.5;

    const { visualisationLoaded, visualisationData, visualisationError } = useFetchProteinVisualisation(uniprot_id, selectedPlot, threshold, matrixType);
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
            <div className={styles.overviewPage}><div className={styles.loadingState} role="status">Loading visualisation…</div></div>
        )
    }

    if (visualisationData && visualisationError) {
        return (
            <div className={styles.overviewPage}>{visualisationError}</div>
        )
    }

    return (
        <div className={styles.overviewPage}>
            <div className={styles.sectionHeader}>
                <div>
                    <h2>Visualisations</h2>
                    <p>Explore the coevolution data as a heatmap, network graph or contact map.</p>
                </div>
            </div>
            <div className={styles.detailLayout}>
                <div className={`${styles.detailMain} ${styles.contentSurface} ${styles.visualizationStage}`}>
                    {imageData ? (
                        <img className={styles.visualizationImage} src={imageData} alt={selectedPlot} />
                    ) : (<div>no image</div>)}
                </div>

                <aside className={styles.detailSidebar} aria-label="Visualisation controls">
                    <fieldset className={styles.detailOptions}>
                        <legend>Plot Type</legend>
                        <label><input type="radio" name="plot_type" value="heatmap" checked={selectedPlot === 'heatmap'} onChange={handlePlotTypeChange} /> Heatmap</label>
                        <label><input type="radio" name="plot_type" value="netwrokgraph" checked={selectedPlot === 'netwrokgraph'} onChange={handlePlotTypeChange} /> Network graph</label>
                        <label><input type="radio" name="plot_type" value="contactmap" checked={selectedPlot === 'contactmap'} onChange={handlePlotTypeChange} /> Contact map</label>
                    </fieldset>

                    <label>
                        <span className={styles.strong}>Matrix</span>
                        <select className={styles.detailSelect} value={matrixType} onChange={handleMatrixTypeSelection}>
                            <option value="matrix">Simple</option>
                            <option value="matrix_S">Scaled</option>
                            <option value="matrix_N">Normalised</option>
                        </select>
                    </label>
                </aside>
            </div>
        </div>

    );
};

export default CoevolutionVisualization;

CoevolutionVisualization.propTypes = {
    uniprot_id: PropTypes.string.isRequired,
};
