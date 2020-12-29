/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    2.5 - Activity: Adding SVGs to the screen
 */

const data = [25, 20, 10, 12, 15];

const canvas = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", 500)
  .attr("height", 400);

// adding independent shapes
canvas
  .append("rect")
  .attr("width", 200)
  .attr("height", 100)
  .attr("fill", "green");

canvas
  .append("circle")
  .attr("cx", 350)
  .attr("cy", 150)
  .attr("r", 50)
  .attr("fill", "orange");

// dynamic shapes
// data
const circles = canvas.selectAll("circle").data(data);

// circles
//   .enter()
//   .append("circle")
//   .attr("cx", 100)
//   .attr("cy", 250)
//   .attr("r", 70)
//   .attr("fill", "red");

circles
  .enter()
  .append("circle")
  .attr("cx", (data, index) => {
    console.log("Item:", data, "Index:", index);
    return index * 50 + 50;
  })
  .attr("cy", 250)
  .attr("r", (data, index) => {
    console.log(data);
    return data;
  })
  .attr("fill", "red");
