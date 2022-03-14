
  console.log('d3.version:', d3.version);
  //get window size
  var w = window.innerWidth ;
  var h = window.innerHeight ;
  
  var w2 = window.innerWidth ;
  var h2 = window.innerHeight ;
  
  
    //create 5 svg elements
  
      
  
     
      
  
      var svg3 = d3.select("body")
      .select("#svg12").append("svg")
      .attr("id", "svg3")
      .style("border", "3px solid black")
      .attr("class", "box2");
  
  
  
      var projection = d3
      .geoEquirectangular()
      .center([0, 0]) // set centre to further North
     .scale(223) // scale to fit group width
     .translate([w/2,h/2]) // ensure centred in group
      // .scale(150)
      // .translate([w, h-190]);
  
  // A path generator
  var path = d3.geoPath()
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
  
  
  
  
  
  var svg1 = d3.select("body")
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
   d3.csv("../csvFiles/owid-covid-data.csv") 
  ]).then(
  
  
  
  function (initialize) {
  
  
  
      let dataGeo = initialize[0]
  
     
     let dataCovid = initialize[1]
  
  
  
     var selected_countries  = []
     var selected_countries_data = []
  
     GLOBAL_DATE = new Date("2021-03-01")
     GLOBAL_SCLAR_CIRCLE = 'population'
     GLOBAL_SCLAR_MAP = 'continent'
  
    
        const mapCircle_dropDown = ["population", "Vaccinations", "new_cases_per_million"]
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
    const map_dropDown = ["new_cases_per_million", "Continent", "total_cases_per_million"]

  
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
        GLOBAL_SCLAR_MAP= d3.select(this).property("value")
      
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
          for (var i = 0; i < Continents_colors.length; i++) {
              if (d.properties.continent == Continents_colors[i].name) {
                  return Continents_colors[i].color;
              }
          }
      }
      else
      {
          for (var i = 0; i < Continents_colors.length; i++) {
  
              dataGeo.features.forEach(function(di) {
                  if (di.properties.iso_a3 == d.iso_code) {
                     temp_cont= di.properties.continent;
                    
                     // return Continents_colors[i].color;
                    
                  }
              })
            
          }
  
          for (var i = 0; i < Continents_colors.length; i++) {
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

      else if(GLOBAL_SCLAR_CIRCLE=="new_cases_per_million")
      {
          return   (radius[0][GLOBAL_SCLAR_CIRCLE] / 100)
      }


      
    }
    else { return 0}

 }

  
     var color = d3.scaleLinear()
      .domain([0, Continents_colors.length - 1])
      .range(["yellow", "green"]);
  
  console.log(Continents_colors[0].color)
  var g = svg1.append("g");
  
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
  
         text =    svg3.append("text")
      .attr("x", 200)
      .attr("y", 200)
      .attr("text-anchor", "middle")
      .style("font-size", "22px")
      .style("font-family", "sans-serif")
      .style("fill", "black")
      .text("hello")
      .attr("id", "text");
  
  
  
  
    countriesGroup1.on("mouseover", function(event, d) {
      
      d3.select(this).style("fill", "#ff0000")
      
      d3.select('#circle'+d.properties.iso_a3).style("fill", "#ff0000").attr("r",50)
  
      text.text(d.properties.iso_a3
       +'\n'+d.properties.name_long)
   
  
   
  })
  .on("mouseout", function(event,d) {
     d3.select(this).style("fill", getColor(d))
  
     d3.select('#circle'+d.properties.iso_a3).style("fill", getColor(d)).attr("r", function(d) { return (d.iso_code.slice(0, 4)==="OWID"|| d.location ==="" ? 0:  (d.new_cases_per_million / d3.max(data, function(d) { return + d.new_cases_per_million }) ) * 40) } )
             
     
  })
  .on("click", function(event, d) {
     d3.select(this).style("fill", "#0555ff");
  
    
  
      text.attr("x", path.centroid(d)[0])
      .attr("y", path.centroid(d)[1])
  
    //  console.log(dataCovid.filter(element => element.iso_code === event.target.attributes.id.value))
    //select clicked country and show data
  
  
   
  if (selected_countries.includes(event.target.attributes.id.value) === false)
  {
    selected_countries.push(event.target.attributes.id.value);
  
    //  selected_countries_data.push({'iso':event.target.attributes.id.value,'data':GetData(event.target.attributes.id.value)})
  
  
    selected_countries_data = selected_countries_data.concat(GetData(event.target.attributes.id.value))
  
    mutliline_Graph(selected_countries_data)
  }
  
  
    update_Chart(event.target.attributes.id.value)
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
  
  
   var keys_to_keep = ['date', 'total_cases','iso_code']
  
  var data_arr = filter_data_by_country.map(e => {
    var obj = {};
    keys_to_keep.forEach(k => obj[k] = e[k])
    return obj;
  });  // source  :https://stackoverflow.com/questions/66250623/subset-array-of-object-based-on-keys-from-another-arraynot-static-and-then-fil
  
  
   return data_arr
  }
  
  
  
  
  var parseDate = d3.timeParse("%Y-%m-%d");
  
  data_arr = GetData('AUS')
  
  ///////////////////////////////////////////////////////////////////////////////
  
  const sumstat = d3.group(dataCovid, d => d.date );
  console.log(sumstat.get)
  
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
  
      GLOBAL_DATE = date (nRadiusvalue2)
      mutliline_Graph(data);
  
  
  // console.log(sumstat.get(date(nRadiusvalue2).toISOString().substring(0, 10)))
  
  }
  
  
  var margin = {top: 10, right: 30, bottom: 30, left: 60},
      width = w - margin.left - margin.right,
      height = h/2 - margin.top - margin.bottom;
  
  
  
  
  var svg_4 = d3.select("#my_dataviz2")
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


        
  function mutliline_Graph (data)
  {
  
      var x_2 = d3.scaleLinear()
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
  
      var circles = svg_4.selectAll("circle")
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
              d3.select(this).attr("r", d.new_cases_per_million +10)
              d3.select(this).attr("stroke", "#ff0000")
              d3.select(this).attr("stroke-width", "15px")
              d3.select("#text").text(d.iso_code+"  "+d.location)
              
              d3.select('#'+d.iso_code).attr("fill", "orange")
  
  
          })
          .on("mouseout", function(event, d) {
              d3.select(this).attr("fill",function(d,i) { return getColor(d,3) }  )
              //.attr("r", function(d) { return (d.population /10000000) } )
              .attr("r", function(d) { return (d.iso_code.slice(0, 4)==="OWID"|| d.location ==="" ? 0:  (d.new_cases_per_million / d3.max(data, function(d) { return + d.new_cases_per_million }) ) * 40) } )
                     d3.select(this).attr("stroke", "#69b3a2")
              d3.select(this).attr("stroke-width", "2px")
              d3.select("#text").text(d.iso_code)
       
          //  d3.select('#circle'+d.properties.iso_a3).style("fill", getColor(d))
     
            svg1.selectAll('#'+d.iso_code) .attr("fill",function(d,i) { return getColor(d,3) }  )
          })
  
          .on("click", function(event,d) {
              d3.select(this).attr("fill", "#ff0000")
              d3.select(this).attr("r", 10)
              d3.select(this).attr("stroke", "#ff0000")
              d3.select(this).attr("stroke-width", "5px")
              d3.select("#text").text(d.iso_code)
  
  
            
             
          })
          .transition()
          .duration(1000)
          .attr("cx", function(d) { return x_2(d.gdp_per_capita) })
          .attr("cy", function(d) { return y_2(d.total_cases_per_million) })
  
  
  
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
  
  }
  
  
  
  
  function update_all (date)
  {
  
    
  }
  
  
  })
  
  
  