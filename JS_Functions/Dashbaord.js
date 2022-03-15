
  console.log('d3.version:', d3.version);
  //get window size
  let  w = window.innerWidth ;
  let  h = window.innerHeight ;
  
  let  w2 = window.innerWidth ;
  let  h2 = window.innerHeight ;
  
  
    //create 5 svg elements
  
      
  
     
      
  
 
  
  
  
      let  projection = d3
      .geoEquirectangular()
      .center([0, 0]) // set centre to further North
     .scale(223) // scale to fit group width
     .translate([w/2,h/2]) // ensure centred in group
      // .scale(150)
      // .translate([w, h-190]);
  
  // A path generator
  let  path = d3.geoPath()
      .projection(projection)
  
      function zoomed() {
     t = d3
        .event
        .transform
     ;
     countriesGroup.attr(
        "transform","translate(" + [t.x, t.y] + ")scale(" + t.k + ")"
     );
  }
  
  
  
  
  
  let  svg1 = d3.select("body")
      .select("#svg11")
      .append("svg")
      .attr("id", "svg1")
      .style("background-color", "white")
      .style("border", "3px solid black")
      .attr("viewBox", "0 0 " + w + " " + h )
      .attr("class", "box1")
   
  
  
   
  
      
      
  // Load world shape AND list of connection
  Promise.all([
    d3.json("https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/maps/mapdata/custom50.json"), 
    d3.json('../csvFiles/owid-covid-data.json'),
   d3.csv("../csvFiles/owid-covid-data.csv") ,
   d3.json('../csvFiles/vaccinations.json')
  ]).then(
  
  
  
  function (initialize) {
  
  
  
      let dataGeo = initialize[0]
  
     
     let dataCovid = initialize[2]
  
    let  dataCovid_2  = initialize[1]

    let  vacc  = initialize[3]


  
     let  selected_countries  = []
     let  selected_countries_data = []
  
     GLOBAL_DATE = new Date("2021-03-01")
     GLOBAL_SCLAR_CIRCLE = 'population'
     gLOBAL_SCLAR_MAP = 'continent'

     GLOBAL_COUNTRY = 'IND'
  
    
        const mapCircle_dropDown = ["population", "new_cases", "total_cases"]
    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
      .data(mapCircle_dropDown)
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) {  return d; })
       // corresponding value returned by the button
      d3.select("#selectButton").on("change", function(event,d) {
              // run the updateChart function with this selected option
         GLOBAL_SCLAR_CIRCLE= d3.select(this).property("value")
       
    })
    const map_dropDown = ["new_deaths_per_million", "continent", "total_cases_per_million"]

  
    // add the options to the button
    d3.select("#selectButton2")
      .selectAll('myOptions')
      .data(map_dropDown)
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

      d3.select("#selectButton2") .on("change", function(event,d) {
        // run the updateChart function with this selected option
        gLOBAL_SCLAR_MAP= d3.select(this).property("value")
      
})
     Continents_colors = [{
      "name": "Africa",
      "color": "#f8b195"},
      {"name": "Asia",
      "color": "#f67280"},
      {"name": "Europe",
      "color": "#c06c84"},
      {"name": "North America",
      "color": "#6c5b7b"},
      {"name": "South America",
      "color": "#355c7d "},
      {"name": "Oceania",
      "color": "#99b898 "}]
  
      function getColor(d,f=0) {
  
          if(f==0)
          {
          for (let  i = 0; i < Continents_colors.length; i++) {
              if (d.properties.continent == Continents_colors[i].name) {
                  return Continents_colors[i].color;
              }
          }
      }
      else
      {
          for (let  i = 0; i < Continents_colors.length; i++) {
  
              dataGeo.features.forEach(function(di) {
                  if (di.properties.iso_a3 == d.iso_code) {
                     temp_cont= di.properties.continent;
                    
                     // return Continents_colors[i].color;
                    
                  }
              })
            
          }
  
          for (let  i = 0; i < Continents_colors.length; i++) {
              if (temp_cont == Continents_colors[i].name) {
  
                
                  return Continents_colors[i].color;
              }
          }
      }
  
          
      }
  
