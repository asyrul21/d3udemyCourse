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

d3.json("data/data.json").then(function (data) {
  // clean data
  //   const formattedData = data.map((year) => {
  //     return year["countries"]
  //       .filter((country) => {
  //         const dataExists = country.income && country.life_exp;
  //         return dataExists;
  //       })
  //       .map((country) => {
  //         country.income = Number(country.income);
  //         country.life_exp = Number(country.life_exp);
  //         return country;
  //       });
  //   });
  //   console.log(formattedData);

  const formattedData = data.map((year) => {
    return {
      ...year,
      countries: year.countries.filter((country) => {
        return country.income && country.life_exp;
      }),
    };
  });
  //   console.log(formattedData[0]);

  //   set interval here
  let count = 0;
  d3.interval(() => {
    update(formattedData[count]);
    if (Number(formattedData[count].year) + 1 === 2015) {
      count = 0;
    } else {
      count += 1;
    }

    // });
  }, 100);
});

const update = (data) => {
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
  const continentColor = d3.scaleOrdinal(d3.schemePastel1);

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
  const circles = g
    .selectAll("circle")
    .data(data.countries, (d) => d.countries);

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
    .attr("cy", (item) => y(item.life_exp));
};
