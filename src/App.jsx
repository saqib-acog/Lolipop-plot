import React, { useState, useMemo } from "react";
import Chart from "./Chart";
import all_data from "./data";

// List of available datasets
const datasetNames = Object.keys(all_data);

// Function to process FDR values
function processFDR(data) {
  return data.map((item) => ({
    ...item,
    fdr: -Math.log10(item.fdr),
  }));
}

// Function to generate gene count legend values
function generateGeneCountsLegendVals(data, numberOfCircles = 3) {
  const geneCounts = data.map((item) => item.geneCount);
  const minGeneCount = Math.min(...geneCounts);
  const maxGeneCount = Math.max(...geneCounts);

  const step = (maxGeneCount - minGeneCount) / (numberOfCircles - 1);
  return Array.from({ length: numberOfCircles }, (_, i) =>
    Math.round(minGeneCount + i * step)
  );
}

const App = () => {
  // State for selected dataset and x-axis label
  const [selectedDataset, setSelectedDataset] = useState(datasetNames[0]);
  const [xAxisLabel, setXAxisLabel] = useState("Signal");

  // Process the selected data
  const processedData = useMemo(
    () => processFDR(all_data[selectedDataset]),
    [selectedDataset]
  );

  // Generate gene count legend values based on the processed data
  const geneCountsLegendVals = useMemo(
    () => generateGeneCountsLegendVals(processedData),
    [processedData]
  );

  // Sort data based on the selected x-axis label
  const sortedData = useMemo(() => {
    return xAxisLabel === "Signal"
      ? processedData.sort((a, b) => b.signal - a.signal)
      : processedData.sort((a, b) => b.fdr - a.fdr);
  }, [xAxisLabel, processedData]);

  // Initial margin and dimensions
  const margin = { top: 20, right: 300, bottom: 50, left: 800 };
  const width = 2000 - margin.left - margin.right;
  const height = (800 * processedData.length) / 10 - margin.top - margin.bottom;

  return (
    <div style={{ margin: "60px" }}>
      {/* Dropdown for selecting dataset */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <label htmlFor="datasetSelect" style={{ fontSize: "20px" }}>
          Select Data:
        </label>
        <select
          id="datasetSelect"
          value={selectedDataset}
          onChange={(e) => setSelectedDataset(e.target.value)}
          style={{
            padding: "5px",
            fontSize: "20px",
            width: "20vw",
            marginRight: "20px",
          }}
        >
          {datasetNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        {/* Dropdown for selecting x-axis label */}
        <label htmlFor="xAxisSelect" style={{ fontSize: "20px" }}>
          Select X-Axis:{" "}
        </label>
        <select
          id="xAxisSelect"
          value={xAxisLabel}
          onChange={(e) => setXAxisLabel(e.target.value)}
          style={{ padding: "5px", fontSize: "20px", width: "10vw" }}
        >
          <option value="Signal">Signal</option>
          <option value="FDR">FDR</option>
        </select>
      </div>

      {/* Chart heading */}
      <h1 style={{ textAlign: "center", fontWeight: "400" }}>
        GO:BP Enrichment of {selectedDataset} genes
      </h1>

      {/* Chart component */}
      <Chart
        geneCounts={geneCountsLegendVals.sort((a, b) => a - b)}
        fdrValues={Array.from(new Set(processedData.map((item) => item.fdr)))}
        data={sortedData}
        width={width}
        height={height}
        margin={margin}
        xAxisLabel={xAxisLabel}
      />
    </div>
  );
};

export default App;
