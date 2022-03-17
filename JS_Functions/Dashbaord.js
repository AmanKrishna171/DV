
  console.log('d3.version:', d3.version);
  //get window size
  let  w = window.innerWidth ;
  let  h = window.innerHeight ;
  
  let  w2 = window.innerWidth ;
  let  h2 = window.innerHeight ;
    
  // the code below is for making the world map

  let  projection = d3
      .geoEquirectangular()
      .center([0, 0]) // set centre to further North
     .scale(500) // scale to fit group width
     .translate([w/2,h/2]) // ensure centred in group

  
  // A path generator
  let  path = d3.geoPath()
      .projection(projection)
  
// this function is used to zoom on the map
//source = https://bl.ocks.org/d3noob/7b7e98331f440139dff50f4a58044677
  function zoomed() {
     t = d3
        .event
        .transform
     ;
     countriesGroup.attr(
        "transform","translate(" + [t.x, t.y] + ")scale(" + t.k + ")"
     );
  }
  
  
  
  
 // svg used ofr map 
  
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
    d3.json('../csvFiles/owid-covid-data.json'), // covid data json
    d3.csv("../csvFiles/owid-covid-data.csv") , // covid data csv
   d3.json('../csvFiles/vaccinations.json') // vaccines data json
  ]).then(
  
  
  
  function (initialize) {
  
  
    // local copy of the data sets
  
    let dataGeo = initialize[0]
    let dataCovid = initialize[2]
    let  dataCovid_2  = initialize[1]
    let  vacc  = initialize[3]


  
     let  selected_countries  = [] // used to hight map 

  
     GLOBAL_DATE = new Date("2021-03-01") // date set up the slider
     GLOBAL_SCLAR_CIRCLE = 'population' // dropdown selection 
     gLOBAL_SCLAR_MAP = 'continent'  // dropdown selection 

     GLOBAL_COUNTRY = 'IND' // map click selection 
  
    
     // drop down to chnage colour of the map depending on data
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
         GLOBAL_SCLAR_CIRCLE= d3.select(this).property("value")
       
    })

    
    //drop down to change data being presented by circles on the map
    const map_dropDown = ["new_deaths_per_million", "continent", "total_cases_per_million"]
    // add the options to the button
    d3.select("#selectButton2")
      .selectAll('myOptions')
      .data(map_dropDown)
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

      d3.select("#selectButton2") .on("change", function(event,d) { gLOBAL_SCLAR_MAP= d3.select(this).property("value")})

     Continents_colors = [{ // colour code the continents 
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
  
      function getColor(d,f=0)
      {  // get the colour of each continent
  
          if(f==0)
          {
            for (let  i = 0; i < Continents_colors.length; i++) 
            {
                if (d.properties.continent == Continents_colors[i].name) {return Continents_colors[i].color;} }
            }

          else
        {
            for (let  i = 0; i < Continents_colors.length; i++) 
            {
    
                dataGeo.features.forEach(function(di)
                {
                    if (di.properties.iso_a3 == d.iso_code) { temp_cont= di.properties.continent;   }
                })
              
            }
    
            for (let  i = 0; i < Continents_colors.length; i++) 
            {
                if (temp_cont == Continents_colors[i].name) { return Continents_colors[i].color;}
            }
        }
  
          
      }
  
DATA_ISO = d3.group(dataCovid, d => d.iso_code ); // filtered data of iso's

DATA_DATE = d3.group(dataCovid, d => d.date ); // ,ap version of map to get data about all countried based on date

 function fetch_data(iso,data_type,date = GLOBAL_DATE)  // gets data of a particular country 
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


 function scalr_circle_update (iso)  // sets the data for scalr circle on the map
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
       
          return   (radius[0][GLOBAL_SCLAR_CIRCLE] /1000000 )
      }


      
    }
    else { return 0}

 }

  
   
  
  
  let  g = svg1.append("g");


  //source :https://bl.ocks.org/d3noob/7b7e98331f440139dff50f4a58044677 

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
              .attr("fill", function(d) { return getColor(d) })
              .attr("opacity", 0.8)
              .attr("stroke", "black")
              .attr("stroke-width", 0.5)
              .attr("d", path)
              .style("stroke", "#ffffff")
              .style("stroke-width", 2)
              .attr("class", "country")
              .attr("id", function(d, i) {  return d.properties.iso_a3 ;}) // give unique id to each country
              
              
         g.selectAll('circle')
          .data(dataGeo.features)
          .enter()
          .append('circle')
          .attr('cx', function(d) {return path.centroid(d)[0];})
          .attr('cy', function(d) { return path.centroid(d)[1]; })
          .attr('r', function(d,i) 
          { 
            temp = d.properties.iso_a3
            return scalr_circle_update(temp)
          })
          .attr('fill', '#ffffff')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', '10px')
          .attr('class', 'circle_sclr')
          .attr('opacity', 0.8)
          .attr('pointer-events', 'none');
  
          initZoom();
         countriesGroup1.on("mouseover", function(event, d) 
       {
          // the enable bidirectional updates 
          d3.select(this).style("fill", "#ff0000")
          d3.select('#circle'+d.properties.iso_a3).attr("fill", "#ff0000")
          d3.select('body').select("#Country Name").text(""+d.properties.name_long);
          d3.select("#Country ISO").text(d.properties.iso_a3);
          d3.select("#Population ").text(d.properties.population);
        })

        .on("mouseout", function(event,d) 
        {
          d3.select(this).style("fill", getColor(d))
          d3.select('#circle'+d.properties.iso_a3).attr("fill", getColor(d))
        })

        .on("click", function(event, d) {
          d3.select(this).style("fill", "#0555ff");
          d3.selectAll("#Cases").append('div').remove()
          d3.selectAll("#Cases").append('div').text('yes');
          d3.select("#Country ISO").text(d.properties.iso_a3);
          d3.select("#Population ").text(d.properties.population);
          GLOBAL_COUNTRY = d.properties.iso_a3;


 
  
  
        update_Chart(event.target.attributes.id.value)

        d3.select("#text_show").html(   // shows country stats on screen
            "<h3>" + 
            "Information" + 
            "</h3><p>Country: " + d.properties.name_long + "</p>" +
            "<p>ISO: " + d.properties.iso_a3 + "</p>" +
            "<p>Population: " + dataCovid_2[d.properties.iso_a3].population + "</p>"+
             "<p>Total Cases: " + dataCovid_2[d.properties.iso_a3].data[700].total_cases + "</p>" 

           )
  
        })
  
      
  function GetData(iso)  // gets data of country from iso
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
  
 
  
  
  
  let  parseDate = d3.timeParse("%Y-%m-%d");  // function to turn string date into js data object 
  
  data_arr = GetData('AUS')
  
  ///////////////////////////////////////////////////////////////////////////////
  
  const sumstat = d3.group(dataCovid, d => d.date );

  
  Max = d3.max(dataCovid, function(d) { return  d.date;} );
  Min = d3.min(dataCovid, function(d) { return  d.date;} );
  
  
  d3.select("#nRadius2").on("input", function() {update2(+this.value); });  // get info from the slider
  
  date = d3.interpolateDate(new Date(Min), new Date(Max))
  
  
  function update2(nRadiusvalue2) { // updates all the layouts using inforation from the slider

      GLOBAL_DATE = date (nRadiusvalue2)

      data = sumstat.get(date (nRadiusvalue2).toISOString().substring(0, 10))
      mutliline_Graph(data);
      d3.select("#date").text(' Current Date: '+date (nRadiusvalue2).toISOString().substring(0, 10));
     
      update_Chart(GLOBAL_COUNTRY)
  
  
  }
  

  //svg config for scatter plot
  
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

      temp =  sumstat.get(date (0.8).toISOString().substring(0, 10))  
      
      iso_arr =temp.map(a => a.iso_code)  // array with list of iso codes
              
      Colour_arr = d3.scaleLinear()
 

    function mutliline_Graph (data) // function that updates most functions with new ino from date selected
    {
      
      clustering (range = 8);

        if(gLOBAL_SCLAR_MAP != 'continent')  // runs only when drop down is selected
        {
          iso_arr.forEach(function(d) 
          {
            if(typeof data.find(element => element.iso_code === d) != 'undefined')
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


          const brush = d3.brush()
          .on("start brush end", brushed);

          svg_4.call(brush);
    
        
          svg_4.selectAll(".circle_scatter").remove();

          // draws all the scatter plots dots 
    
      scat_circle=  svg_4.selectAll(".circle_scatter")
            .data(data)
            .enter()
            .append("circle")
              .attr("cx", function(d) { return x_2(d.gdp_per_capita) })
            .attr("cy", function(d) { return y_2(d.total_cases_per_million) })
            .attr("r", function(d) { return (d.iso_code.slice(0, 4)==="OWID"|| d.location ==="" ? 0:  (d.people_fully_vaccinated)/1000000 ) } ) // filters world data
            .attr("class", "circle_scatter")
            .attr('id', function(d) { return "circle"+d.iso_code })
            .attr("fill",function(d) { return getColor(d,3) }  )
            .attr("opacity", 0.8)
            .attr("stroke", "#69b3a2")
            .attr("stroke-width", "2px")

            // code below is for bi directional 
    
            .on("mouseover", function(event, d) {
                d3.select(this).attr("fill", "#ff0000")
                d3.select(this).attr("stroke", "#ff0000")
                d3.select(this).attr("stroke-width", "15px")
                d3.select("#text").text(d.iso_code+"  "+d.location)
                
                d3.selectAll('#'+d.iso_code).attr("fill", "orange")

                d3.selectAll('#clu'+d.iso_code).attr("stroke", "red").attr("stroke-width", "10px")


              
    
    
            })
            .on("mouseout", function(event, d) {

              d3.selectAll('#clu'+d.iso_code).attr("stroke-width", "0px")

                d3.select(this).attr("fill",function(d,i) { return getColor(d,3) }  )
                .attr("r", function(d) { return (d.iso_code.slice(0, 4)==="OWID"|| d.location ==="" ? 0:  (d.people_fully_vaccinated)/1000000 ) } )
                d3.select(this).attr("stroke", "#69b3a2")
                d3.select(this).attr("stroke-width", "2px")
                d3.select("#text").text(d.iso_code)
      
      
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
    
      function brushed({selection})  // soruce : http://bl.ocks.org/feyderm/6bdbc74236c27a843db633981ad22c1b
      {

        if (selection != null) {  // only when selected

          // returns all objects to default settings
        d3.selectAll(".circle_scatter").attr("stroke", 'black');
        d3.selectAll(".pt").attr("stroke", 'black').attr('stroke-width', '3px');

         // turns all countires to default color
        selected_countries.forEach(function(d)
         {
          d3.select('#'+d) .attr("fill",function(d,i) { return getColor(d) }  );
        })

        selected_countries=[]; // resets the array

        var brush_coords =selection;

         
        selected =   scat_circle.filter(function (){

        var cx = d3.select(this).attr("cx"),
            cy = d3.select(this).attr("cy");

         return isBrushed(brush_coords, cx, cy);
       })
                

            if(typeof selected._groups[0][0] != 'undefined')
            {
              selected._groups[0].forEach(function(d) {

                selected_countries.push(d.id.slice(6, ))
                d3.select('#'+d.id).attr("stroke", 'red');
                d3.select('#'+d.id.slice(6, )).attr("fill", 'red');
                d3.select('#clu'+d.id.slice(6, )).attr("stroke", 'red').attr('stroke-width', '5px');
            
              })
          
                
            }
              
             
      }
      
    }

    function isBrushed(brush_coords, cx, cy) { // returns objects within slecetd area source : http://bl.ocks.org/feyderm/6bdbc74236c27a843db633981ad22c1b

      var x0 = brush_coords[0][0],
          x1 = brush_coords[1][0],
          y0 = brush_coords[0][1],
          y1 = brush_coords[1][1];

    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
  }

  

    if(GLOBAL_SCLAR_CIRCLE != 'population') // for different settings of scalar circle on map
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
            .attr('r', function(d,i) { return scalr_circle_update( d.properties.iso_a3) })
            .attr('fill', '#ffffff')
            .attr('stroke', '#ffffff')
            .attr('stroke-width', '10px')
            .attr('class', 'circle_sclr')
            .attr('opacity', 0.8)
            .attr('pointer-events', 'none')
    }
            
    
          
    
}
    
    
    
    let  svg_5 = d3.select("#my_dataviz3")  // svg for line graph
    .append("svg")
    .attr("width", width *0.4 )
    .attr("height", height +20)


    
function enter_line_graph(iso) {

  temp_data = d3.group(dataCovid_2[iso].data, d => d.date ) // get data of country for a given date
  date_array = Array.from(temp_data.keys()); 
  data = []

 date_array.forEach(function(d) {  // creates data array for line graph
 
   if(typeof temp_data.get(d)[0].new_cases != "undefined" && typeof temp_data.get(d)[0].people_vaccinated != "undefined") 
   {
      data.push({date : d, new_cases : temp_data.get(d)[0].new_cases, people_vaccinated : temp_data.get(d)[0].people_vaccinated })
   }
  
 
 
 })

  var size = 20
  keys1 = [ {'name' : 'new_cases', 'color' : 'red'}, {'name' : 'people_vaccinated', 'color' : 'blue'}]
  
  // for legend 
  svg_5.selectAll("mydots")
  .data(keys1)
  .enter()
  .append("rect")
    .attr("x", 100)
    .attr("y", function(d,i){ return 100 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size)
    .attr("height", size)
    .style("fill", function(d){ return d.color})


  svg_5.selectAll("mylabels")
  .data(keys1)
  .enter()
  .append("text")
    .attr("x", 100 + size*1.2)
    .attr("y", function(d,i){ return 100 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function(d){ d.color})
    .text(function(d){ return d.name})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    
         
      // Add X axis --> it is a date format
    let  x_line = d3.scaleTime()
      .domain([new Date("2020-01-01"),GLOBAL_DATE])
      .range([ 0, width * 0.4]);

    xAxis = svg_5.append("g")
      .attr("transform", `translate(50, ${height-20})`)
      .attr('class', 'xAxis')
      .call(d3.axisBottom(x_line));

    // Add Y axis
    let  y_line = d3.scaleLinear()
    
      .domain([0, d3.max(data, function(d) { return +d.new_cases; })])
      .range([ height, 0 ]);

    yAxis = svg_5.append("g")
   . attr("transform", `translate(50, -20)`)
    .attr('class', 'yAxis')
      .call(d3.axisLeft(y_line));

    // Add a clipPath: everything out of this area won't be drawn.



     

    // Add the line graphs
    svg_5
   .append('g')
    .attr('class', 'line_chart')
      .append("path")
      .datum(data)
      .attr("class", "line")  
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x_line(parseDate(d.date)) })
        .y(function(d) { return y_line(d.people_vaccinated) })
        )

        svg_5
        .append('g')
    .attr('class', 'line_chart')
 
           .append("path")
           .datum(data)
           .attr("class", "line2")  
           .attr("fill", "none")
           .attr("stroke", "red")
           .attr("stroke-width", 1.5)
           .attr("d", d3.line()
             .x(function(d) { return x_line(parseDate(d.date)) })
             .y(function(d) { return y_line(+d.new_cases) })
             )

  }

enter_line_graph("IND") // default 

function update_Chart(iso) // this is to update line chart with new data same code as above 

{
    temp_data = d3.group(dataCovid_2[iso].data, d => d.date )
  date_array = Array.from(temp_data.keys());


  data = []


  date_array.forEach(function(d) {

    if(typeof temp_data.get(d)[0].new_cases_smoothed != "undefined" && typeof temp_data.get(d)[0].new_deaths != "undefined"  && typeof d != "undefined") 
    {
      data.push({date : d, new_cases_smoothed : temp_data.get(d)[0].new_cases_smoothed, new_deaths : temp_data.get(d)[0].new_deaths })
    }
  


  })


    
    
        
        // Add X axis --> it is a date format
        let  x_line_3 = d3.scaleTime()
        .domain([d3.min(data,function(d) { return parseDate(d.date); }),GLOBAL_DATE])
        .range([ 0, 20+width * 0.4  ]);

      xAxis = svg_5.selectAll(".xAxis")
          .transition()
          .duration(300)
        .attr("transform", `translate(50, ${height-20})`)
        .transition()
        .call(d3.axisBottom(x_line_3));

      // Add Y axis
      y_line_3 = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.new_cases_smoothed; })])
        .range([ height, 0 ]);
      yAxis = svg_5.selectAll(".yAxis")

          .transition()
          .duration(300)
        .call(d3.axisLeft(y_line_3));

    
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
        .duration(300)
      
        .attr("d", d3.line()
          .x(function(d) { return (new Date("2020-01-01") <= parseDate(d.date) ? x_line_3(parseDate(d.date)): 0) })
          .y(function(d) { return y_line_3(+d.new_deaths) })
          )
          . attr("transform", `translate(50, -20)`)


          let  line3 = d3.selectAll(".line2")
          .attr("clip-path", "url(#clip1)")
          .datum(data)

          line3
          .enter()
          .append("path")
            .attr("class", "line2")  // I add the class line to be able to modify this line later on.
            .attr("fill", "none")
            .merge(line3)
            .attr("stroke", "red")
            .attr("stroke-width", 1.5)
            .transition()
            .duration(300)
            .attr("d", d3.line()
              .x(function(d) { return x_line_3(parseDate(d.date)) })
              .y(function(d) { return y_line_3(+d.new_cases_smoothed) })
              )
              . attr("transform", `translate(50, -20)`)

      

   
  }


  // the code below is for the k means clustering algorithm 

