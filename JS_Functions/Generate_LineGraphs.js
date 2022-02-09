data_sine = []
data_cos = []
const xSize = 600; const ySize = 600;
                const margin = 40;
                const xMax = xSize - margin*2;
                const yMax = ySize - margin*2;
                
    for (let i = 0; i < 100; i++) { data_sine.push( {x: i/100, y: Math.sin( 6.2 * i/100 ) } ); }
    for (let i = 0; i < 100; i++) { data_cos.push( {x: i/100, y: Math.cos( 6.2 * i/100 ) } ); }
                   
                                    function Generate_graph_points(svg, data,colour,point,flag){

const xExtent = d3.extent( data, d=>{ return d.x } );
const yExtent = d3.extent( data, d=>{ return d.y } );

// Append SVG Object to the Page
// X Axis
const x = d3.scaleLinear()
.domain([ xExtent[0], xExtent[1] ])
.range([0, xMax]);
// bottom
svg.append("g")
.attr("transform", "translate(0," + yMax + ")")
.call(d3.axisBottom(x))
.attr('color', 'green'); // make bottom axis green
// top
svg.append("g")
.call(d3.axisTop(x));
// Y Axis
const y = d3.scaleLinear()
.domain([ yExtent[0], yExtent[1] ])
.range([ yMax, 0]);
// left y axis
svg.append("g")
.call(d3.axisLeft(y));
// right y axis
svg.append("g")
.attr("transform", `translate(${yMax},0)`)
.call(d3.axisRight(y));
// Add the line
svg.append("path")
.datum(data)
.attr("fill", "none")
.attr("stroke", colour)
.attr("stroke-width", 1.5)
.attr("d", d3.line()
.x(function(d) { return x(d.x) })
.y(function(d) { return y(d.y) })
);




if(point==='triangle') // code for triangle from //http://using-d3js.com/05_10_symbols.html
{
    svg.selectAll("dot")
.data(data) 
.enter()
.append("path")
.attr("d", d3.symbol().type(d3.symbolTriangle))
.attr("transform", function (d) { return "translate(" + x(d.x) + "," + y(d.y) + ")" })
.style("fill", colour)
}

if(point==='circle')
{
    svg.selectAll("dot")
.data(data) 
.enter()
.append("circle")
.attr("cx", function (d) { return x(d.x) } )
.attr("cy", function (d) { return y(d.y) } )
.attr("r", 4)
.style("fill", colour);
}


if(flag)   { 
            svg.selectAll("dot")
                .data(data)
                .enter()
                .append("text") 
                .text(function (d, i) {return i % 10 === 0 ? ('('+d.x+' , '+d.y.toFixed(2))+')':'' })//every 10th index gets displayed
                .attr("x", function (d) { return x(d.x)+10; })
                .attr("y", function (d) { return y(d.y); })
                .style('fill', colour);}
        }

        export {Generate_graph_points}