DATA_ISO = d3.group(dataCovid, d => d.iso_code );

DATA_DATE = d3.group(dataCovid, d => d.date );

 function fetch_data(iso,data_type,date = GLOBAL_DATE)
 {
   
 data1=[];

   if(data_type=="country")
    {
     
      
    data = [DATA_ISO.get(iso)]
      if(typeof data[0] != "undefined" &&  data[0].length>0){
        data1=  data[0].filter(function(d) { return d.date == date.toISOString().substring(0, 10); }) ;}
  
    //data.filter(function(d) { return d.date == date.toISOString().substring(0, 10); });
      //  data = dataCovid.filter(function(d) { return d.iso_code == iso && d.date == date.toISOString().substring(0, 10); });
   
    }

    else if(data_type=="date")
    {
        data1 = d3.group(dataCovid, d => d.date );
    }


    return data1

 }     


 function scalr_circle_update (iso)
 {
   radius = fetch_data(iso,"country",GLOBAL_DATE);
  //  fetch_data(iso,"country",GLOBAL_DATE)
  //  radius = 0
    if(radius.length>0)
    {
      if(GLOBAL_SCLAR_CIRCLE=="population")
      {
          return   (radius[0][GLOBAL_SCLAR_CIRCLE] / 100000000)
      }

      else if(GLOBAL_SCLAR_CIRCLE=="new_cases")
      {
          return   (radius[0][GLOBAL_SCLAR_CIRCLE] / 10000)
      }

      else if(GLOBAL_SCLAR_CIRCLE=="total_cases")
      {
        console.log(radius[0][GLOBAL_SCLAR_CIRCLE])
          return   (radius[0][GLOBAL_SCLAR_CIRCLE] /1000000 )
      }


      
    }
    else { return 0}

 }

  
   
  
  
  let  g = svg1.append("g");
  
  let zoom_map = d3.zoom().on("zoom", handleZoom);
  
              function handleZoom(e) {
                   d3.select("svg g").attr("transform", e.transform);
  
              }
  
              function initZoom() {
                  d3.select("svg").call(zoom_map);
              }
  
      // Draw the map
      countriesGroup1 =  g.append("g")
          .selectAll("path")
          .data(dataGeo.features)
          .join("path")
              .attr("fill", function(d) {
                  return getColor(d)
                  //Continents_colors.get(d.properties.continent);
              })
              .attr("opacity", 0.8)
              .attr("stroke", "black")
              .attr("stroke-width", 0.5)
              .attr("d", path)
              .style("stroke", "#ffffff")
              .style("stroke-width", 2)
              .attr("class", "country")
              .attr("id", function(d, i) {  return d.properties.iso_a3 ;})
              
              
         g.selectAll('circle')
          .data(dataGeo.features)
          .enter()
          .append('circle')
          .attr('cx', function(d) {
              return path.centroid(d)[0];
          })
          .attr('cy', function(d) {
            return path.centroid(d)[1];
          })
          .attr('r', function(d,i) {
              temp = d.properties.iso_a3
    
           return scalr_circle_update(temp)
          // d.properties.pop_est/30000000;
  
          
  
          })
          .attr('fill', '#ffffff')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', '10px')
          .attr('class', 'circle_sclr')
          .attr('opacity', 0.8)
          .attr('pointer-events', 'none');
  
          // .attr('id', function(d) {
          //     return d.properties.iso_a3;
          // })
  
  
         
             // initZoom();
  
        
  
  
  
  
    countriesGroup1.on("mouseover", function(event, d) {
      
      d3.select(this).style("fill", "#ff0000")
      
      d3.select('#circle'+d.properties.iso_a3).attr("fill", "#ff0000")
  
   
      d3.select('body').select("#Country Name").text(""+d.properties.name_long);
      d3.select("#Country ISO").text(d.properties.iso_a3);
      d3.select("#Population ").text(d.properties.population);
   
  
   
  })
  .on("mouseout", function(event,d) {
     d3.select(this).style("fill", getColor(d))
  
     d3.select('#circle'+d.properties.iso_a3).attr("fill", getColor(d))
    // .attr("r", function(d) { return (d.iso_code.slice(0, 4)==="OWID"|| d.location ==="" ? 0:  (d.new_cases_per_million / d3.max(data, function(d) { return + d.new_cases_per_million }) ) ) } )
    //.attr("r", function(d) { return (d.iso_code.slice(0, 4)==="OWID"|| d.location ==="" ? 0:  (d.new_cases_per_million / d3.max(data, function(d) { return + d.new_cases_per_million }) ) * 40) } )
             
     
  })
  .on("click", function(event, d) {
     d3.select(this).style("fill", "#0555ff");

   
  
     d3.select("#Country Name").text('yes');
     d3.select("#Country ISO").text(d.properties.iso_a3);
     d3.select("#Population ").text(d.properties.population);
  
     GLOBAL_COUNTRY = d.properties.iso_a3;

    //   d3.select("#Cases").text(date (nRadiusvalue2).toISOString().substring(0, 10));
    //   d3.select("#Vaccines ").text(date (nRadiusvalue2).toISOString().substring(0, 10));
    //  // d3.select("#date").text(date (nRadiusvalue2).toISOString().substring(0, 10));
      
  
    //  console.log(dataCovid.filter(element => element.iso_code === event.target.attributes.id.value))
    //select clicked country and show data
  
  
   
  // if (selected_countries.includes(event.target.attributes.id.value) === false)
  // {
  //   selected_countries.push(event.target.attributes.id.value);
  
  //   //  selected_countries_data.push({'iso':event.target.attributes.id.value,'data':GetData(event.target.attributes.id.value)})
  
  
  //   selected_countries_data = selected_countries_data.concat(GetData(event.target.attributes.id.value))
  
  //   mutliline_Graph(selected_countries_data)
  // }
  
  
    update_Chart(event.target.attributes.id.value)

  //.find(GLOBAL_DATE.toISOString().substring(0, 10)))

   bar_graph (event.target.attributes.id.value)
  })
  
  
  // const brush = d3.brush()
  //       .on("start brush end", brushed);
  
  // svg1
  //     .call(brush);
  
  
      function brushed(selection) {
     console.log(selection.selection)
  
      console.log(  projection.invert(selection.selection[0]))
      
    }
    // Function that is triggered when brushing is performed
  
      
  function GetData(iso)
  {
   filter_data_by_country = dataCovid.filter(element => element.iso_code === iso  )
  
  
   let  keys_to_keep = ['date', 'total_cases','iso_code']
  
  let  data_arr = filter_data_by_country.map(e => {
    let  obj = {};
    keys_to_keep.forEach(k => obj[k] = e[k])
    return obj;
  });  // source  :https://stackoverflow.com/questions/66250623/subset-array-of-object-based-on-keys-from-another-arraynot-static-and-then-fil
  
  
   return data_arr
  }
  
 
  
  
  
  let  parseDate = d3.timeParse("%Y-%m-%d");
  
  data_arr = GetData('AUS')
  
  ///////////////////////////////////////////////////////////////////////////////
  
  const sumstat = d3.group(dataCovid, d => d.date );

  
  Max = d3.max(dataCovid, function(d) { return  d.date;} );
  Min = d3.min(dataCovid, function(d) { return  d.date;} );
  
  //console.log("yess "+Max +"  "+Min)
  // console.log(sumstat.get('2020-02-24'))
  
  d3.select("#nRadius2").on("input", function() {
    update2(+this.value);
  });
  
  date = d3.interpolateDate(new Date(Min), new Date(Max))
  
  
  
  
  function update2(nRadiusvalue2) {
  
      data = sumstat.get(date (nRadiusvalue2).toISOString().substring(0, 10))

      d3.select("#date").text(date (nRadiusvalue2).toISOString().substring(0, 10));

  
      GLOBAL_DATE = date (nRadiusvalue2)
      mutliline_Graph(data);
    
      bar_graph(GLOBAL_COUNTRY)
  
  // console.log(sumstat.get(date(nRadiusvalue2).toISOString().substring(0, 10)))
  
  }
  
  
  let  margin = {top: 10, right: 30, bottom: 30, left: 60},
      width = w - margin.left - margin.right,
      height = h/2 - margin.top - margin.bottom;
  
  
  
  
  let  svg_4 = d3.select("#my_dataviz2")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            `translate(${margin.left}, ${margin.top})`);
  
            svg_4.append("g")
        .attr("transform", `translate(0, ${height})`)
        .attr("class", "xaxis")
  
        svg_4.append("g")
    .attr("class", "yaxis")

   temp =  sumstat.get(date (0.5).toISOString().substring(0, 10))
 
