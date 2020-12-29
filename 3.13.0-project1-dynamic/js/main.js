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

let flag = true;

const g = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
  .append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

// x labels
g.append("text")
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Month");

// y labels
const yLabel = g
  .append("text")
  .attr("class", "y axis-label")
  .attr("x", -(HEIGHT / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)");

// linear scaling
const y = d3.scaleLinear().range([HEIGHT, 0]);

// band scaling
const x = d3.scaleBand().range([0, WIDTH]).paddingInner(0.3).paddingOuter(0.2);

const xAxisGroup = g
  .append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${HEIGHT})`);

const yAxisGroup = g.append("g").attr("class", "y axis");

// load data
d3.csv("data/revenues.csv").then((data) => {
  //   console.log(data);
  data.forEach((d) => {
    d.revenue = Number(d.revenue);
    d.profit = Number(d.profit);
  });

  update(data);

  // intervals
  d3.interval(() => {
    flag = !flag;
    const newData = flag ? data : data.slice(1);
    update(newData);
  }, 1000);
});

// update
function update(data) {
  const t = d3.transition().duration(750);
  const value = flag ? "profit" : "revenue";

  // set domains
  y.domain([0, d3.max(data, (d) => d[value])]);
  x.domain(data.map((d) => d.month));

  // axes
  const xAxisCall = d3.axisBottom(x);
  xAxisGroup.transition(t).call(xAxisCall);
  // .selectAll("text")
  // .attr("y", "10")
  // .attr("x", "-5")
  // .attr("text-anchor", "end");

  const yAxisCall = d3
    .axisLeft(y)
    .ticks(10)
    .tickFormat((d) => "$" + d);
  yAxisGroup.transition(t).call(yAxisCall);

  // change value of label
  const text = flag ? "Profit ($)" : "Revenue ($)";
  yLabel.text(text);

  // JOIN new data wiht old elements
  const rectangles = g.selectAll("rect").data(data, (d) => d.month);

  // EXIT old elements not present in new data
  rectangles
    .exit()
    .attr("fill", "red")
    .transition(t)
    .attr("height", 0)
    .attr("y", y(0))
    .remove();

  // UPDATE old elements present in new data
  // rectangles
  //   .transition(t)
  //   .attr("x", (item) => x(item.month))
  //   .attr("y", (item) => y(item[value]))
  //   .attr("width", x.bandwidth())
  //   .attr("height", (item) => HEIGHT - y(item[value]));

  // // ENTER new elements present in new data
  // rectangles
  //   .enter()
  //   .append("rect")
  //   .attr("x", (item) => x(item.month))
  //   .attr("width", x.bandwidth())
  //   .attr("fill", "grey")
  //   .attr("y", y(0))
  //   .attr("height", 0)
  //   .transition(t)
  //   .attr("y", (item) => y(item[value]))
  //   .attr("height", (item) => HEIGHT - y(item[value]));

  // MERGING UPDATE AND ENTER
  rectangles
    .enter()
    .append("rect")
    .attr("fill", "grey")
    .attr("y", y(0))
    .attr("height", 0)
    .merge(rectangles) // AND UPDATE old elements present in new data
    .transition(t)
    .attr("x", (item) => x(item.month))
    .attr("width", x.bandwidth())
    .attr("y", (item) => y(item[value]))
    .attr("height", (item) => HEIGHT - y(item[value]));
}
