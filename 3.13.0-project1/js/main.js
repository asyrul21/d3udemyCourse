/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 1 - Star Break Coffee
 */

// set margin
const MARGIN = {
  TOP: 100,
  BOTTOM: 100,
  LEFT: 100,
  RIGHT: 10,
};
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;

const g = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
  .append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

// load data
d3.csv("data/revenues.csv").then((data) => {
  //   console.log(data);
  data.forEach((d) => {
    d.revenue = Number(d.revenue);
    d.profit = Number(d.profit);
  });
  console.log(data);

  // linear scaling
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.revenue)])
    .range([HEIGHT, 0]);

  // band scaling
  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.month))
    .range([0, WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2);

  // axes
  const xAxisCall = d3.axisBottom(x);
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${HEIGHT})`)
    .call(xAxisCall);
  // .selectAll("text")
  // .attr("y", "10")
  // .attr("x", "-5")
  // .attr("text-anchor", "end");

  const yAxisCall = d3
    .axisLeft(y)
    .ticks(10)
    .tickFormat((d) => "$" + d);
  g.append("g").attr("class", "y axis").call(yAxisCall);

  const rectangles = g.selectAll("rect").data(data);
  //   console.log(rectangles);

  // labels
  g.append("text")
    .attr("class", "x axis-label")
    .attr("x", WIDTH / 2)
    .attr("y", HEIGHT + 60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Month");

  g.append("text")
    .attr("class", "y axis-label")
    .attr("x", -(HEIGHT / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenues ($)");

  rectangles
    .enter()
    .append("rect")
    .attr("x", (item) => x(item.month))
    .attr("y", (item) => y(item.revenue))
    .attr("width", x.bandwidth())
    .attr("height", (item) => HEIGHT - y(item.revenue))
    .attr("fill", "grey");
});