iso_arr =temp.map(a => a.iso_code)
        
  function mutliline_Graph (data)
  {
    
  

    //console.log(d3.min(data, function (d) {return +d.total_cases;}) + "  "+ )

if(gLOBAL_SCLAR_MAP != 'continent')
{
  

  Colour_arr = d3.scaleLinear()
  .domain([d3.min(data, function (d) {return +d.total_cases;}), 
   d3.max(data, function (d) {return d.total_cases;})])
  .range(['red', 'blue']);    // as asked in the question, gets all values from red to blue


//console.log(Colour_arr(d3.max(data, function (d) {return +d.gLOBAL_SCLAR_MAP;})))
  iso_arr.forEach(function(d) {
    
   
    if(typeof +1 != undefined)
    {
      d3.selectAll('#'+d).attr("fill", Colour_arr(data.find(element => element.iso_code === d).total_cases))
    }
   
    
  })

  
      
      

}


      let  x_2 = d3.scaleLinear()
      .domain([0,d3.max(data, function(d) {  return +d.gdp_per_capita })])
      .range([ 0, width ]);
  
     svg_4.selectAll('.xaxis').exit().remove() 
  
    xAxis_2 = d3.selectAll(".xaxis")
        .call(d3.axisBottom(x_2));
  
    svg_4.selectAll('.yaxis').exit().remove() 
  
    // // Add Y axis
    y_2 = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return + d.total_cases_per_million+10000; })])
      .range([ height, 0 ]);
  
    yAxis_2 = d3.selectAll('.yaxis')
    .transition()
        .call(d3.axisLeft(y_2));
  
  
        // insert circles for each data point\
        svg_4.selectAll("circle").remove();
  
       svg_4.selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
            .attr("cx", function(d) { return x_2(d.gdp_per_capita) })
          .attr("cy", function(d) { return y_2(d.total_cases_per_million) })
          .attr("r", function(d) { return (d.iso_code.slice(0, 4)==="OWID"|| d.location ==="" ? 0:  (d.new_cases_per_million / d3.max(data, function(d) { return + d.new_cases_per_million }) ) * 40) } )
          .attr("class", "circle")
          .attr('id', function(d) { return "circle"+d.iso_code })
          .attr("fill",function(d) { return getColor(d,3) }  )
          .attr("opacity", 0.8)
          .attr("stroke", "#69b3a2")
          .attr("stroke-width", "2px")
  
          .on("mouseover", function(event, d) {
              d3.select(this).attr("fill", "#ff0000")
              d3.select(this).attr("r", d.new_cases_per_million / d3.max(data, function(d) { return + d.new_cases_per_million }) * 40)
              d3.select(this).attr("stroke", "#ff0000")
              d3.select(this).attr("stroke-width", "15px")
              d3.select("#text").text(d.iso_code+"  "+d.location)
              
              d3.selectAll('#'+d.iso_code).attr("fill", "orange")
  
  
          })
          .on("mouseout", function(event, d) {
              d3.select(this).attr("fill",function(d,i) { return getColor(d,3) }  )
              //.attr("r", function(d) { return (d.population /10000000) } )
              .attr("r", function(d) { return (d.iso_code.slice(0, 4)==="OWID"|| d.location ==="" ? 0:  (d.new_cases_per_million / d3.max(data, function(d) { return + d.new_cases_per_million }) ) * 40) } )
                     d3.select(this).attr("stroke", "#69b3a2")
              d3.select(this).attr("stroke-width", "2px")
              d3.select("#text").text(d.iso_code)
       
          //  d3.select('#circle'+d.properties.iso_a3).style("fill", getColor(d))
     
          d3.selectAll('#'+d.iso_code) .attr("fill",function(d,i) { return getColor(d,3) }  )
          })
  
          .on("click", function(event,d) {
              d3.select(this).attr("fill", "#ff0000")
              d3.select(this).attr("r", 10)
              d3.select(this).attr("stroke", "#ff0000")
              d3.select(this).attr("stroke-width", "5px")
              d3.select("#text").text(d.iso_code)
  
  
            
             
          })
          .transition()
          .attr("cx", function(d) { return x_2(d.gdp_per_capita) })
          .attr("cy", function(d) { return y_2(d.total_cases_per_million) })
  
  
  if(GLOBAL_SCLAR_CIRCLE != 'population')
  {
    g.selectAll('.circle_sclr').remove();
           g.selectAll('circle')
           .data(dataGeo.features)
           .enter()
           .append('circle')
           .attr('cx', function(d) {
               return path.centroid(d)[0];
           })
           .attr('cy', function(d) {
             return path.centroid(d)[1];
           })
           .attr('r', function(d,i) {
             
     
            return scalr_circle_update( d.properties.iso_a3)
           // d.properties.pop_est/30000000;
   
           
   
           })
           .attr('fill', '#ffffff')
           .attr('stroke', '#ffffff')
           .attr('stroke-width', '10px')
           .attr('class', 'circle_sclr')
           .attr('opacity', 0.8)
           .attr('pointer-events', 'none')
  }
           
   
        
  
  }
  
  
  // new svg for map
  let  svg_5 = d3.select("#my_dataviz3")
  .append("svg")
  .attr("width", width )
  .attr("height", height )


    
