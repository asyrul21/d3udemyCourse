/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    2.8 - Activity: Your first visualization!
 */

d3.json("data/buildings.json").then((data) => {
  //   console.log(data);
  data.forEach((building) => {
    building.height = Number(building.height);
  });

  const svg = d3
    .select("#chart-area")
    .append("svg")
    .attr("width", 500)
    .attr("height", 500);

  const rectangles = svg.selectAll("rect").data(data);
  console.log("Rectangles:", rectangles);

  rectangles
    .enter()
    .append("rect")
    .attr("x", (item, idx) => {
      console.log(idx);
      return idx * 50;
    })
    .attr("y", 10)
    .attr("width", 20)
    .attr("height", (item, idx) => {
      console.log(item.height);
      return item.height;
    })
    .attr("fill", "grey");
});
