import React, { useState } from "react";
import Chart from "./Chart";

// Original data
const all_data = {
  "Monocyte GGL suppressed": [
    {
      process: "Regulation of tumor necrosis factor production",
      signal: 0.91,
      geneCount: 11,
      fdr: 8.83e-5,
    },
    {
      process: "Positive regulation of tumor necrosis factor production",
      signal: 0.96,
      geneCount: 9,
      fdr: 9.53e-5,
    },
    {
      process: "Positive regulation of T cell activation",
      signal: 0.85,
      geneCount: 12,
      fdr: 0.00012,
    },
    {
      process: "Regulation of interleukin-6 production",
      signal: 0.85,
      geneCount: 10,
      fdr: 0.00021,
    },
    {
      process:
        "Regulation of adaptive immune response based on somatic recombination of immune receptors built from immunoglobulin superfamily domains",
      signal: 0.77,
      geneCount: 10,
      fdr: 0.00042,
    },
    {
      process: "Positive regulation of interleukin-6 production",
      signal: 0.8,
      geneCount: 8,
      fdr: 0.00049,
    },
    {
      process: "Regulation of chemokine production",
      signal: 0.79,
      geneCount: 8,
      fdr: 0.00053,
    },
    {
      process: "Negative regulation of leukocyte differentiation",
      signal: 0.77,
      geneCount: 8,
      fdr: 0.00064,
    },
    {
      process: "Positive regulation of macrophage activation",
      signal: 0.84,
      geneCount: 5,
      fdr: 0.00073,
    },
    {
      process: "Positive regulation of alpha-beta T cell differentiation",
      signal: 0.8,
      geneCount: 6,
      fdr: 0.00079,
    },
    {
      process: "Positive regulation of T cell differentiation",
      signal: 0.73,
      geneCount: 8,
      fdr: 0.00093,
    },
    { process: "Phagocytosis", signal: 0.68, geneCount: 9, fdr: 0.0012 },
    {
      process: "Regulation of T cell differentiation",
      signal: 0.63,
      geneCount: 9,
      fdr: 0.002,
    },
    {
      process: "Positive regulation of inflammatory response",
      signal: 0.63,
      geneCount: 8,
      fdr: 0.0023,
    },
    {
      process: "Positive regulation of binding",
      signal: 0.59,
      geneCount: 9,
      fdr: 0.0029,
    },
    {
      process: "Positive regulation of leukocyte differentiation",
      signal: 0.56,
      geneCount: 9,
      fdr: 0.0039,
    },
    {
      process: "Regulation of CD4-positive, alpha-beta T cell activation",
      signal: 0.61,
      geneCount: 6,
      fdr: 0.0039,
    },
    {
      process: "Regulation of alpha-beta T cell activation",
      signal: 0.59,
      geneCount: 7,
      fdr: 0.0041,
    },
    {
      process:
        "Positive regulation of adaptive immune response based on somatic recombination of immune receptors built from immunoglobulin superfamily domains",
      signal: 0.58,
      geneCount: 7,
      fdr: 0.0043,
    },
    {
      process: "Positive regulation of T-helper cell differentiation",
      signal: 0.64,
      geneCount: 4,
      fdr: 0.0043,
    },
  ],
};

const DEG_list_name = "Monocyte GGL suppressed";
const data = all_data[DEG_list_name];

function processFDR(data) {
  return data.map((item) => {
    // Apply the transformation to ensure correctness
    const transformedFDR = -Math.log10(item.fdr);
    return {
      ...item,
      fdr: transformedFDR,
    };
  });
}

const processedData = processFDR(data);

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

const geneCountsLegendVals = generateGeneCountsLegendVals(processedData);

// Initial margin and dimensions
const margin = { top: 20, right: 300, bottom: 50, left: 500 };
const width = 1400 - margin.left - margin.right;
const height = (600 * processedData.length) / 10 - margin.top - margin.bottom;

const App = () => {
  const [xAxisLabel, setXAxisLabel] = useState("Signal");

  // Sort data based on the selected x-axis label
  const sortedData =
    xAxisLabel === "Signal"
      ? processedData.sort((a, b) => b.signal - a.signal)
      : processedData.sort((a, b) => b.fdr - a.fdr);

  return (
    <div style={{ margin: "60px" }}>
      <h1 style={{ textAlign: "center", fontWeight: "400" }}>
        GO:BP Enrichment of {DEG_list_name} genes
      </h1>

      {/* This is the dropdown for x axis label */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
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