function enter_line_graph(iso) {
  d3.selectAll('.line').remove()
  d3.selectAll('.xAxis').remove()
  d3.selectAll('.yAxis').remove()
  
  data= GetData(iso)  // gets data
    
         
      // Add X axis --> it is a date format
      let  x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return parseDate(d.date) }))
      .range([ 0, width ]);

    xAxis = svg_5.append("g")
      .attr("transform", `translate(0, ${height})`)
      .attr('class', 'xAxis')
      .call(d3.axisBottom(x));

    // Add Y axis
    let  y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.total_cases; })])
      .range([ height, 0 ]);
    yAxis = svg_5.append("g")
    .attr('class', 'yAxis')
      .call(d3.axisLeft(y));

    // Add a clipPath: everything out of this area won't be drawn.
    let  clip = svg_5.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);

    // Add brushing
    let  brush = d3.brushX()                   // Add the brush feature using the d3.brush function
        .extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

    // Create the line variable: where both the line and the brush take place
    let  line = svg_5.append('g')
      .attr("clip-path", "url(#clip)")
  

    // Add the line
    line
    .append("path")
      .datum(data)
      .attr("class", "line")  // I add the class line to be able to modify this line later on.
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(parseDate(d.date)) })
        .y(function(d) { return y(d.total_cases) })
        )

    // Add the brushing
    line
      .append("g")
        .attr("class", "brush")
        .call(brush);

    // A function that set idleTimeOut to null
    let idleTimeout
    function idled() { idleTimeout = null; }

    // A function that update the chart for given boundaries
    function updateChart(event,d) {
   

      // What are the selected boundaries?
      extent = event.selection

      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if(!extent){
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        x.domain([ 4,8])
      }else{
        console.log(x.invert(extent[0]))
        x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
        line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
      }

      // Update axis and line position
      svg_5.selectAll(".xAxis").transition().duration(1000).call(d3.axisBottom(x))
      line
          .select('.line')
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(parseDate (d.date)) })
            .y(function(d) { return y(d.total_cases) })
          )
    }

    // If user double click, reinitialize the chart
    svg_5.on("dblclick",function(){
      x.domain(d3.extent(data, function(d) { return parseDate(d.date) }))
      svg_5.selectAll(".xAxis").transition().call(d3.axisBottom(x))
      line
        .select('.line')
        .transition()
        .attr("d", d3.line()
          .x(function(d) { return x(parseDate(d.date)) })
          .y(function(d) { return y(d.total_cases) })
      )
    });

  }

 // enter_line_graph("IND")

