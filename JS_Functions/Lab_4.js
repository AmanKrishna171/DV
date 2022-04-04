let  svg1 = d3.select("body")
.select("#world_map")
.append("svg")
.attr("id", "svg1")
.style("background-color", "#666a6d")
.style("border", "0px solid black")

.attr("class", "box1")
.attr("width", "100%")
.attr("height", "100%")



w= innerWidth
h= innerHeight

let  projection = d3
.geoEquirectangular()
.center([0, 0]) // set centre to further North
.scale(500) // scale to fit group width
.translate([w/2,h/2]) // ensure centred in group


// A path generator
let  path = d3.geoPath()
.projection(projection)


// Load world shape AND list of connection
Promise.all([
d3.json("https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/maps/mapdata/custom50.json"), 
d3.csv("../Lab-4 data/videos.csv"),
d3.csv("../Lab-4 data/CAvideos.csv"),


]).then(


    function (initialize) {
    
        GLOBAL_DATA = []
        GLOBAL_COUNTRY = 'US'
        GLOBAL_SCLAR_CIRCLE= 'WORLD'
        GLOBAL_DATE = '2017-12-31'
        GLOBAL_SCLAR_CIRCLE_DROPDOWN= '24'

GLOBAL_COUNTRY_SELECTED = []
        let zoom_map = d3.zoom().on("zoom", handleZoom);
  
        function handleZoom(e) {
             d3.select("svg g").attr("transform", e.transform);
      
        }
      
        function initZoom() {
            d3.select("svg").call(zoom_map);
        }

        //array of  10 pastel colours 
        let count_colors = d3.scaleOrdinal(d3.schemeCategory10);
        let countries_names =  ["CA", "DE", "FR", "GB", "IN", "JP", "KR", "MX", "RU", "US"]

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
        

            function reset_countries_list()
            {

                GLOBAL_COUNTRY_SELECTED.forEach(function(d) {
                   d3.select("#"+d).style("fill", "#fff")
                 
                })

                GLOBAL_COUNTRY_SELECTED = []

             
             
            }
    
    
            d3.select("#resetB").on("click", reset_countries_list )

            function getColor(d,f=0)
            {  // get the colour of each continent
        
                if(f==0)
                {
                 
                      return count_colors(d); 
                 
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
    
        let dataGeo = initialize[0]


        function select_Country(iso)
        {
            if(GLOBAL_COUNTRY_SELECTED.includes(iso) !== true)
            {
                GLOBAL_COUNTRY_SELECTED.push(iso)
            }

        }

        


        let  g = svg1.append("g");
        countriesGroup1 =  g.append("g")
        .selectAll("path")
        .data(dataGeo.features)
        .join("path")
            .attr("fill", function(d) { return (countries_names.includes(d.properties.iso_a2)?getColor(d):'#666a6d') })
            .attr("opacity", 0.8)
            .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            .attr("d", path)
            .style("stroke", function(d) { return (countries_names.includes(d.properties.iso_a2)?"white":'#666a6d') })
            .style("stroke-width", 2)
            .attr("class", "country")
            .attr("id", function(d, i) {  return d.properties.iso_a2 ;}) // give unique id to each country
            
       initZoom();

       countriesGroup1 .on("click", function(event, d) {
        select_Country(d.properties.iso_a2)

       d3.select(this).style("fill", "white")
        GLOBAL_COUNTRY = d.properties.iso_a2;
        bar_data_date('17.14.11')
        chord_update()



      })





       let canada_data = initialize[2]
       let canada_data_id = initialize[3]

       let vid_data = initialize[1]

    //    const Data_catergory = d3.group(vid_data, d => d.category_id );

   const Data_PublishDate = d3.group(vid_data, d => d.trending_date );

    startDate = '17.14.11'
  
function convertToDate(startDate)
{
    var year = startDate.substring(0, 2);
    var day = startDate.substring(3, 5);
    var month = startDate.substring(6, );
    return (new Date('20' +   year + '-' + month + '-' + day));
}
    
function convertToString(startDate)
{
    temp = startDate.toISOString().slice(2,10).replace(/-/g,".");

    var year = temp.substring(0, 2);
    var month = temp.substring(3, 5);
    var day = temp.substring(6, );

    return  year + '.' + day + '.' + month ;
}



let Bar_arr = []



function bar_data_date(date)
{

    Bar_arr = [{'category_id':'24','category_name':'Entertainment','category_color':'#f8b195','likes':0,'views':0,'dislikes':0,'comment_count':0,'shares':0},
{'category_id':'10','category_name':'Music','category_color':'#f67280','likes':0,'views':0,'dislikes':0,'comment_count':0,'shares':0},
{'category_id':'22','category_name':'People & Blogs','category_color':'#c06c84','likes':0,'views':0,'dislikes':0,'comment_count':0,'shares':0},
{'category_id':'23','category_name':'Comedy','category_color':'#6c5b7b','likes':0,'views':0,'dislikes':0,'comment_count':0,'shares':0},
{'category_id':'17','category_name':'Sports','category_color':'#355c7d ','likes':0,'views':0,'dislikes':0,'comment_count':0,'shares':0},
{'category_id':'1','category_name':'Film & Animation','category_color':'#99b898 ','likes':0,'views':0,'dislikes':0,'comment_count':0,'shares':0},
{'category_id':'20','category_name':'Gaming','category_color':'#c06c84','likes':0,'views':0,'dislikes':0,'comment_count':0,'shares':0},
{'category_id':'25','category_name':'News & Politics','category_color':'#6c5b7b','likes':0,'views':0,'dislikes':0,'comment_count':0,'shares':0},
{'category_id':'28','category_name':'Science & Technology','category_color':'#355c7d ','likes':0,'views':0,'dislikes':0,'comment_count':0,'shares':0},
]

   filteredData = Data_PublishDate.get(date)
   GLOBAL_DATA = Data_PublishDate.get(date)

   if (GLOBAL_SCLAR_CIRCLE !== 'WORLD')
   {
    filteredData = filteredData.filter(function(d) { return d.country === GLOBAL_SCLAR_CIRCLE; })
   }
   

filteredData.forEach(element => {
    element.category_id = element.category_id.toString()
    Bar_arr.forEach(element1 => {
        if(element.category_id === element1.category_id)
        {
            element1.likes = (+element1.likes) + (+element.likes)
            element1.views = (+element1.views) + (+element.views)
            element1.dislikes = (+element1.dislikes) + (+element.dislikes)
            element1.comment_count = (+element1.comment_count) + (+element.comment_count)

                     

           
        }
    })
    
}); 

return Bar_arr
}


const svg_chord = d3.select("#chord")
.append("svg")
  .attr("width", 640)
  .attr("height", 640)
.append("g")
  .attr("transform", "translate(330,220)")

  var colors1 = ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A"];

  var Names = [ "Entertainment",  "People & Blogs",  "Music",
  "News & Politics",  "Comedy",  "Sports",  "Film & Animation",  "Howto & Style",
  "Gaming",  "Science & Technology"]

  let colors = d3.scaleOrdinal()
  .domain(d3.range(Names.length))
  .range(colors1);

     keys1 = [ {'name' : 'Entertainment', 'color' : '#F44336'}, 
     {'name' : 'People & Blogs', 'color' : '#E91E63'}, 
     {'name' : 'Music', 'color' : '#9C27B0'},
     {'name' : 'News & Politics', 'color' : '#673AB7'}, 
      {'name' : 'Comedy', 'color' : '#3F51B5'},
       {'name' : 'Sports', 'color' : '#2196F'}, 
       {'name' : 'Film & Animation', 'color' : '#03A9F4'}, 
       {'name' : 'Howto & Style', 'color' : '#00BCD4'},
       {'name' : 'Gaming', 'color' : '#009688'}, 
       {'name' : 'Science & Technology', 'color' : '#8BC34A'}]



  // for legend code from : https://d3-graph-gallery.com/graph/custom_legend.html
  size=12
  svg_chord.selectAll("mydots")
  .data(keys1)
  .enter()
  .append("rect")
    .attr("x", 100)
    .attr("y", function(d,i){ return 220 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size)
    .attr("height", size)
    .style("fill", function(d){ return colors(d.name)})


    svg_chord.selectAll("mylabels")
  .data(keys1)
  .enter()
  .append("text")
    .attr("x", 100 + size*1.2)
    .attr("y", function(d,i){ return 220 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function(d){ d.color})
    .text(function(d){ return d.name})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")


        
    


       const data1 = [
        {group: "A", value: 5, 'color': '#ff0000'},
        {group: "B", value: 20, 'color': '#e1ff00'},
        {group: "C", value: 9, 'color': '#0000ff'},
       ];
        
       // set the dimensions and margins of the graph
       const margin = {top: 30, right: 30, bottom: 70, left: 60};
       const width = 760 - margin.left - margin.right;
       const height = 400 - margin.top - margin.bottom;
       // append the svg object to the body of the page
       var svg = d3.select('body')
       .select('#bar_chart')
        .append('div')
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
       // X axis
       
       var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(data1.map(function(d) { return d.group; }))
        .padding(0.2);
       svg.append("g")
       .attr("class", "myXaxis_bot")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
       
        
        
       // Add Y axis
       var y = d3.scaleLinear()
       
        .domain([0, 20])
        .range([ height, 0]);
       svg.append("g")
        .attr("class", "myYaxis_left")
        .call(d3.axisLeft(y));
       
       // Add Y axis
       
       GLOBAL_SCLAR_CIRCLE= 'WORLD'
       GLOBAL_DATE = '2017-12-31'

       const mapCircle_dropDown = ["WORLD", "CA", "DE", "FR", "GB", "IN", "JP", "KR", "MX", "RU", "US"]
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
            update_1(bar_data_date(convertToString(GLOBAL_DATE)),'24')
       })
           
       // A function that create / update the plot for a given variable:
       function update_1(data , cat ) {

      
  

       
        max  = d3.max(data, function(d) { return d.views; })
        min = d3.min(data, function(d) { return d.views; })
       
       
        x = d3.scaleBand()
        .range([ 0, width ])
        .domain(data.map(function(d) { return d.category_name; }))
        .padding(0.2);
       
       svg.selectAll('.myXaxis_bot') // bottom axis
           .transition()
           .duration(500)
           .call(d3.axisBottom(x))
       
  
       
       
        
       // Add Y axis
        y = d3.scaleLinear()
        .domain([0, max])
        .range([ height, 0]);
       
       svg.select(".myYaxis_left")
           .transition()
           .duration(500)
           .call(d3.axisLeft(y));
       
  
       
        var u = svg.selectAll("rect")
        .data(data)
       
        u.enter()
        .append("rect")
        .merge(u)
        .on("mouseover", onMouseOver) //Add listener for the mouseover event
        .on("mouseout", onMouseOut) //Add listener for the mouseout event
        .transition()
        .duration(1000)
        .attr("x", function(d) { return x(d.category_name); })
        .attr("y", function(d) { return y(d.views); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.views); })
        .attr("fill", function(d,i) { return d.category_color; })
        
        u.exit().transition().remove();

       }

 
  
  
  d3.select("#nRadius2").on("input", function() {update2(+this.value); });  // get info from the slider
  
  date = d3.interpolateDate( new Date('2017-11-14'),new Date('2018-06-14'))


  function update2(nRadiusvalue2) { // updates all the layouts using information from the slider

    GLOBAL_DATE = date (nRadiusvalue2)

    
 
    chord_update()
  update_1(bar_data_date(convertToString(GLOBAL_DATE)),'24')
  scatter_update()
}



       update_1(Bar_arr,'24')




       function onMouseOver(d, i) {
        tempx = 0
        tempy =0
        d3.select(this).attr('class', 'highlight');
        d3.select(this)

        .attr('width', function (d) {tempx =   x(d.category_name) ; tempy = y(d.views) ; return x.bandwidth() })
      
        svg .append("text")
        .attr('class', 'val') 
        .attr('x', function(d) {
        return  tempx +30;  // Exercise 16
        })
        .attr('y', function(d) {
        return tempy - 15 ;    // Exercise 16
        })
        .style("font", "10px times")
        .text( function(d) { return  i.views; } ) // Value of the text
        .transition()
        .style("font", "20px times") }

        //mouseout event handler function
        
    function onMouseOut(d, i) {
        // use the text label class to remove label on mouseout
        d3.select(this).attr('class', 'bar');
        d3.select(this)
        .transition() // 
        d3.selectAll('.val')
        .remove()
    }


 

  let top10Categories = {'24': "Entertainment", '22': "People & Blogs", '10': "Music",
    '25': "News & Politics", '23': "Comedy", '17': "Sports", '1': "Film & Animation", '26': "Howto & Style",
    '20': "Gaming", '28': "Science & Technology"}

    Cat_keys = Object.keys(top10Categories)
      
function chord_update()
    {
        if(typeof GLOBAL_DATA !== 'undefined' && GLOBAL_DATA.length > 0)
        {
    
        data_arr = []
        country_selected = []
        data =  d3.group(GLOBAL_DATA, d => d.country );
     
    
            // create a matrix

            GLOBAL_COUNTRY_SELECTED.forEach(function(d) {

                temp_arr_2 = []
                temp1 = data.get(d)

if(typeof temp1 !== 'undefined')              
{



                temp = d3.group(temp1, d => d.category_id )
                
        
 
                Cat_keys.forEach(function(e) {

                   
                        
                       if(typeof temp.get(e) !== 'undefined')
                       
                       {
                           
                         t=  temp.get(e).length

                         temp_arr_2.push({ 'category_id': e, 'category_name': top10Categories[e], 'count' : t})
                       }

                       else{
                        temp_arr_2.push({ 'category_id': e, 'category_name': top10Categories[e], 'count' : 0})
                       }

                })

                data_arr.push({"country" :d ,'data':temp_arr_2})
                country_selected.push(d)
            }

            });


  

            plot_mat = []
            
            temp_3 = []
                for(let j = 0 ; j< 12 ; j++)
                {
                    temp_3.push([0,0,0,0,0,0,0,0,0,0,0,0])
                }

      
  counter_2 =data_arr.length - 1
  // https://www.visualcinnamon.com/2016/06/orientation-gradient-d3-chord-diagram/
            for(let i = 0 ; i< data_arr.length ; i++)
            {
        
              
         

                    let counter = temp_3.length - 1
                  
                    data_arr[i].data.forEach(function(d) {

                       // console.log("i = " + i + " j = " + counter--)
                    
                        temp_3[counter--][i] = d.count
                  
                  
                })

                

               

              
                    counter = temp_3.length - 1
                    
                  
                    data_arr[i].data.forEach(function(d) {

                    
                       temp_3[i][counter--] = d.count
            
                  
                })

                

               
                counter_2--
                
                
            }

            


            const matrix = [
                [0,  58, 89, 28],
                [ 51, 0, 90, 61],
                [ 80, 145, 0, 85],
                [ 103,   99,  40, 0]
            ];
            
            // give this matrix to d3.chord(): it will calculates all the info we need to draw arc and ribbon
            const res = d3.chord()
                .padAngle(0.05)
                .sortSubgroups(d3.descending)
                (temp_3)
            
            // Add the links between groups
            d3.selectAll('.chord_di').remove();
            innerRadius = Math.min(width, height) * .39,
            outerRadius = innerRadius * 1.1
            var Names = [ "Entertainment",  "People & Blogs",  "Music",
             "News & Politics",  "Comedy",  "Sports",  "Film & Animation",  "Howto & Style",
             "Gaming",  "Science & Technology"]

             Names= country_selected.concat(Names);

    // array of 10 colors

          
            colors2=["#567235", "#8B161C", "#DF7C00","#FFC300", "#FF5733", "#C70039", "#900C3F", "#581845", "#1B1B1B", "#342350"]


            let colors_2 = d3.scaleOrdinal()
            .domain(d3.range(country_selected.length))
            .range(colors2);

            svg_chord
                .datum(res)
                .append("g")
                .selectAll("path")
                .data(d => d)
                .join("path")
                .attr("d", d3.ribbon()
                    .radius(190)
                )
               // .style("fill", d => colors(d.source.index))
                .style("fill", function(d) {  return ( d.index > country_selected.length ? colors(d.index) :colors_2(d.source.index) ); })
                .style("stroke", "black")
                .attr("class", "chord_di")
                .style("opacity", "0.5")
                .attr('id', function(d) { return 'chord_di_' + d.source.index })
                .on("mouseover", function(event,d) {
                   
                  
                

                    d3.selectAll("#chord_di_" + d.source.index )
                    .style("opacity", "1")
                })
                .on("mouseout",  function(event,d) {
                             
                    d3.selectAll("#chord_di_" + d.source.index )
                    .style("opacity", "0.5")
                });
            
            // this group object use each group of the data.groups object
            const group = svg_chord
                .datum(res)
                .append("g")
                .selectAll("g")
                .data(d => d.groups)
                .enter()
            
            // add the group arcs on the outer part of the circle
     
                opacityDefault = 0.8;
                d3.selectAll(".group").remove();

              var outerArcs = svg_chord.selectAll("g.group")
                .data(d => d.groups)
                .enter().append("g")
                .attr("class", "group")
                .on("mouseover", fade(.1))
                .on("mouseout", fade(opacityDefault));
            
            

            outerArcs.append("path")
                .style("fill", function(d) { return ( d.index > country_selected.length ? colors(d.index) :colors_2(d.index) ); })
                .attr("d", d3.arc()
                .innerRadius(190)
                .outerRadius(200))
                .attr("class", "arcs_colors");

                function fade(opacity) {
                 
                    return function(d,i) {
                      svg.selectAll("path.chord")
                          .filter(function(d) { return d.source.index != i && d.target.index != i; })
                          .transition()
                          .style("opacity", opacity);
                    };
                  }//fade 
            ////////////////////////////////////////////////////////////
            ////////////////////// Append Names ////////////////////////
            ////////////////////////////////////////////////////////////
            
            //Append the label names on the outside
            outerArcs.append("text")
              .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
              .attr("dy", ".35em")
              .attr("class", "titles")
              .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
              .attr("transform", function(d) {
                    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                    + "translate(" + (outerRadius + 100) + ")"
                    + (d.angle > Math.PI ? "rotate(90)" : "rotate(90)");
              })
              .text( function(d,i) {  return ( d.index > country_selected.length -1 ?'': Names[i] ); })
             
              
            // Add the ticks
            group
                .selectAll(".group-tick")
                .data(d => groupTicks(d, 25))    // Controls the number of ticks: one tick each 25 here.
                .join("g")
                .attr("transform", d => `rotate(${d.angle * 180 / Math.PI - 90}) translate(200,0)`)
                .append("line")               // By default, x1 = y1 = y2 = 0, so no need to specify it.
                .attr("x2", 6)
                .attr("stroke", "black")
            
            // Add the labels of a few ticks:
            d3.selectAll('.group-tick-label').remove();
            group
                .selectAll(".group-tick-label")
                .data(d => groupTicks(d, 25))
                .enter()
                .filter(d => d.value % 25 === 0)
                .append("g")
                .attr("transform", d => `rotate(${d.angle * 180 / Math.PI - 90}) translate(200,0)`)
                .append("text")
                .attr("x", 8)
                .attr("dy", ".35em")
                .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180) translate(-16)" : null; })
                .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
                .text(d => d.value)
                .style("font-size", 9)
                .attr("class", "group-tick-label");
            
            
            // Returns an array of tick angles and values for a given group and step.
            function groupTicks(d, step) {
                const k = (d.endAngle - d.startAngle) / d.value;
                return d3.range(0, d.value, step).map(function(value) {
                return {value: value, angle: value * k + d.startAngle};
                });
            }

    }
}


    
    ////////////////////////////////////////////////////////////

let  svg_Scat = d3.select("#chord2")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      `translate(${margin.left}, ${margin.top})`);

      svg_Scat.append("g")
  .attr("transform", `translate(0, ${height})`)
  .attr("class", "xaxis1")

  svg_Scat.append("g")
 .attr("class", "yaxis1")



 function scatter_update()
 {

    data =  GLOBAL_DATA.filter(function(d) { return d.category_id === GLOBAL_SCLAR_CIRCLE_DROPDOWN; })
    

    console.log(data)

//     let  x_2 = d3.scaleLinear()
//     .domain([0,d3.max(data, function(d) {  return +d.gdp_per_capita })])
//     .range([ 0, width ]);

//   svg_Scat.selectAll('.xaxis1').exit().remove() 

//   xAxis_2 = d3.selectAll(".xaxis1")
//       .call(d3.axisBottom(x_2))
//       .append("text")
//       .attr("transform", `translate(${plot_dx/2}, ${plot_dy - 630 })`)
//       .attr("x", 0)
//       .attr("y", 0)
//       .attr("font-size", "22px")
//       .attr("dy", "-5.1em")
//       .attr("text-anchor", "end")
//       .attr("stroke", "black")
//       .text("GDP per capita -> ");;

//   svg_Scat.selectAll('.yaxis1').exit().remove() 

//   // // Add Y axis
//   y_2 = d3.scaleLinear()
//     .domain([0, d3.max(data, function(d) { return + d.total_cases_per_million+10000; })])
//     .range([ height, 0 ]);

//   yAxis_2 = d3.selectAll('.yaxis1')
//   //.transition()
//       .call(d3.axisLeft(y_2))
//       .append("text")
//     //  .attr("transform", `translate(${0}, ${0 })`)
//       .attr("transform", "rotate(-90)")
//       .attr("x", -100)
//       .attr("y", 150)
//       .attr("font-size", "22px")
//       .attr("dy", "-5.1em")
//       .attr("text-anchor", "end")
//       .attr("stroke", "black")
//       .text("Total Cases Per Million -> ")
      


//       const brush = d3.brush()
//       .on("start brush end", brushed);

//       svg_Scat.call(brush);

    
//       svg_Scat.selectAll(".circle_scatter").remove();

//       // draws all the scatter plots dots 

//   scat_circle=  svg_Scat.selectAll(".circle_scatter")
//         .data(data)
//         .enter()
//         .append("circle")
//           .attr("cx", function(d) { return x_2(d.gdp_per_capita) })
//         .attr("cy", function(d) { return y_2(d.total_cases_per_million) })
//         .attr("r", function(d) { return (d.iso_code.slice(0, 4)==="OWID"|| d.location ==="" ? 0: GLOBAL_SCATTER_PLOT!=='total_boosters' ? (d.people_fully_vaccinated)/1000000 : d.total_boosters/100000) })   // filters world data
//         .attr("class", "circle_scatter")
//         .attr('id', function(d) { return "circle"+d.iso_code })
//         .attr("fill",function(d) { return getColor(d,3) }  )
//         .attr("opacity", 0.8)
//         .attr("stroke", "#69b3a2")
//         .attr("stroke-width", "2px")

//         // code below is for bi directional 

//         .on("mouseover", function(event, d) {
//             d3.select(this).attr("fill", "#ff0000")
//             d3.select(this).attr("stroke", "#ff0000")
//             d3.select(this).attr("stroke-width", "15px")
//             d3.select("#text").text(d.iso_code+"  "+d.location)
            
//             d3.selectAll('#'+d.iso_code).attr("fill", "orange")

//             d3.selectAll('#clu'+d.iso_code).attr("stroke", "red").attr("stroke-width", "10px")

//         })
//         .on("mouseout", function(event, d) {

//           d3.selectAll('#clu'+d.iso_code).attr("stroke-width", "0px")

//             d3.select(this).attr("fill",function(d,i) { return getColor(d,3) }  )
//             .attr("r", function(d) { return (d.iso_code.slice(0, 4)==="OWID"|| d.location ==="" ? 0:  (d.people_fully_vaccinated)/1000000 ) } )
//             d3.select(this).attr("stroke", "#69b3a2")
//             d3.select(this).attr("stroke-width", "2px")
//             d3.select("#text").text(d.iso_code)
  
  
//         d3.selectAll('#'+d.iso_code) .attr("fill",function(d,i) { return getColor(d,3) }  )
//         })

//         .on("click", function(event,d) {
//             d3.select(this).attr("fill", "#ff0000")
//             d3.select(this).attr("r", 10)
//             d3.select(this).attr("stroke", "#ff0000")
//             d3.select(this).attr("stroke-width", "5px")
//             d3.select("#text").text(d.iso_code)


          
          
//         })
//         .transition()
//         .attr("cx", function(d) { return x_2(d.gdp_per_capita) })
//         .attr("cy", function(d) { return y_2(d.total_cases_per_million) })

//   function brushed({selection})  // source : http://bl.ocks.org/feyderm/6bdbc74236c27a843db633981ad22c1b
// {

//   if (selection != null) {  // only when selected

//       // returns all objects to default settings
//     d3.selectAll(".circle_scatter").attr("stroke", 'black');
//     d3.selectAll(".pt").attr("stroke", 'black').attr('stroke-width', '3px');

//      // turns all countires to default color
//     selected_countries.forEach(function(d)
//      {
//       d3.select('#'+d) .attr("fill",function(d,i) { return getColor(d) }  );
//     })

//     selected_countries=[]; // resets the array

//     var brush_coords =selection;

     
//     selected =   scat_circle.filter(function (){

//     var cx = d3.select(this).attr("cx"),
//         cy = d3.select(this).attr("cy");

//      return isBrushed(brush_coords, cx, cy);
//    })
            

//         if(typeof selected._groups[0][0] != 'undefined')
//         {
//           selected._groups[0].forEach(function(d) {

//             selected_countries.push(d.id.slice(6, ))  // slice is used as id of the circle is from of #circleISO, so circle is sliced out
//             d3.select('#'+d.id).attr("stroke", 'red');
//             d3.select('#'+d.id.slice(6, )).attr("fill", 'red');
//             d3.select('#clu'+d.id.slice(6, )).attr("stroke", 'red').attr('stroke-width', '5px');
        
//           })
      
            
//         }
          
         
//   }
  
// }

// function isBrushed(brush_coords, cx, cy) { // returns objects within selected area source : http://bl.ocks.org/feyderm/6bdbc74236c27a843db633981ad22c1b

//   var x0 = brush_coords[0][0],
//       x1 = brush_coords[1][0],
//       y0 = brush_coords[0][1],
//       y1 = brush_coords[1][1];

// return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
// }

 }



    }) // main 