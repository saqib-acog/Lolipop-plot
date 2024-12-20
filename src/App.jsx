import React from "react";
import Chart from "./Chart";

// Original data
const data = [
  {
    process: "Positive regulation of cytokine production",
    signal: 1.1,
    geneCount: 35,
    fdr: -Math.log10(3.0e-8),
  },
  {
    process: "Positive regulation of leukocyte activation",
    signal: 1.08,
    geneCount: 30,
    fdr: -Math.log10(1.0e-7),
  },
  {
    process: "Positive regulation of multicellular organismal process",
    signal: 0.95,
    geneCount: 25,
    fdr: -Math.log10(4.0e-6),
  },
  {
    process: "Positive regulation of tumor necrosis factor production",
    signal: 0.93,
    geneCount: 10,
    fdr: -Math.log10(1.0e-5),
  },
  {
    process: "Regulation of tumor necrosis factor production",
    signal: 0.9,
    geneCount: 15,
    fdr: -Math.log10(9.0e-5),
  },
  {
    process: "Positive regulation of cell adhesion",
    signal: 0.94,
    geneCount: 20,
    fdr: -Math.log10(4.0e-6),
  },
  {
    process: "Positive regulation of cell differentiation",
    signal: 0.92,
    geneCount: 28,
    fdr: -Math.log10(1.0e-7),
  },
  {
    process: "Regulation of immune system process",
    signal: 0.91,
    geneCount: 32,
    fdr: -Math.log10(8.0e-7),
  },
  {
    process: "Positive regulation of leukocyte cell-cell adhesion",
    signal: 0.9,
    geneCount: 12,
    fdr: -Math.log10(1.0e-5),
  },
  {
    process: "Regulation of cell adhesion",
    signal: 0.9,
    geneCount: 22,
    fdr: -Math.log10(4.0e-6),
  },
];

// Sort data by FDR (lowest FDR first)
const sortedData = data.sort((a, b) => a.fdr - b.fdr);

// Create separate arrays for geneCount and fdr without duplicates
const geneCounts = Array.from(
  new Set(
    sortedData
      .filter((item) => item.geneCount % 10 === 0)
      .map((item) => item.geneCount)
  )
);
console.log(geneCounts);

const fdrValues = Array.from(new Set(sortedData.map((item) => item.fdr)));

const margin = { top: 20, right: 300, bottom: 50, left: 500 };
const width = 1400 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const App = () => {
  return (
    <div style={{ margin: "60px" }}>
      <h1 style={{ textAlign: "center", fontWeight: "400" }}>
        Biological Process Gene Ontology Enrichment
      </h1>
      <Chart
        geneCounts={geneCounts.sort((a, b) => a - b)}
        fdrValues={fdrValues}
        data={sortedData}
        width={width}
        height={height}
        margin={margin}
      />
    </div>
  );
};

export default App;