function update_Chart(iso)
{

  
      let  brush1 = d3.brushX()                   // Add the brush feature using the d3.brush function
        .extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart1)               // Each time the brush selection changes, trigger the 'updateChart' function

 data= GetData(iso)
  
      let  clip1 = svg_5.append("defs").append("svg:clipPath")
        .attr("id", "clip1")
        .append("svg:rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);
      
      // Add X axis --> it is a date format
      let  x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return parseDate(d.date) }))
      .range([ 0, width ]);
    xAxis = svg_5.selectAll(".xAxis")
        .transition()
        .duration(3000)
      .attr("transform", `translate(0, ${height})`)
      .transition()
      .call(d3.axisBottom(x));

    // Add Y axis
     y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.total_cases; })])
      .range([ height, 0 ]);
    yAxis = svg_5.selectAll(".yAxis")
        .transition()
        .duration(3000)
      .call(d3.axisLeft(y));

   
    // Create the line variable: where both the line and the brush take place
    let  line2 = d3.selectAll(".line")
    .attr("clip-path", "url(#clip1)")
    .datum(data)

    // Add the line
    line2
    .enter()
    .append("path")
      .attr("class", "line")  // I add the class line to be able to modify this line later on.
      .attr("fill", "none")
      .merge(line2)
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .transition()
      .duration(3000)
      .attr("d", d3.line()
        .x(function(d) { return x(parseDate(d.date)) })
        .y(function(d) { return y(d.total_cases) })
        )

    // Add the brushing
    line2
         .call(brush1);

    // A function that set idleTimeOut to null
    let idleTimeout
    function idled() { idleTimeout = null; }

    // A function that update the chart for given boundaries
    function updateChart1(event,d) {
      console.log("22222")

      // What are the selected boundaries?
      extent = event.selection

      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if(!extent){
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        x.domain([ 4,8])
      }else{
        x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
        line2.select(".brush1").call(brush1.move, null) // This remove the grey brush area as soon as the selection has been done
      }

      // Update axis and line position
      svg_5.selectAll(".xAxis").transition().duration(1000).call(d3.axisBottom(x))
      svg_5
          .selectAll('.line')
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(parseDate (d.date)) })
            .y(function(d) { return y(d.total_cases) })
          )
    }

    // If user double click, reinitialize the chart
    svg_5.on("dblclick",function(){
      x.domain(d3.extent(data, function(d) { return parseDate(d.date) }))
      svg_5.selectAll(".xAxis").transition().call(d3.axisBottom(x))
      svg_5
        .selectAll('.line')
        .transition()
        .attr("d", d3.line()
          .x(function(d) { return x(parseDate(d.date)) })
          .y(function(d) { return y(d.total_cases) })
      )
    });
}


















