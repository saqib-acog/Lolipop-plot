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

    // Determine the x-axis scale based on the selected xAxisLabel
    const x = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d) => (xAxisLabel === "Signal" ? d.signal : d.fdr)),
      ])
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
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "18px"); // Increase

    // Add X-axis Label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom)
      .attr("text-anchor", "middle")
      .attr("font-size", 22)
      .text(xAxisLabel);

    // Add Y Axis with labels
    svg
      .append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "16px");

    // Color scale based on FDR values
    const stopColor1 = "#2fa4c1";
    const stopColor2 = "#d6eeb3";
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
      .attr("x2", (d) => x(xAxisLabel === "Signal" ? d.signal : d.fdr))
      .attr("y1", (d) => y(d.process) + y.bandwidth() / 2)
      .attr("y2", (d) => y(d.process) + y.bandwidth() / 2)
      .attr("stroke", (d) => colorScale(d.fdr))
      .attr("stroke-width", 5);

    // Draw circles
    svg
      .append("g")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => x(xAxisLabel === "Signal" ? d.signal : d.fdr))
      .attr("cy", (d) => y(d.process) + y.bandwidth() / 2)
      .attr("r", (d) => sizeScale(d.geneCount))
      .attr("fill", (d) => colorScale(d.fdr))
      .attr("stroke", "#b8c6a5")
      .attr("stroke-width", 4);

    // Add FDR Legend
    const legendHeight = 200;
    const legendWidth = 25;

    // Calculate the extent of FDR values
    const fdrExtent = d3.extent(data, (d) => d.fdr);

    // Create the legend scale
    const legendScale = d3
      .scaleLinear()
      .domain(fdrExtent)
      .range([legendHeight, 0]);

    // Determine an appropriate number of ticks based on the FDR range
    const tickCount = Math.max(
      2,
      Math.min(5, Math.ceil((fdrExtent[1] - fdrExtent[0]) / 0.05))
    );

    // Create the legend axis with the dynamic tick count
    const legendAxis = d3
      .axisRight(legendScale)
      .ticks(tickCount) // Adjusted number of ticks
      .tickFormat((d) => `${d.toFixed(2)}`);

    // Create the legend group
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width + 100}, 60)`);

    // Create the gradient for the legend
    const legendGradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "legend-gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%");

    legendGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", stopColor1);

    legendGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", stopColor2);

    // Append the gradient rectangle for the legend
    legend
      .append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#legend-gradient)");

    // Append the legend axis
    legend
      .append("g")
      .attr("transform", `translate(${legendWidth}, 0)`)
      .call(legendAxis);

    // Add legend title
    legend
      .append("text")
      .attr("x", 0)
      .attr("y", -10)
      .text("-log10(FDR)")
      .attr("font-size", 16);

    // Gene Count Legend
    const geneCountLegend = svg
      .append("g")
      .attr("transform", `translate(${width + 100}, ${legendHeight + 120})`);

    geneCountLegend
      .selectAll("circle")
      .data(geneCounts)
      .join("circle")
      .attr("cx", 20)
      .attr("cy", (d, i) => i * 50)
      .attr("r", (d) => sizeScale(d))
      .attr("fill", stopColor1)
      .attr("stroke", "#b8c6a5")
      .attr("stroke-width", 4);

    geneCountLegend
      .selectAll("text")
      .data(geneCounts)
      .join("text")
      .attr("x", 40)
      .attr("y", (d, i) => i * 50)
      .attr("dy", "0.35em")
      .text((d) => `${d}`)
      .attr("font-size", 12);

    geneCountLegend
      .append("text")
      .attr("x", 0)
      .attr("y", -20)
      .text("Gene Count")
      .attr("font-size", 16);
  }, [data, width, height, margin, xAxisLabel]);

  return <div ref={chartRef} />;
};

export default Chart;
