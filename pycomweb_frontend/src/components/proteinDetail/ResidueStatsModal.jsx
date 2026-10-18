import React, { useState } from "react";
import "../../assets/css/ResidueStatsModal.css";

const ResidueStatsModal = ({
  isOpen,
  onClose,
  images,
  descriptiveStatistics,
  selectedPair,
  selectedScore
}) => {
  if (!isOpen) return null;

  const [selectedPlot, setSelectedPlot] = useState("boxplot");

  const plotOptions = {
    boxplot: images.boxplot,
    histogram: images.histogram,
    kde: images.kde
  };

  const plotTitles = {
    boxplot: "Score Distribution with Outlier Detection",
    histogram: "Frequency of Coevolution Scores",
    kde: "Density Estimate of Score Distribution"
  };

  const plotLabels = {
    boxplot: "Boxplot: Score Spread & Outliers",
    histogram: "Histogram: Score Frequency",
    kde: "KDE: Probability Density Curve"
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        <button className="modal-close-button" onClick={onClose}>Close</button>

        <h2 className="modal-title">
          Residue Pair: {selectedPair} — Selected Score: {selectedScore}
        </h2>

        {/* Plot Selector */}
        <div className="plot-selector">
          <label>Select Plot:</label>
          <select
            value={selectedPlot}
            onChange={(e) => setSelectedPlot(e.target.value)}
          >
            <option value="boxplot">Boxplot</option>
            <option value="histogram">Histogram</option>
            <option value="kde">KDE Plot</option>
          </select>
        </div>

        {/* Two-column layout */}
        <div className="two-column-layout">

          {/* Left: Plot */}
          <div className="plot-panel">
            <h3 className="plot-title">{plotTitles[selectedPlot]}</h3>

            <img
              src={plotOptions[selectedPlot]}
              alt={selectedPlot}
              className="plot-image"
            />

            <div className="plot-label">{plotLabels[selectedPlot]}</div>
          </div>

          {/* Right: Statistics */}
          <div className="stats-panel">
            <h3>Descriptive Statistics</h3>

            <table className="stats-table">
              <tbody>
                <tr><td>Mean</td><td>{descriptiveStatistics.mean}</td></tr>
                <tr><td>Median</td><td>{descriptiveStatistics.median}</td></tr>
                <tr><td>Std Dev</td><td>{descriptiveStatistics.std_dev}</td></tr>
                <tr><td>Variance</td><td>{descriptiveStatistics.variance}</td></tr>
                <tr><td>Min</td><td>{descriptiveStatistics.min}</td></tr>
                <tr><td>Max</td><td>{descriptiveStatistics.max}</td></tr>
                <tr><td>Q1</td><td>{descriptiveStatistics.quartiles[0]}</td></tr>
                <tr><td>Q3</td><td>{descriptiveStatistics.quartiles[2]}</td></tr>
                <tr><td>Z‑Score</td><td>{descriptiveStatistics.z_score}</td></tr>
                <tr><td>T‑Statistic</td><td>{descriptiveStatistics.t_test.t_stat}</td></tr>
                <tr><td>P‑Value</td><td>{descriptiveStatistics.t_test.p_value}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Messages */}
        <div className="modal-footer">
          <div className="message-box alpha">
            {descriptiveStatistics.significance}
          </div>

          <div className="message-box percentile">
            {descriptiveStatistics.percentile_msg}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResidueStatsModal;
