var svg_6 = d3.select("svg_6");
    var margin = 200;
    var width = svg_6.attr("width") - margin;
    var height = svg_6.attr("height") - margin;

    svg_6.append("text")
     .attr("transform", "translate(100,0)")
     .attr("x", 50)
     .attr("y", 50)
     .attr("font-size", "24px")
     .text("Stock Price (hover over to show values)")

    var x_2 = d3.scaleBand().range([0, width]).padding(0.4);
    var y_2 = d3.scaleLinear().range([height, 0]);
    var g = svg_6.append("g")
                .attr("transform", "translate(" + 100 + "," + 100 + ")");

  

    d3.csv( '../csvFiles/Lab2_par4.csv' ).then(function(data) {

        
    
    Colour_arr = d3.scaleLinear()
                    .domain([d3.min(data, function (d) {return d.value;}), 
                     d3.max(data, function (d) {return d.value;})])
                    .range(['blue', 'red']);    // as asked in the question, gets all values from red to blue

     x_2.domain( data.map(function(d) { return d.year; }) );
     y_2.domain([0, d3.max(data, function(d) { return d.value; })]);

    max = d3.max(data, function(d) { return d.value; })
    min = d3.min(data, function(d) { return d.value; })
     
     g.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x_2))
     .append("text")
     .attr("y", height - 250)
     .attr("x", width - 100)
     .attr("text-anchor", "end")
     .attr("stroke", "black")
     .text("Year");

     g.append("g")
     .call(d3.axisLeft(y_2).tickFormat(function(d){
     return "$" + d;
     }).ticks(10))
     .append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 6)
     .attr("dy", "-5.1em")
     .attr("text-anchor", "end")
     .attr("stroke", "black")
     .text("Stock Price");
     
     g.selectAll(".bar")
     .data(data)
     .enter().append("rect")
    
     .on("mouseover", onMouseOver) //Add listener for the mouseover event
     .on("mouseout", onMouseOut) //Add listener for the mouseout event
     .attr("x", function(d) { return x_2(d.year); })
     .attr("y", function(d) { return y_2(d.value); })
     .attr("width", x_2.bandwidth())
     .transition()
     .ease(d3.easeLinear)
     .duration(400)
     .delay(function (d, i) {
     return i * 50;
     })
     .attr("height", function(d) { return height - y_2(d.value); })
     .attr('fill',function(d,i){ return Colour_arr(d.value)}); // get the value from colur_arr and assign it to the fill
    })
    

    function onMouseOver(d,i) {
        tempx = 0 // to get value of x position
        tempy =0 // to get value of y position
       
        d3.select(this)
        .transition() // adds animation
        .duration(200)
        .attr('width', x_2.bandwidth() + 5)
        .attr("y", function(d) {tempx =  x_2(d.year) ; return y_2(d.value) - 10; })
        .attr("height", function(d) { tempy = y_2(d.value) ; return height - y_2(d.value) + 10; })
         .attr("fill", function(d) { return d.value === max ? "orange" : d.value > min ? "green" : "orange"; })
     
        g.append("text")
        .attr('class', 'val') 
        .attr('x', function(d) {
        return  tempx +5;  // Exercise 16
        })
        .attr('y', function(d) {
        return tempy - 15 ;    // Exercise 16
        })
        .style("font", "10px times")
        .text( function(d) { return '$' + i.value; } ) // Value of the text
        .transition()
        .style("font", "20px times") }

        //mouseout event handler function
        
    function onMouseOut(d,i) {
        // use the text label class to remove label on mouseout
        d3.select(this).attr('class', 'yes');
        
        d3.select(this)
        .transition() // adds animation
        .duration(400)
        .attr('width', x_2.bandwidth())
        .attr("y", function(d) { return y_2(i.value); })
        .attr("height", function(d) { return height - y_2(i.value); })
        // .attr("class", 'yes')
        .attr('fill',function(d){ return Colour_arr(d.value)})

        d3.selectAll('.val')
        .remove()
        }


function indexOfDate(dataSet,value1) {
  for (var i=0; i<dataSet.length; i++) {
    if (dataSet[i].value === value1) return i;
  }  
  return -1;
}     