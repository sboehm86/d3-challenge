var svgWidth =800;
var svgHeight = 650;

var margin = {
    top: 40,
    bottom: 40,
    left: 40,
    right: 40};

var width = svgWidth - (margin.left + margin.right);
var height = svgHeight - (margin.top + margin.bottom);

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("class", "chart");

//from Project 2 I realized iwas missing this piece...
var chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// read the data... I keep wanting to put this up top...moved back up from 115...
d3.csv("data/data.csv").then((data) => {
    //visualize(data);
    data.forEach((data) => {
        data.state = +data.state;
        data.obesity = +data.obesity;
        data.income = +data.income;
    });

    //forgot I needed scales...

    //yMin = d3.min(data, (d) => parseFloat(d[curY]) * .9);//min grabs the smallest, max the largest
    //yMax = d3.max(data, (d) => parseFloat(d[curY]) * 1.1);
    //xMin = d3.min(data, (d) => parseFloat(d[curX]) * .9);//min grabs the smallest, max the largest
    //xMax = d3.max(data, (d) => parseFloat(d[curX]) * 1.1);

    var xAxis = d3.scaleLinear()
        .domain([d3.min(data, d => d.income) - 2000, d3.max(data, d => d.income) + 2000])
        .range([0, width]);

    var yAxis = d3.scaleLinear()
        .domain([d3.min(data, d => d.obesity) - 3, d3.max(data, d => d.obesity) + 3])
        .range([height, 0])

    //create axis function using variables we just made...i forgot to put var in front of both of these
    var xAxis = d3.axisBottom(xAxis);
    var yAxis = d3.axisLeft(yAxis);

    //add the axis to the chart
    chart.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);
    chart.append("g")
        .call(yAxis);

    //create chart guts now that chart is created, starting witht the circles...
    var circles = chart.selectAll(".circle")
        .data(data)
        .enter()
        .append("rect")
        .classed("bar", true)
        .attr("width", data => barWidth)
        .attr("height", data => data.spawn_chance * scaleY)
        .attr("x", (data, i) => i * (barWidth + barSpacing))
        .attr("y", data => chartHeight - data.spawn_chance * scaleY);
    
    //circles.append("circle")
        //.attr("class", "dot")
        //.attr("r", (data) => d.r)
        //.attr("cx", (data) => (data.xAxis))
        //.attr("cy", (data) => (data.yAxis));
    //.style("fill", (d) => d.c);

    // make our labels now
    chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -25 - margin.left + 20)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Obesity (BMI)");

    chart.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
        .attr("class", "axisText")
        .text("Income");

    // and finally the tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([-8, 0])
        .html(function (data) {
            return (`${data.state}`)
        });

    chart.call(toolTip);

    // make the tooltip function on a mouseover
    circles.on("mouseover", function (data) {
        toolTip.show(data, this);
    })
        .on("mouseout", (data) => {
                toolTip.hide(data);
            });

})

    //I removed the original contents of 40-202 from here because I decided a complete rebuild of the
    //code was in order, the original contents are in the junk code document in data