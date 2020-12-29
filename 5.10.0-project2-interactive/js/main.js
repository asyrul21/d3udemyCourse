/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 2 - Gapminder Clone
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

const continentColor = d3.scaleOrdinal(d3.schemePastel1);

let interval;
let count = 0;
let formattedData;

// setup svg canvas
const g = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
  .append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

// x label
g.append("text")
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("GDP Per Capita ($)");

// y label
g.append("text")
  .attr("class", "y axis-label")
  .attr("x", -(HEIGHT / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Life Expectancy (Years)");

// init tooltip
const tip = d3
  .tip()
  .attr("class", "d3-tip")
  .html((d) => {
    let text = `<strong>Country:</strong> <span style="color:red;text-transform:capitalize">${d.country}</span><br>`;
    text += `<strong>Continent:</strong> <span style="color:red;text-transform:capitalize">${d.continent}</span><br>`;
    text += `<strong>Life Expectancy:</strong> <span style="color:red;text-transform:capitalize">${d3.format(
      ".2f"
    )(d.life_exp)}</span><br>`;
    text += `<strong>GDP Per Capita:</strong> <span style="color:red;text-transform:capitalize">${d3.format(
      "$,.0f"
    )(d.income)}</span><br>`;
    text += `<strong>Population:</strong> <span style="color:red;text-transform:capitalize">${d3.format(
      ",.0f"
    )(d.population)}</span><br>`;
    return text;
  });

g.call(tip);

// year label
const yearLabel = g
  .append("text")
  .attr("x", WIDTH)
  .attr("y", HEIGHT - 10)
  .attr("fill", "grey")
  .attr("font-size", "30px")
  .attr("text-anchor", "end");

const xAxisGroup = g
  .append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${HEIGHT})`);

const yAxisGroup = g.append("g").attr("class", "y axis");

const continents = ["europe", "asia", "americas", "africa"];

// adding legends
// legend group
const legend = g
  .append("g")
  .attr("transform", `translate(${WIDTH - 10}, ${HEIGHT - 125})`); // bottom right

continents.forEach((conti, i) => {
  const legendRow = legend
    .append("g")
    .attr("transform", `translate(0, ${i * 20})`);

  legendRow
    .append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", continentColor(conti));

  legendRow
    .append("text")
    .attr("x", -10)
    .attr("y", 10)
    .attr("text-anchor", "end")
    .attr("text-transform", "capitalize")
    .text(conti);
});

d3.json("data/data.json").then(function (data) {
  formattedData = data.map((year) => {
    return {
      ...year,
      countries: year.countries.filter((country) => {
        return country.income && country.life_exp;
      }),
    };
  });
});

function step() {
  update(formattedData[count]);
  if (Number(formattedData[count].year) + 1 === 2015) {
    count = 0;
  } else {
    count += 1;
  }
}

// event handler
$("#play-button").on("click", function () {
  const button = $(this);
  if (button.text() === "Play") {
    button.text("Pause");
    interval = setInterval(step, 100);
  } else {
    button.text("Play");
    clearInterval(interval);
  }
});

$("#reset-button").on("click", function () {
  count = 0;
  update(formattedData[0]);
});

$("#continent-select").on("change", () => {
  update(formattedData[count]);
});

const update = (data) => {
  // event handling
  const continent = $("#continent-select").val();
  const filteredData = data.countries.filter((d) => {
    if (continent === "all") return true;
    else {
      return d.continent == continent;
    }
  });

  const t = d3.transition().duration(100);
  // scaling
  const y = d3.scaleLinear().domain([0, 90]).range([HEIGHT, 0]);
  const x = d3.scaleLog().domain([100, 150000]).range([0, WIDTH]);

  const maxRDomain = d3.max(data.countries, (d) => {
    return d.population;
  });

  const minRDomain = d3.min(data.countries, (d) => {
    return d.population;
  });

  const area = d3
    .scaleLinear()
    .range([25 * Math.PI, 1500 * Math.PI]) // 5-25 radius to area // area = PI * radius(squared)
    // .domain([2000, 1400000000]);
    .domain([minRDomain, maxRDomain]);

  // axes
  const xAxisCall = d3
    .axisBottom(x)
    .tickValues([400, 4000, 40000])
    .tickFormat((value) => value);
  xAxisGroup.transition(t).call(xAxisCall);

  const yAxisCall = d3.axisLeft(y).ticks(10);
  yAxisGroup.transition(t).call(yAxisCall);

  //update year
  yearLabel.text(data.year);

  // JOIN new data with old elements
  const circles = g.selectAll("circle").data(filteredData, (d) => d.country);

  // EXIT old elements not present in new data
  circles.exit().remove();

  // UPDATE old elements present in data
  circles
    .attr("cx", (item) => x(item.income))
    .attr("cy", (item) => y(item.life_exp))
    .attr("r", (d) => Math.sqrt(area(d.population) / Math.PI))
    .attr("fill", (d) => continentColor(d.continent));

  // ENTER new elements present in data
  circles
    .enter()
    .append("circle")
    .attr("fill", (d) => continentColor(d.continent))
    .attr("r", (d) => Math.sqrt(area(d.population) / Math.PI))
    .attr("cx", (item) => x(item.income))
    .attr("cy", (item) => y(item.life_exp))
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide);
};
