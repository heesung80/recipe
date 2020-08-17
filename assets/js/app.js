// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//var color = d3.scale.category10();
// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

//Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Initial Params
var chosenXAxis = "Number_Ingredient" ;
var chosenYAxis = "Cook_Time" ;

// function used for updating x-scale,y-scale var upon click on axis label
function xScale(cookData, chosenXAxis) {
  // create xscales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(cookData,d =>d[chosenXAxis] * .7), 
     d3.max(cookData, d => d[chosenXAxis] )])
    .range([0, width]);

  return xLinearScale;
}

function yScale(cookData, chosenYAxis) {
  // create yscales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(cookData,d =>d[chosenYAxis]*0.3), 
     d3.max(cookData, d => d[chosenYAxis] *0.4)])
    .range([height, 0]);

  return yLinearScale;
}

// function used for updating xAxis and yAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}


// function used for updating circles group with a transition to new circle

function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy",d => newYScale (d[chosenYAxis]));
  return circlesGroup;
}
// function used for updating circlestext group with a transition to new circle
function renderCirclesText(circletextGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circletextGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y",d => newYScale (d[chosenYAxis]));
  return circletextGroup;
}
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis,chosenYAxis, circlesGroup) {

  var labelX;
  if (chosenXAxis === "Number_Ingredient") {
      labelX = "Number of Ingredient:";
  }
  else {
      labelX = "Number of cooking steps:";
  }

  var labelY;

  if (chosenYAxis === "Cook_Time") {
     labelY = "Cook Time:";
  }
  else {
     labelY = "Prep time:";
  }
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([50, -30])
    .direction('se')
    .html(function(d) {
      return (`${d.Name}<br>${labelX} ${d[chosenXAxis]}<br>${labelY} ${d[chosenYAxis]}<br>Ingredients:<br> ${d.Ingredient}<br>Cooking Method:<br> ${d.Method}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}


// Import Data
d3.csv("final_recipe_dataset_N.csv").then(function(cookData,err) {
  if(err) throw err;
  console.log(cookData)

  // Parse Data/Cast as numbers
    
  cookData.forEach(function(data) {
    data.Prep_Time = +data.Prep_Time;
    data.Cook_Time = +data.Cook_Time;
    data.Number_Ingredient = +data.Number_Ingredient;
    data.Number_cooking_step = +data.Number_cooking_step;
    console.log(data.Prep_Time);
    console.log(data.Cook_Time);
    console.log(data.Number_Ingredient);
    console.log(data.Number_cooking_step);

  });

    // Create scale functions
   
    var xLinearScale = xScale(cookData, chosenXAxis);

    var yLinearScale = yScale(cookData, chosenYAxis);

    // Create axis functions
   
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    
    var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    // Create Circles
    
    var circlesGroup = chartGroup.selectAll("circle")
      .data(cookData)
      .enter()
      .append("circle")
      .attr("class","stateCircle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", "10")
      .style("fill",function() {
        return "hsl(" + Math.random() * 360 + ",100%,50%)";
        })
      ;
      //.style("fill", function(d) { return color(d.state); });
      
      
    // var circletextGroup = chartGroup.selectAll()
    //   .data(cookData)
    //   .enter()
    //   .append("text")
    //   .attr("class","stateText")
    //   .attr("x", d => xLinearScale(d[chosenXAxis]))
    //   .attr("y", d => yLinearScale(d[chosenYAxis]))
    //   .attr("font-size","10px")
    //   .text(function(d) {
    //     return (d.abbr);
    //   });

    // Create group for two x-axis labels
    var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var Number_IngredientLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 17)
      .attr("value", "Number_Ingredient") // value to grab for event listener
      .classed("active", true)
      .text("Number of Ingredient");

    var Number_cooking_stepLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 37)
      .attr("value", "Number_cooking_step") // value to grab for event listener
      .classed("inactive", true)
      .text("Number of Cooking Steps");
      
    // Create group for two y-axis labels
    var Cook_TimeLabel = labelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", (margin.left) *2.5)
      .attr("y", 0 - (height + 20))
      .attr("value", "Cook_Time") // value to grab for event listener
      .classed("active", true)
      .text("Cook Time");
    
    var Prep_TimeLabel = labelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", (margin.left) *2.5)
      .attr("y", 0 - (height+40))
      .attr("value", "Prep_Time") // value to grab for event listener
      .classed("inactive", true)
      .text("Prep time");
    
    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

     //x axis labels event listener
    labelsGroup.selectAll("text")
      .on("click", function() {
       // get value of selection
        var value = d3.select(this).attr("value");
        if (true) {
          if (value === "Number_Ingredient" || value === "Number_cooking_step") {
            // replaces chosenXAxis with value
              chosenXAxis = value;
  
            // functions here found above csv import
            // updates x scale for new data
              xLinearScale = xScale(cookData, chosenXAxis);
  
            // updates x axis with transition
              xAxis = renderXAxes(xLinearScale, xAxis);
  
          // changes classes to change bold text
            if (chosenXAxis === "Number_cooking_step") {
              Number_cooking_stepLabel
                .classed("active", true)
                .classed("inactive", false);
              Number_IngredientLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else {
              Number_cooking_stepLabel
                .classed("active", false)
                .classed("inactive", true);
              Number_IngredientLabel
                .classed("active", true)
                .classed("inactive", false);
            }
          }
          else {
            chosenYAxis = value;
            console.log(chosenYAxis)
            yLinearScale = yScale(cookData, chosenYAxis);
  
            // updates y axis with transition
            yAxis = renderYAxes(yLinearScale, yAxis);
            //changes classes to change bold text
            if (chosenYAxis === "Cook_Time") {
              Cook_TimeLabel
                .classed("active", true)
                .classed("inactive", false);
              Prep_TimeLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else {
              Cook_TimeLabel
                .classed("active", false)
                .classed("inactive", true);
              Prep_TimeLabel
                .classed("active", true)
                .classed("inactive", false);
            }

          }
        // updates circles with new x and y values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
  
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);
        // updates circlestext with new x and y values
        //circletextGroup= renderCirclesText(circletextGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);


        }
      });
}).catch(function(error) {
console.log(error);
});
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