var margin1 = { top: 20, right: 0, bottom: 50, left: 120 },
svg_dx =w - 100, 
svg_dy = 800,
plot_dx = svg_dx - margin1.right - margin1.left,
plot_dy = svg_dy - margin1.top - margin1.bottom;


var x_clus = d3.scaleLinear().range([margin1.left, plot_dx]),
y_clus = d3.scaleLinear().range([plot_dy, margin1.top]);

var svg_clus = d3.select("#chart")
        .append("svg")
        .attr("width", svg_dx)
        .attr("height", svg_dy);

var hulls = svg_clus.append("g")
           .attr("id", "hulls");

var circles = svg_clus.append("g")
             .attr("id", "circles1");

 x_axis_cluster =      svg_clus
             .append("g")
             .attr("transform", `translate(0, ${plot_dy})`)

             .attr('class','xAxis_cluster')

  y_axis_cluster =      svg_clus
             .append("g")
             .attr("transform", `translate(${ margin1.left}, 0)`)
             .attr('class','yAxis_cluster')           
          
             clust_text = svg_clus.append("g")
             .attr("id", "text");
           
   let  key = Object.keys(initialize[1])


// source : http://bl.ocks.org/feyderm/75c18a9143aac50a24e392762f10d6a4
// teh code was modified to work in version 7

