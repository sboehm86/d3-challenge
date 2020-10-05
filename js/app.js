// read the data...
data= d3.csv("data/data.csv")


//create scatterplot... 
    //first make the svg... div id="scatter"
var svg=d3.select("#scatter").append("svg")
    .attr("class","chart")
    .attr("width", width)
    .attr("height", height);


//fung shuei the plot...
var width= parseInt(d3.select("#scatter").style("width"));
var height= width-width/3;
var margin= 15;
var labelSpace= 100;
var txtpdB=40;
var txtpdL=40;

//since this is a scatterplot we need to make our circles but they need to
//be scalable and contain text...
var circleRadi;
    function cirRadi(){ if (width >= 530){
            circleRadi=12;
        }
        else { circleRadi=6;}
    }
cirRadi();

//readability
//Labels instead of labeling directly we need to make them a function/group so
//scaling can work correctly
var xLabel=d3.select(".xLabel");
svg.append("g")
    .attr("class", "xLabel");
function newXlabel(){
    xLabel.attr("transform","translate (" +
    ((width - labelSpace)/2 + labelSpace) +", " + 
    (height - margin - txtpdB) + ")"
    );
}
newXlabel();

//use our xLabel to append the three different svgs needed, poverty:age:income
xLabel.append ("text")
    .attr("data-name","poverty") 
    .attr("class", "aText active x")  
    .attr("y", -26)
    .attr("data-axis","x")    
    .text("In Poverty (%)");

xLabel.append("text")
    .attr("data-name","age")
    .attr("class","aText inactive x")
    .attr("y", 0)
    .attr("data-axis", "x")
    .text("Age (median)");

xLabel.append("text")
    .attr("data-name", "income")
    .attr("class", "aText inactive x")
    .attr("y", 26)
    .attr("data-axis", "x")
    .text("Income, household (median)");

//now the left side

