import React, { useCallback, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { PYCOMWEB_BASE_URL, COEVOLUTION_SCORE_SIGNIFICANCE } from "../../constants"
import { VariableSizeGrid as Grid } from 'react-window';
import useFetchProteinMatrices from '../../customHooks/useFetchProteinMatrices';
import ResidueStatsModal from './ResidueStatsModal';
import styles from '../../styles/ProteinDetail.module.css';
const CoevolutionMatrix = ({ uniprot_id, rowHeight = 35, labelWidth = 100 }) => {
    const { matricesData, matricesLoaded, matricesError } = useFetchProteinMatrices(uniprot_id);

    const [selectedData, setSelectedData] = useState(null);
    const [matrixType, setMatrixType] = useState('matrix');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [plotImages, setPlotImages] = useState({ boxplot: null, histogram: null, kde: null });
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
            const { boxplot, histogram, kde, descriptive_statistics } = response.data;

            // Set the image and statistics in your state
            setPlotImages({
                boxplot: `data:image/png;base64,${boxplot}`,
                histogram: `data:image/png;base64,${histogram}`,
                kde: `data:image/png;base64,${kde}`,
            });
            setSelectedData({ residuePair, score });
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

    // --- Minimap Setup ---
    const gridRef = useRef();
    const miniMapRef = useRef();
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    
    const MINI_MAP_SIZE = 150;
    const entries = matricesData?.entries;
    const viewWidth = 1200;
    const viewHeight = 500;
    const cellWidth = 80;
    const cellHeight = rowHeight;

    const handleScroll = useCallback(({ scrollLeft, scrollTop }) => {
        
        const ctx = miniMapRef.current?.getContext('2d');
        if (!ctx || !matricesData) return;
        
        // const miniCellSize = MINI_MAP_SIZE / entries;
        ctx.clearRect(0, 0, MINI_MAP_SIZE, MINI_MAP_SIZE);
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(0, 0, MINI_MAP_SIZE, MINI_MAP_SIZE);

        ctx.strokeStyle = 'rgba(255,0,0,0.7)';
        ctx.lineWidth = 2;
        const viewW = (viewWidth / (entries * cellWidth)) * MINI_MAP_SIZE;
        const viewH = (viewHeight / (entries * cellHeight)) * MINI_MAP_SIZE;
        const x = (scrollLeft / (entries * cellWidth)) * MINI_MAP_SIZE;
        const y = (scrollTop / (entries * cellHeight)) * MINI_MAP_SIZE;
        ctx.strokeRect(x, y, viewW, viewH);
    }, [entries, matricesData]);

    const handleMiniMapClick = (e) => {
        const rect = miniMapRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const col = Math.floor((clickX / MINI_MAP_SIZE) * entries);
        const row = Math.floor((clickY / MINI_MAP_SIZE) * entries);

        gridRef.current.scrollToItem({ rowIndex: row, columnIndex: col });
    };

    const handleMouseDown = (e) => {
        isDragging.current = true;
        dragStart.current = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    };

    const handleMouseMove = (e) => {
    // 🟢 Check if dragging is active and refs are set
    if (!isDragging.current || !miniMapRef.current || !gridRef.current) return;
    const deltaX = e.nativeEvent.offsetX - dragStart.current.x;
    const deltaY = e.nativeEvent.offsetY - dragStart.current.y;

    const scaleX = gridRef.current.scrollWidth / MINI_MAP_SIZE;
    const scaleY = gridRef.current.scrollHeight / MINI_MAP_SIZE;

    gridRef.current.scrollLeft += deltaX * scaleX;
    gridRef.current.scrollTop += deltaY * scaleY;

    dragStart.current = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };

    handleScroll({
        scrollLeft: gridRef.current.scrollLeft,
        scrollTop: gridRef.current.scrollTop
    });
};

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    // Patch: Initialise minimap viewport on load and scroll
    useEffect(() => {
        if (!gridRef.current || !matricesData) return;
        handleScroll({
            scrollLeft: gridRef.current.scrollLeft,
            scrollTop: gridRef.current.scrollTop
        });
    }, [matricesData, handleScroll]);

    if (!matricesLoaded) return <div>loading</div>;

    if (matricesLoaded && matricesData?.matrix) {
        return (
            <div className={styles.overviewPage}>
                <div className={styles.structures}>
                    <form>
                        <div className={styles.formSection}>
                        <p className={styles.strong}>Matrix Type:</p>
                        <input type="radio" name="matrix_type" value="matrix" checked={matrixType === 'matrix'} onChange={handleMatrixTypeChange} /> Without Scaling
                        <input type="radio" name="matrix_type" value="matrix_S" checked={matrixType === 'matrix_S'} onChange={handleMatrixTypeChange} /> Min-Max Scaling
                        <input type="radio" name="matrix_type" value="matrix_N" checked={matrixType === 'matrix_N'} onChange={handleMatrixTypeChange} /> Normalized
                        <input type="radio" name="matrix_type" value="contact_matrix" checked={matrixType === 'contact_matrix'} onChange={handleMatrixTypeChange} /> Contact Map (1.5 Contact factor)
                    </div>
                    </form>
                </div>

                <div style={{ width: '100%', maxHeight: '500px' }}>
                    {matricesData && (
                        <Grid
                            ref={gridRef}
                            onScroll={handleScroll}
                            columnCount={entries}
                            columnWidth={() => cellWidth}
                            height={viewHeight}
                            rowCount={entries}
                            rowHeight={() => cellHeight}
                            width={viewWidth}
                        >
                            {Cell}
                        </Grid>
                    )}

                    <ResidueStatsModal
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        images={plotImages}
                        descriptiveStatistics={descriptiveStatistics}
                        selectedPair={selectedData?.residuePair}
                        selectedScore={selectedData?.score}
                    />
                </div>

                <div style={{ position: 'absolute', right: 10, bottom: 10, border: '1px solid black' }}>
                    <canvas
                        ref={miniMapRef}
                        width={MINI_MAP_SIZE}
                        height={MINI_MAP_SIZE}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onClick={handleMiniMapClick}
                        style={{ cursor: 'grab' }}
                    />
                </div>
            </div>
        );
    }

    return null;
};

export default CoevolutionMatrix;
