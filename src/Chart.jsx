import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const Chart = ({ data, width, height, margin, fdrValues, geneCounts }) => {
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

    // Scales for X and Y axes
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.signal)])
      .range([0, width]);

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.process))
      .range([0, height])
      .padding(0.1);

    // Size scale for Gene Count (circles' radius)
    const sizeScale = d3
      .scaleSqrt()
      .domain([0, d3.max(data, (d) => d.geneCount)]) // Normalize the size by max geneCount
      .range([5, 20]); // Map geneCount to circle size range

    // Add X Axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // Add X-axis Label
    svg
      .append("text")
      .attr("x", width / 2) // Center the label horizontally
      .attr("y", height + margin.bottom - 10) // Position the label below the X-axis
      .attr("text-anchor", "middle") // Center the text alignment
      .attr("font-size", 16)
      .text("Signal");

    // Add Y Axis with increased font size for process labels
    svg
      .append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "16px");

    const stopColor1 = "#d6eeb3";
    const stopColor2 = "#2fa4c1";
    // Color scale based on FDR values (log scale for better visual differentiation)
    const colorScale = d3
      .scaleSequential()
      .interpolator(d3.interpolateRgb(stopColor2, stopColor1)) // Light blue to light green
      .domain(d3.extent(data, (d) => d.fdr));

    // Draw lines
    svg
      .append("g")
      .selectAll("line")
      .data(data)
      .join("line")
      .attr("x1", 0)
      .attr("x2", (d) => x(d.signal))
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
      .attr("cx", (d) => x(d.signal))
      .attr("cy", (d) => y(d.process) + y.bandwidth() / 2)
      .attr("r", (d) => sizeScale(d.geneCount))
      .attr("fill", (d) => colorScale(d.fdr))
      .attr("stroke", "#b8c6a5")
      .attr("stroke-width", 4);

    // Add FDR Legend
    const legendHeight = 200;
    const legendWidth = 25;

    const legendScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.fdr))
      .range([0, legendHeight]);

    const legendAxis = d3.axisRight(legendScale).tickFormat((d) => `${d}`);

    const legend = svg.append("g").attr(
      "transform",
      `translate(${width + 100}, ${height / 4 - legendHeight / 2})` // Adjust vertical position
    );

    // Modify the gradient to use shades of blue or green
    const legendGradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "legend-gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%");

    // Start with light blue
    legendGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", stopColor1); // Light blue (LightSkyBlue)

    // Transition to light green
    legendGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", stopColor2);

    legend
      .append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#legend-gradient)");

    legend
      .append("g")
      .attr("transform", `translate(${legendWidth}, 0)`)
      .call(legendAxis);

    legend
      .append("text")
      .attr("x", 0)
      .attr("y", -10)
      .text("FDR")
      .attr("font-size", 16);

    // Add Gene Count Legend (size of circles)
    const geneCountLegendWidth = 20;
    const geneCountLegendHeight = 200;
    const maxRadius = sizeScale(d3.max(data, (d) => d.geneCount));

    const geneCountLegend = svg.append("g").attr(
      "transform",
      `translate(${width + 100}, ${height / 4 + legendHeight / 2 + 60})` // Position below the FDR legend
    );

    geneCountLegend
      .selectAll("circle")
      .data(geneCounts)
      .join("circle")
      .attr("cx", geneCountLegendWidth / 2 + 10)
      .attr("cy", (d, i) => i * 50)
      .attr("r", (d) => sizeScale(d))
      .attr("fill", stopColor1)
      .attr("stroke", "#b8c6a5")
      .attr("stroke-width", 4);

    geneCountLegend
      .selectAll("text")
      .data(geneCounts)
      .join("text")
      .attr("x", geneCountLegendWidth / 2 + 5)
      .attr("y", (d, i) => i * 50)
      .attr("dy", "0.35em")
      .text((d) => `${d}`)
      .attr("font-size", 12)
      .style("text-anchor", "start");

    geneCountLegend
      .append("text")
      .attr("x", geneCountLegendWidth / 2 - 25)
      .attr("y", -20)
      .text("Gene Count")
      .attr("font-size", 16);
  }, [data, width, height, margin]);

  return <div ref={chartRef} />;
};

export default Chart;