var svg_bar = d3.select("#please1");
var margin_bar = 200;
var width_bar = svg_bar.attr("width") - margin_bar;
var height_bar = svg_bar.attr("height") - margin_bar;

svg_bar.append("text")
 .attr("transform", "translate(100,0)")
 .attr("x", 50)
 .attr("y", 50)
 .attr("font-size", "24px")
 .text("Stock Price (hover over to show values)")

var x_scale = d3.scaleBand().range([0, width_bar]).padding(0.4);
var y_scale = d3.scaleLinear().range([height_bar, 0]);
var g_1 = svg_bar.append("g")
            .attr("transform", "translate(" + 100 + "," + 100 + ")");



function bar_graph (iso) {
  teeemp= vacc.find(element => element.iso_code === iso).data.find(element => element.date === GLOBAL_DATE.toISOString().substring(0, 10))
 // a = teeemp.map(function(d){ return {new_cases:d.new_cases}})
 a = (({ people_vaccinated,people_fully_vaccinated }) => ({ people_vaccinated,people_fully_vaccinated }))(teeemp);



 twttw = d3.group(dataCovid_2[iso].data, d => d.date )
  
 b =twttw.get(GLOBAL_DATE.toISOString().substring(0, 10))[0]



 data = [{name:'new_cases', value : b.new_cases}
 //,{name:'new_deaths', value : b.new_deaths}]
//,{name:'people_vaccinated', value : a.people_fully_vaccinated},{name:'people_fully_vaccinated', value : a.people_fully_vaccinated}
,{name:'new_vaccinations',value :a.new_vaccinations}]

 console.log(data )

//  data = {...a,...c}



Colour_arr = d3.scaleLinear()
                .domain([0, 1000])
                .range(['blue', 'red']);    // as asked in the question, gets all values from red to blue

 x_scale.domain( data.map(function(d) { return d.name; }));
 y_scale.domain([0, d3.max(data, function(d) { return d.value; })]);


 g_1.selectAll('.barx').remove()
 g_1.append("g")
 .attr("transform", "translate(0," + height_bar + ")")
 .attr('class','barx')
 .call(d3.axisBottom(x_scale))
 .append("text")
 .attr("y", height_bar - 250)
 .attr("x", width_bar - 100)
 .attr("text-anchor", "end")
 .attr("stroke", "black")
 .text("Year");

 g_1.selectAll('.bary').remove()
 g_1.append("g")
 .attr('class','bary')
 .call(d3.axisLeft(y_scale).tickFormat(function(d){
 return  + d;
 }).ticks(10))

 .append("text")
 .attr("transform", "rotate(-90)")
 .attr("y", 6)
 .attr("dy", "-5.1em")
 .attr("text-anchor", "end")
 .attr("stroke", "black")
 .text("Stock Price");



 g_1.selectAll(".bar")
 .data(data)
 .enter().append("rect")
.attr('class','bar')
 .on("mouseover", onMouseOver) //Add listener for the mouseover event
 .on("mouseout", onMouseOut) //Add listener for the mouseout event
 .attr("x", function(d,i) { return x_scale(d.name); })
 .attr("y", function(d) { return y_scale (d.value); })
 .attr("width", x_scale.bandwidth())
 .transition()
 .ease(d3.easeLinear)
 .duration(400)
 .delay(function (d, i) {
 return i * 50;
 })
 .attr("height", function(d) { return height_bar - y_scale(d.value); })
 .attr('fill',function(d,i){ return 'blue'}); // get the value from colur_arr and assign it to the fill


 g_1.selectAll(".bar").exit().remove()
 
}

function onMouseOver(d,i) {
    tempx = 0 // to get value of x position
    tempy =0 // to get value of y position
   
    d3.select(this)
    .transition() // adds animation
    .duration(200)
    .attr('width', x_scale.bandwidth() + 5)
    .attr("y", function(d) {tempx =  x_scale(d.year) ; return y_scale(d.value) - 10; })
    .attr("height", function(d) { tempy = y_scale(d.value) ; return height_bar - y_scale(d.value) + 10; })
}

    //mouseout event handler function
    
function onMouseOut(d,i) {
    // use the text label class to remove label on mouseout

    }


function indexOfDate(dataSet,value1) {
for (var i=0; i<dataSet.length; i++) {
if (dataSet[i].value === value1) return i;
}  
return -1;
}     
  
  
function GetData_bar(arr)
{
 

 let  keys_to_keep = ['new_cases', 'new_deaths','people_fully_vaccinated','total_vaccinations']

let  data_arr = arr.map(e => {
  let  obj = {};
  keys_to_keep.forEach(k => obj[k] = e[k])
  return obj;
});  // source  :https://stackoverflow.com/questions/66250623/subset-array-of-object-based-on-keys-from-another-arraynot-static-and-then-fil


 return data_arr
}
  
  
  })
  
  
  