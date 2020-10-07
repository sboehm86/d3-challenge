//shift+alt+f to clean indents
//create scatterplot... I keep wanting to do things "backwards" as I would in python
//first make the svg... div id="scatter"...nope didnt work moved what was here to line(s) 12

//fung shuei the plot...set up the container...
var width = parseInt(d3.select("#scatter").style("width"));
var height = width - width / 4;
var margin = 19;
var labelSpace = 105;
var txtpdB = 40;
var txtpdL = 40;

var svg = d3.select("#scatter").append("svg")
    .attr("class", "chart")
    .attr("width", width)
    .attr("height", height);

    //since this is a scatterplot we need to make our circles but they need to
    //be scalable and contain text...
    var circleRadi;
    function cirRadi() {
        if (width >= 530) {
        circleRadi = 12;
        }
        else { circleRadi = 6; }
    }   
    cirRadi();

    //readability

    //Labels instead of labeling directly we need to make them a function/group so
    //scaling can work correctly
svg.append("g").attr("class", "xLabel");
var xLabel = d3.select(".xLabel");
xLabel.attr("transform", "translate (" +
    ((width - labelSpace) / 2 + labelSpace) + ", " +
    (height - margin - txtpdB) + ")"
);


//use our xLabel to append the three different svgs needed, poverty:age:income
xLabel.append("text")
    .attr("data-name", "poverty")
    .attr("class", "aText active x")
    .attr("y", -26)
    .attr("data-axis", "x")
    .text("In Poverty (%)");

xLabel.append("text")
    .attr("data-name", "age")
    .attr("class", "aText inactive x")
    .attr("y", 0)
    .attr("data-axis", "x")
    .text("Age (median)");

xLabel.append("text")
    .attr("data-name", "income")
    .attr("class", "aText inactive x")
    .attr("y", 26)
    .attr("data-axis", "x")
    .text("Income, household (median)");

//now the left side...
var textLeftX = margin + txtpdL;
var textLeftY = (labelSpace + height) / 2 - labelSpace;

var yLabel = d3.select(".yLabel");
svg.append("g")
    .attr("class", "yLabel");

function newYlabel() {
    yLabel.attr("transform", "translate (" +
        textLeftX + ", " + textLeftY + ") rotate(-90)"
    );
}
newYlabel();

//and again as above but for Obesity, Lack of Healthcare, Smoker
yLabel.append("text")
    .attr("data-name", "obesity")
    .attr("class", "aText active y")
    .attr("y", -26)
    .attr("data-axis", "y")
    .text("Obese (%)");

yLabel.append("text")
    .attr("data-name", "healthcare")
    .attr("class", "aText inactive y")
    .attr("y", 26)
    .attr("data-axis", "y")
    .text("Lack of Healthcare (%)");

yLabel.append("text")
    .attr("data-name", "smokes")
    .attr("class", "aText inactive y")
    .attr("x", 0)
    .attr("data-axis", "y")
    .text("Smokers (%)");

// read the data... I keep wanting to put this up top
data = d3.csv("data/data.csv").then((data) => {
    visualize(data);
});

//make our visualization function to display the csv data, set up variables
function visualize(theData) {
    var curX = "poverty";
    var curY = "smoking";
    //leave these blank for make future code more efficient...
    var yMin;
    var yMax;
    var xMin;
    var xMax;

    //change our min and max to allow for changing data
    function XminMax() {
        xMin = d3.min(theData, function (d) {
            return parseFloat(d[curX]) * .9;
        });//min grabs the smallest, max the largest
        xMax = d3.max(theData, function (d) {
            return parseFloat(d[curX]) * 1.1;
        });
    }

    function YminMax() {
        yMin = d3.min(theData, function (d) {
            return parseFloat(d[curY]) * .9;
        });//min grabs the smallest, max the largest
        yMax = d3.max(theData, function (d) {
            return parseFloat(d[curY]) * 1.1;
        });
    }

    //now we can generate the svg with the data
    XminMax();
    YminMax();

    //forgot I needed scales...
    var Xscale = d3
        .scalelinear()
        .domain([xMin, xMax])
        .range([margin + labelSpace, width - margin]);

    var Yscale = d3
        .scaleLinear()
        .domain([yMin, yMax])
        .range([height - margin - labelSpace, margin]);

    var yAxis = d3.axisLeft(Yscale);
    var xAxis = d3.axisBottom(Xscale);

    svg.append("g").call(xAxis)
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + (height - margin - labelSpace) + ")");

    svg.append("g").call(yAxis)
        .attr("class", "yAxis")
        .attr("transform", "translate(" + (margin + labelSpace) + ",0)");

    //data grouping and labels
    var circles = svg.selectAll("g circles").data(theData).enter();
    circles.append("circle")
        .attr("cx", function (d) {
            return Xscale(d[curX]);
        })
        .attr("cy", function (d) {
            return Yscale(d[curY])
        })
        .attr("r", circleRadi)
        .attr("class", function (d) {
            return "stateCircle " + d.abbr;
        })

}