clustering ();
function clustering (range = 10)
{
 

var clusters = d3.range(0,range).map((n) => n.toString()); // sets the number of cluters 

// costs for each iteration
var costs = [];

hulls.selectAll(".hull")  // vizualtions of clusters 
   .data(clusters)
   .enter()
   .append("path")
   .attr("class", "hull")
   .attr("id", d => "hull_" + d);


   let d2 = initialize[1]
        
  
   clus_arr = []
   key.forEach(function(dd){
       if(typeof d3.group(d2[dd].data, d => d.date ).get(GLOBAL_DATE.toISOString().substring(0, 10))!= 'undefined' 
       && typeof d2[dd].population != 'undefined' && dd.length === 3 && dd != 'IND' &&dd != 'CHN' && dd != 'BRA' && dd != 'USA' && dd != 'TKM')
       {
           clus_arr.push({y :d3.group(d2[dd].data, d => d.date ).get(GLOBAL_DATE.toISOString().substring(0, 10))[0].new_cases 
       ,income :d2[dd].population,iso:dd , x :d2[dd].gdp_per_capita })
          
       }
   })

   

   d = clus_arr
       d.forEach(d => {  // shows the iietration of running k means 
                   d.x = +d.x;
                   d.y = +d.y;
               });
   
               setScaleDomains(d);  // sets the new scaled 
               circles.selectAll(".pt").remove(); // removes prevous cluetrs 
               plotCircles(d);  // updates  new circles 

               x_axis_cluster.call(d3.axisBottom(x_clus));
               y_axis_cluster.call(d3.axisLeft(y_clus));
              
   
               // randomly select 15 data points for initial centroids
               var initialCentroids = clusters.map(() => d[Math.round(d3.randomUniform(0, d.length)())]);
   
               assignCluster(initialCentroids);  
               addHull();// adds the  clutering vizulations called hulls
   
               costs.push(computeCost());

               var iterate = d3.interval(() => {
   
                   var c = computeCentroids()
   
                   assignCluster(c)
                   addHull();
   
                   var cost = computeCost();
   
                   // stop iterating when algorithm coverges to local minimum
                   if (cost == costs[costs.length - 1]) {
   
                       displayStats(costs);
                       iterate.stop();
                   }
   
                   costs.push(cost)
                  
               }, 500);

               function displayStats(costs) { // code to displpay the clustering algo in the works 

                var stats = svg_clus.append("g")
                               .attr("id", "stats");
              
                var formatMin = d3.format(".4");
              
                var n_iters = stats.append("text")
                                   .attr("x", 10)
                                   .attr("y", 20);
              
                n_iters.append("tspan")
                       .style("font-weight", "bold")
                       .text("Num. Iterations: ");
              
                n_iters.append("tspan")
                       .text(costs.length);
              
                var cost = stats.append("text")
                                .attr("x", 10)
                                .attr("y", 40);
              
                cost.append("tspan")
                    .style("font-weight", "bold")
                    .text("Local Minimum: ");
              
                cost.append("tspan")
                    .text(formatMin(costs[costs.length - 1]));
                   
              }
              
              function computeCentroids() {
                
                var centroids = clusters.map(cluster => {
              
                    var d = d3.selectAll(".cluster_" + cluster)
                              .data(),
                        n = d.length;
              
                    var x_sum = d3.sum(d, d => d.x),
                        y_sum = d3.sum(d, d => d.y);
              
                    return { x:(x_sum / n), y:(y_sum / n) };
              
                });
              
                return centroids;
              }
              
              function addHull() {
              
                clusters.forEach(cluster => {
              
                    // parse cluster data
                    var d_cluster = d3.selectAll(".cluster_" + cluster)
                                      .data()
                                      .map((datum) => [x_clus(datum.x), y_clus(datum.y)]);
              
                    // path given data points for cluster
                    var d_path = d3.polygonHull(d_cluster);
              
                    var color  = d3.schemePaired[+cluster];
                  
              
                    // ref: https://bl.ocks.org/mbostock/4341699
                    d3.select("#hull_" + cluster)
                      .attr("id", "hull_" + cluster)
                      .transition()
                      .duration(250)
                      .attr("d", d_path === null ? null : "M" + d_path.join("L") + "Z")
                      .attr("fill", color)
                      .style("stroke", color)
                      .attr('opacity', 0.5);
                });
              
              }
              
              function computeCost() {
              
                var dists = d3.selectAll("circle")
                              .data()
                              .map(d => d._dist);
              
                return d3.sum(dists);
              }
              
              function assignCluster(centroids) {
                
                d3.selectAll(".pt")
                  .each(function(d) {
              
                    // distances of data point from all centroids
                    var dists = computeDistances(centroids, d);
              
                    // min. distance defines cluster number 
                    var dist_min = d3.min(dists);
                    var cluster_num = dists.findIndex(dist => dist == dist_min);
                 
                 
                 
                    var color = d3.schemePaired[cluster_num];
              
                    // stash min. distance to compute cost
                    d._dist = dist_min;
              
                    // assign data point to cluster of minimum distance
                    d3.select(this)
                      .attr("fill", d3.color(color))
                      .attr("class", "pt cluster_" + cluster_num);
                });
              }
              
              function computeDistances(centroids, d_pt) {
              
                var dists = centroids.map(centroid => {
                    var dist = Math.sqrt(Math.pow(d_pt.x - centroid.x, 2) + Math.pow(d_pt.y - centroid.y, 2));
                    return dist;
                })
                return dists;
              }
              
              function setScaleDomains(d) {
              
                 x_clus.domain(
                   [0,d3.max(d, d => d.x)]);
                 y_clus.domain( [0,d3.max(d, d => d.y)+1000]);

                 
      
              }
              
              function plotCircles(d) {

            
            
              
                circles.selectAll(".pt")
                       .data(d)
                       .enter()
                       .append("g")
                       .append("circle")
                       .attr("class", "pt")
                       .attr("r", ()=>(svg_dx + svg_dy)*0.0091)
                       .attr("cx", (d) => x_clus(d.x))
                       .attr("cy", (d) => y_clus(d.y))
                       .attr('id', (d,i) => "clu" + d.iso)
                       
                       .on("mouseover", function(event,d) {
                        console.log(d.iso)
                        console.log(d.income)

                        d3.select('#'+d.iso).attr("stroke", 'red');
                        d3.select('#'+d.iso).attr("fill", 'red');
                        d3.select('#clu'+d.iso).attr("stroke", 'red').attr('stroke-width', '5px');
                        d3.select('#circle'+d.iso).attr("stroke", 'red').attr('stroke-width', '9px');
                     
                           
                       })
                       .on("mouseout",function(event,d) { // the code below is for bi directional 
                        d3.select('#circle'+d.iso).attr("stroke", 'red').attr('stroke-width', '0px');
                     
                       
                      
                        d3.select('#clu'+d.iso).attr("stroke", 'red').attr('stroke-width', '0px');
                    
                       d3.select('#'+d.iso) .attr("fill",function(d,i) { return getColor(d) }  );

                      })

                       clust_text.selectAll(".text_clu").remove();

                       clust_text.selectAll(".text_clu").data(d)
                       .enter()
                       .append("g").append('text')
                       .attr("x", (d) => x_clus(d.x))
                       .attr("y", (d) => y_clus(d.y))
                       .text(function(d) { return d.iso; })
                       .attr('class','text_clu')
                        .attr("fill", "white")
                        .attr("font-size", "10px")
                        .attr("font-family", "sans-serif")
                        .attr("text-anchor", "middle")
                        .attr("alignment-baseline", "middle")
                        .attr("font-weight", "bolder")
                        .attr("pointer-events", "none")
                


                       

              }
}



  })
  

  
  