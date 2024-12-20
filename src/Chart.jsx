import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const Chart = ({
  data,
  width,
  height,
  margin,
  fdrValues,
  geneCounts,
  xAxisLabel,
}) => {
  const chartRef = useRef();

  useEffect(() => {
    // Clear previous SVG content if it exists
    d3.select(chartRef.current).selectAll("*").remove();

    // Create the SVG element
    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Determine the x-axis data field based on xAxisLabel
    const xValue = xAxisLabel === "FDR" ? (d) => d.fdr : (d) => d.signal;

    // Scales for X and Y axes
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, xValue)])
      .range([0, width]);

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.process))
      .range([0, height])
      .padding(0.1);

    // Size scale for Gene Count (circles' radius)
    const sizeScale = d3
      .scaleSqrt()
      .domain([0, d3.max(data, (d) => d.geneCount)])
      .range([5, 20]);

    // Add X Axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // Add X-axis Label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .attr("text-anchor", "middle")
      .attr("font-size", 16)
      .text(xAxisLabel);

    // Add Y Axis with increased font size for process labels
    svg
      .append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "16px");

    const stopColor1 = "#2fa4c1";
    const stopColor2 = "#d6eeb3";

    // Color scale based on FDR values
    const colorScale = d3
      .scaleSequential()
      .interpolator(d3.interpolateRgb(stopColor1, stopColor2))
      .domain(d3.extent(data, (d) => d.fdr));

    // Draw lines
    svg
      .append("g")
      .selectAll("line")
      .data(data)
      .join("line")
      .attr("x1", 0)
      .attr("x2", (d) => x(xValue(d)))
      .attr("y1", (d) => y(d.process) + y.bandwidth() / 2)
      .attr("y2", (d) => y(d.process) + y.bandwidth() / 2)
      .attr("stroke", (d) => colorScale(d.fdr))
      .attr("stroke-width", 5);

    // Draw circles with size according to geneCount
    svg
      .append("g")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => x(xValue(d)))
      .attr("cy", (d) => y(d.process) + y.bandwidth() / 2)
      .attr("r", (d) => sizeScale(d.geneCount))
      .attr("fill", (d) => colorScale(d.fdr))
      .attr("stroke", "#b8c6a5")
      .attr("stroke-width", 4);
  }, [data, width, height, margin, xAxisLabel]);

  return <div ref={chartRef} />;
};

export default Chart;
