import { useCallback, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { PYCOMWEB_BASE_URL, COEVOLUTION_SCORE_SIGNIFICANCE } from "../../constants"
import { VariableSizeGrid as Grid } from 'react-window';
import useFetchProteinMatrices from '../../customHooks/useFetchProteinMatrices';
import styles from '../../styles/ProteinDetail.module.css';

const CoevolutionMatrix = ({ uniprot_id, rowHeight = 35, labelWidth = 100 }) => {
    const { matricesData, matricesLoaded } = useFetchProteinMatrices(uniprot_id);

    const [matrixType, setMatrixType] = useState('matrix');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [boxplotImage, setBoxplotImage] = useState('');
    const [descriptiveStatistics, setDescriptiveStatistics] = useState(null);

    const handleMatrixTypeChange = (e) => setMatrixType(e.target.value);
    const closeModal = () => setIsModalOpen(false);

    const fetchBoxPlotImage = async (residuePair, score) => {
        if (matrixType === 'contact_matrix') return;
        try {
            const response = await axios.get(PYCOMWEB_BASE_URL + COEVOLUTION_SCORE_SIGNIFICANCE, {
                params: {
                    residue_pair: residuePair,
                    score: score,
                    matrix_type: matrixType
                },
            });
            const { plotImage, descriptive_statistics } = response.data;
            setBoxplotImage(`data:image/png;base64,${plotImage}`);
            setDescriptiveStatistics(descriptive_statistics);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching boxplot image:', error);
        }
    };

    const Cell = ({ columnIndex, rowIndex, style }) => {
        if (rowIndex === 0 && columnIndex === 0) return <div style={style} className="grid-cell header-cell" />;
        if (rowIndex === 0) {
            return (
                <div style={style} className="grid-cell header-cell">
                    {matricesData.sequence[columnIndex - 1] + '(' + columnIndex + ')'}
                </div>
            );
        }
        if (columnIndex === 0) {
            return (
                <div style={style} className="grid-cell header-cell">
                    {matricesData.sequence[rowIndex - 1] + '(' + rowIndex + ')'}
                </div>
            );
        }
        const score = matricesData[matrixType][rowIndex - 1][columnIndex - 1];
        const selectedPair = matricesData.sequence[rowIndex - 1] + matricesData.sequence[columnIndex - 1];
        return (
            <div
                style={style}
                onClick={() => fetchBoxPlotImage(selectedPair, score)}
                title={`Residue-pair : ${selectedPair}`}
                className="grid-cell"
                data-residue={selectedPair}
            >
                {score === 0 || score === 1 ? score : score.toFixed(3)}
            </div>
        );
    };
    Cell.propTypes = {
        columnIndex: PropTypes.number.isRequired,
        rowIndex: PropTypes.number.isRequired,
        style: PropTypes.object.isRequired,
    };

    // --- Minimap Setup ---
    const gridRef = useRef();
    const miniMapRef = useRef(null);
    const gridContainerRef = useRef(null);
    const scrollPositionRef = useRef({ scrollLeft: 0, scrollTop: 0 });
    const [gridWidth, setGridWidth] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    
    const MINI_MAP_SIZE = 150;
    const entries = matricesData?.entries ?? 0;
    const gridCount = entries + 1; // The first row and column contain residue labels.
    const viewHeight = 500;
    const cellWidth = 80;
    const cellHeight = rowHeight;
    const contentWidth = labelWidth + entries * cellWidth;
    const contentHeight = gridCount * cellHeight;

    useEffect(() => {
        const container = gridContainerRef.current;
        if (!container) return;
        const updateWidth = () => setGridWidth(container.clientWidth);
        updateWidth();
        const observer = new ResizeObserver(updateWidth);
        observer.observe(container);
        return () => observer.disconnect();
    }, [matricesLoaded]);

    const handleScroll = useCallback(({ scrollLeft, scrollTop }) => {
        scrollPositionRef.current = { scrollLeft, scrollTop };
        const ctx = miniMapRef.current?.getContext('2d');
        if (!ctx || !matricesData) return;
        
        ctx.clearRect(0, 0, MINI_MAP_SIZE, MINI_MAP_SIZE);
        ctx.fillStyle = '#f2f4f7';
        ctx.fillRect(0, 0, MINI_MAP_SIZE, MINI_MAP_SIZE);

        const viewW = Math.min(MINI_MAP_SIZE, (gridWidth / contentWidth) * MINI_MAP_SIZE);
        const viewH = Math.min(MINI_MAP_SIZE, (viewHeight / contentHeight) * MINI_MAP_SIZE);
        const x = (scrollLeft / contentWidth) * MINI_MAP_SIZE;
        const y = (scrollTop / contentHeight) * MINI_MAP_SIZE;
        ctx.fillStyle = 'rgba(8, 94, 214, 0.16)';
        ctx.fillRect(x, y, viewW, viewH);
        ctx.strokeStyle = '#085ed6';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 1, y + 1, Math.max(0, viewW - 2), Math.max(0, viewH - 2));
    }, [contentWidth, contentHeight, gridWidth, matricesData]);

    const navigateMiniMap = (event) => {
        if (!gridRef.current || !miniMapRef.current) return;
        const rect = miniMapRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        gridRef.current.scrollTo({
            scrollLeft: Math.max(0, Math.min(contentWidth - gridWidth, x * contentWidth - gridWidth / 2)),
            scrollTop: Math.max(0, Math.min(contentHeight - viewHeight, y * contentHeight - viewHeight / 2)),
        });
    };

    useEffect(() => {
        if (!gridRef.current || !matricesData || !gridWidth) return;
        handleScroll(scrollPositionRef.current);
    }, [matricesData, gridWidth, handleScroll]);

    if (!matricesLoaded) return <div className={styles.overviewPage}><div className={styles.loadingState} role="status">Loading matrix…</div></div>;

    if (matricesLoaded && matricesData?.matrix) {
        return (
            <div className={styles.overviewPage}>
                <div className={styles.sectionHeader}>
                    <div>
                        <div className={styles.sectionTitleRow}>
                            <h2>Coevolution matrix</h2>
                            <span className={styles.sectionMeta}>{entries} residues</span>
                        </div>
                        <p>Inspect residue pair scores. Select a cell for its score distribution.</p>
                    </div>
                </div>
                <div className={styles.detailLayout}>
                    <div ref={gridContainerRef} className={`${styles.detailMain} ${styles.contentSurface}`}>
                        {gridWidth > 0 && (
                            <Grid
                                ref={gridRef}
                                onScroll={handleScroll}
                                columnCount={gridCount}
                                columnWidth={(index) => index === 0 ? labelWidth : cellWidth}
                                height={viewHeight}
                                rowCount={gridCount}
                                rowHeight={() => cellHeight}
                                width={gridWidth}
                            >
                                {Cell}
                            </Grid>
                        )}
                    </div>

                    <aside className={styles.detailSidebar} aria-label="Matrix controls">
                        <fieldset className={styles.detailOptions}>
                            <legend>Matrix Type</legend>
                            <label><input type="radio" name="matrix_type" value="matrix" checked={matrixType === 'matrix'} onChange={handleMatrixTypeChange} /> Without scaling</label>
                            <label><input type="radio" name="matrix_type" value="matrix_S" checked={matrixType === 'matrix_S'} onChange={handleMatrixTypeChange} /> Min-max scaling</label>
                            <label><input type="radio" name="matrix_type" value="matrix_N" checked={matrixType === 'matrix_N'} onChange={handleMatrixTypeChange} /> Normalized</label>
                            <label><input type="radio" name="matrix_type" value="contact_matrix" checked={matrixType === 'contact_matrix'} onChange={handleMatrixTypeChange} /> Contact map (1.5 contact factor)</label>
                        </fieldset>

                        <div className={styles.matrixNavigator}>
                            <h2>Matrix Navigator</h2>
                            <canvas
                                ref={miniMapRef}
                                width={MINI_MAP_SIZE}
                                height={MINI_MAP_SIZE}
                                role="button"
                                aria-label="Matrix navigator: click or drag to move around the matrix"
                                tabIndex={0}
                                onPointerDown={(event) => {
                                    event.currentTarget.setPointerCapture(event.pointerId);
                                    setIsDragging(true);
                                    navigateMiniMap(event);
                                }}
                                onPointerMove={(event) => { if (isDragging) navigateMiniMap(event); }}
                                onPointerUp={() => setIsDragging(false)}
                                onPointerCancel={() => setIsDragging(false)}
                                onKeyDown={(event) => {
                                    const step = event.shiftKey ? 10 : 1;
                                    const directions = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
                                    const direction = directions[event.key];
                                    if (!direction || !gridRef.current) return;
                                    event.preventDefault();
                                    const { scrollLeft, scrollTop } = scrollPositionRef.current;
                                    gridRef.current.scrollTo({ scrollLeft: scrollLeft + direction[0] * cellWidth, scrollTop: scrollTop + direction[1] * cellHeight });
                                }}
                                style={{ cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
                            />
                        </div>
                    </aside>
                </div>

                {isModalOpen && (
                        <div className="modal">
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
        );
    }

    return null;
};

export default CoevolutionMatrix;

CoevolutionMatrix.propTypes = {
    uniprot_id: PropTypes.string.isRequired,
    rowHeight: PropTypes.number,
    labelWidth: PropTypes.number,
};
