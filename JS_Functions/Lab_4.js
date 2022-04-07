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
        GLOBAL_COUNTRY_DROPDOWN= 'WORLD'
        GLOBAL_DATE = '2017-12-31'
        GLOBAL_CAT_DROPDOWN= '24'
        GLOBAL_DATA_DROPDOWN = 'likes'
        GLOBAL_COUNTRY_SELECTED = []
        GLOBAL_X_BOUND_LOW = 0
        GLOBAL_X_BOUND_HIGH = 500000


        let zoom_map = d3.zoom().on("zoom", handleZoom);
  
        function handleZoom(e) {
             d3.select("svg g").attr("transform", e.transform);
      
        }
      
        function initZoom() {
            d3.select(".box1").call(zoom_map);
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
        .data(dataGeo.features.filter(function(d) { return countries_names.includes(d.properties.iso_a2); })) // returns the countries in the list
        .join("path")
            .attr("fill", function(d) { return (getColor(d)) })
            .attr("opacity", 0.8)
            .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            .attr("d", path)
            .style("stroke", 'black')
            .style("stroke-width", 2)
            .style("opacity", 0.8)
            .attr("class", "country")
            .attr("id", function(d, i) {  return d.properties.iso_a2 ;}) // give unique id to each country
            
       initZoom();

       countriesGroup1.on("click", function(event, d) 
                            {
                                select_Country(d.properties.iso_a2) // add the country to the list of selected countries
                                d3.select(this).style("stroke-width", 6).style("stroke", "orange") // make the country border orange
                                GLOBAL_COUNTRY = d.properties.iso_a2; // updates the global variable
                                bar_data_date('17.14.11') // updates the bar chart
                                Update_Chord() // updates the chord diagram
                                Update_Clustering() // updates the clustering diagram
                               
                            })
                        .on("mouseover", function(event, d) 
                            {
                                d3.selectAll('#circle'+d.properties.iso_a2).style("r", 20).attr("stroke", "red").attr("stroke-width", 8) // highlights revelant points on scatter 
                                d3.select(this).style("opacity", 1) // highlights the country on mouseover
                                d3.select(this).style("fill", "red")
                                d3.select(this).style("cursor", "pointer")
                            }
                            )
                        .on("mouseout", function(event,d) 
                            {
                                d3.selectAll('#circle'+d.properties.iso_a2).style("r", 10).attr("stroke", "red").attr("stroke-width", 0) // returns the color of the circle on scatter
                                d3.select(this).style("fill", function(d) { return (getColor(d)) }) // returns the color of the country 
                                d3.select(this).style("opacity", 0.8)
                            })


       let vid_data = initialize[1]  // local data 

    //    const Data_catergory = d3.group(vid_data, d => d.category_id );

   const Data_PublishDate = d3.group(vid_data, d => d.trending_date );

    startDate = '17.14.11'
  
    // code inspired from https://stackoverflow.com/questions/2013255/how-to-get-year-month-day-from-a-date-object
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




function bar_data_date(date) // this function is used to update the bar chart and also get global data 
{
    // the array is of the format that shows the total stats of each category 

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

   filteredData = Data_PublishDate.get(date) // local data for bar chart 
   GLOBAL_DATA = Data_PublishDate.get(date) // updates global data for other layouts 

   if (GLOBAL_COUNTRY_DROPDOWN !== 'WORLD')
   {
    filteredData = filteredData.filter(function(d) { return d.country === GLOBAL_COUNTRY_DROPDOWN; }) // data for the selected country is filtered
   }
   

filteredData.forEach(element => { // the total stats of each category is updated
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
    .attr("y", function(d,i){ return 220 + i*(size+5)}) 
    .attr("width", size)
    .attr("height", size)
    .style("fill", function(d){ return colors(d.name)})


    svg_chord.selectAll("mylabels")
  .data(keys1)
  .enter()
  .append("text")
    .attr("x", 100 + size*1.2)
    .attr("y", function(d,i){ return 220 + i*(size+5) + (size/2)}) 
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
        .append("text")
         .attr("x", 220)
        .attr("y", 100)
        .attr("font-size", "12px")
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("Categories -> ");
        
        
       // Add Y axis
       var y = d3.scaleLinear()
       
        .domain([0, 20])
        .range([ height, 0]);
       svg.append("g")
        .attr("class", "myYaxis_left")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")

        .attr("x", -120)
        .attr("y", 10)
        .attr("font-size", "12px")
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr('id', 'y_scater_label')
        .text("Total "+ GLOBAL_DATA_DROPDOWN +"-> ");
       
       // Add Y axis
       
       GLOBAL_COUNTRY_DROPDOWN= 'WORLD'
       GLOBAL_DATE = '2017-12-31'

       // code for drop down inspired from https://d3-graph-gallery.com/graph/line_select.html

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
            GLOBAL_COUNTRY_DROPDOWN= d3.select(this).property("value")
            Update_Bar_Chart(bar_data_date(convertToString(GLOBAL_DATE)),'24')
       })
           
       const mapCircle_dropDown2 = ["likes", "dislikes","comment_count"]
       // add the options to the button
       d3.select("#selectButton2")
         .selectAll('myOptions')
         .data(mapCircle_dropDown2)
         .enter()
         .append('option')
         .text(function (d) { return d; }) // text showed in the menu
         .attr("value", function (d) {  return d; })
          // corresponding value returned by the button
         d3.select("#selectButton2").on("change", function(event,d) {
            GLOBAL_DATA_DROPDOWN= d3.select(this).property("value")
            d3.selectAll("#y_scater_label").text("Total "+ GLOBAL_DATA_DROPDOWN +"-> ")
            Update_Bar_Chart(bar_data_date(convertToString(GLOBAL_DATE)),'24')
            Update_Scatter() // updates the scatter plot
       })


       const mapCircle_dropDown3  = [   "Entertainment",  "People & Blogs",  "Music",
       "News & Politics",  "Comedy",  "Sports",  "Film & Animation",  "Howto & Style",
       "Gaming",  "Science & Technology"   ] // names of the categories
       
    
   
   let  key_value = {"Entertainment":'24' , // category name and its corresponding id
    "People & Blogs":'22',
    "Music":'10',
    "News & Politics":'25',
    "Comedy":'23',
    "Sports":'17',
    "Film & Animation":'1',
    "Howto & Style":'26',
    "Gaming":'20',
    "Science & Technology":'28'}


  

       // add the options to the button
       d3.selectAll("#selectButton3")
         .selectAll('myOptions')
         .data(mapCircle_dropDown3)
         .enter()
         .append('option')
         .text(function (d) { return d; }) // text showed in the menu
         .attr("value", function (d) {  return d; })
          // corresponding value returned by the button
         d3.select("#selectButton3").on("change", function(event,d) {
            GLOBAL_CAT_DROPDOWN= key_value[d3.select(this).property("value")]
            Update_Scatter();
           
       })
      
       function Update_Bar_Chart(data , cat ) { // function that updates the bar chart
       if(GLOBAL_DATA_DROPDOWN == 'comment_count'){
        max  = d3.max(data, function(d) { return +d.comment_count; }) // get the min and max values of the data
        min = d3.min(data, function(d) { return +d.comment_count; })
       
        // code belwo is similar ot previous labs
       
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
           .call(d3.axisLeft(y).tickFormat(d => d3.format(".2s")(d).replace('G', 'B'))) 
           // source : https://stackoverflow.com/questions/40774677/d3-formatting-tick-value-to-show-b-billion-instead-of-g-giga
           
         ;
       
  
       
        var u = svg.selectAll("rect")
        .data(data)
       
        u.enter()
        .append("rect")
        .merge(u)
        .on("mouseover", onMouseOver) //Add listener for the mouseover event
        .on("mouseout", onMouseOut) //Add listener for the mouseout event
        .transition()
        .duration(100)
        .attr("x", function(d) { return x(d.category_name); })
        .attr("y", function(d) { return y(d.comment_count); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.comment_count); })
        .attr("fill", function(d,i) { return d.category_color; })
        
        u.exit().transition().remove();

       }

       if(GLOBAL_DATA_DROPDOWN == 'dislikes'){
        max  = d3.max(data, function(d) { return +d.dislikes; }) // get the min and max values of the data
        min = d3.min(data, function(d) { return +d.dislikes; })
       
        // code belwo is similar ot previous labs
       
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
           .call(d3.axisLeft(y).tickFormat(d => d3.format(".2s")(d).replace('G', 'B'))) 
           // source : https://stackoverflow.com/questions/40774677/d3-formatting-tick-value-to-show-b-billion-instead-of-g-giga
           
         ;
       
  
       
        var u = svg.selectAll("rect")
        .data(data)
       
        u.enter()
        .append("rect")
        .merge(u)
        .on("mouseover", onMouseOver) //Add listener for the mouseover event
        .on("mouseout", onMouseOut) //Add listener for the mouseout event
        .transition()
        .duration(100)
        .attr("x", function(d) { return x(d.category_name); })
        .attr("y", function(d) { return y(d.dislikes); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.dislikes); })
        .attr("fill", function(d,i) { return d.category_color; })
        
        u.exit().transition().remove();

       }


       if(GLOBAL_DATA_DROPDOWN == 'likes'){
        max  = d3.max(data, function(d) { return +d.likes; }) // get the min and max values of the data
        min = d3.min(data, function(d) { return +d.likes; })
       
        // code belwo is similar ot previous labs
       
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
           .call(d3.axisLeft(y).tickFormat(d => d3.format(".2s")(d).replace('G', 'B'))) 
           // source : https://stackoverflow.com/questions/40774677/d3-formatting-tick-value-to-show-b-billion-instead-of-g-giga
         ;
       
  
       
        var u = svg.selectAll("rect")
        .data(data)
       
        u.enter()
        .append("rect")
        .merge(u)
        .on("mouseover", onMouseOver) //Add listener for the mouseover event
        .on("mouseout", onMouseOut) //Add listener for the mouseout event
        .transition()
        .duration(100)
        .attr("x", function(d) { return x(d.category_name); })
        .attr("y", function(d) { return y(d.likes); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.likes); })
        .attr("fill", function(d,i) { return d.category_color; })
        
        u.exit().transition().remove();
       }

       }

 
  
  
  d3.select("#nRadius2").on("input", function() {Update_All_Layouts(+this.value); });  // get info from the slider
  
  date = d3.interpolateDate( new Date('2017-11-14'),new Date('2018-06-14')) // max and min values of dates in dataset

    function Update_All_Layouts(nRadiusvalue2) 
    { // updates all the layouts using information from the slider

        GLOBAL_DATE = date (nRadiusvalue2) // sets global date

        d3.select("#date").text(' Current Date: '+date (nRadiusvalue2).toISOString().substring(0, 10));
        d3.select("#date2").text(' Current Date: '+date (nRadiusvalue2).toISOString().substring(0, 10));
        // updates all layouts with new date
        Update_Bar_Chart(bar_data_date(convertToString(GLOBAL_DATE)),'24');
        Update_Chord();
        Update_Scatter();
        Update_Clustering ();
        Update_MapCircle();
    }



       Update_Bar_Chart(Bar_arr,'24')




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

    Categories = Object.keys(top10Categories)// just the categories 
      

function Update_Chord() // funtion that updates the chord diagram
    {
        if(typeof GLOBAL_DATA !== 'undefined' && GLOBAL_DATA.length > 0)
        {
    
        data_arr = []
        country_selected = []
        data =  d3.group(GLOBAL_DATA, d => d.country ); // groups the data by country
     
    
            // create a matrix

            GLOBAL_COUNTRY_SELECTED.forEach(function(d) {

                temp_arr_2 = []
                temp1 = data.get(d) // gets the data for the selected date

        if(typeof temp1 !== 'undefined')              
        {

                    temp = d3.group(temp1, d => d.category_id )  // groups the data by category
                        
                        
                        Categories.forEach(function(e) { // total number of videos belonging to each category is calculated

                                                        
                            if(typeof temp.get(e) !== 'undefined')
                            
                            {
                                
                                total_count =  temp.get(e).length

                                temp_arr_2.push({ 'category_id': e, 'category_name': top10Categories[e], 'count' : total_count})
                            }

                            else{
                                temp_arr_2.push({ 'category_id': e, 'category_name': top10Categories[e], 'count' : 0})
                            }

                        })

                        data_arr.push({"country" :d ,'data':temp_arr_2}) // and is stored in data_arr
                        country_selected.push(d)
                    }

                    });


        

                  // the code below to the tranoform the data above into form of a symmetrix matrix 
                 
                    temp_3 = []


                    for(let j = 0 ; j< 12; j++)
                        {
                            temp_3.push([0,0,0,0,0,0,0,0,0,0,0,0]) // genarating a matrix
                        }

          
        
        // https://www.visualcinnamon.com/2016/06/orientation-gradient-d3-chord-diagram/

            for(let i = 0 ; i< data_arr.length ; i++) // adding data in the form of a symmteric matrix
                {
                    let counter = temp_3.length - 1 
                  
                    data_arr[i].data.forEach(function(d) {temp_3[counter--][i] = d.count }) // top right to left

                    counter = temp_3.length - 1

                    data_arr[i].data.forEach(function(d) { temp_3[i][counter--] = d.count}) // bottom left to top
                }


            // the code below is used to draw the chord diagram
            // code from https://bl.ocks.org/mbostock/4062045
            // and http://bl.ocks.org/nbremer/864b11eb83aac3a1f6a2

            // give this matrix to d3.chord(): it will calculates all the info we need to draw arc and ribbon
            const res = d3.chord()
                .padAngle(0.05)
                .sortSubgroups(d3.descending)
                (temp_3)
            
         
            d3.selectAll('.chord_di').remove();

            innerRadius = Math.min(width, height) * .39,
            outerRadius = innerRadius * 1.1

            var Names = [   "Entertainment",  "People & Blogs",  "Music",
                            "News & Politics",  "Comedy",  "Sports",  "Film & Animation",  "Howto & Style",
                            "Gaming",  "Science & Technology"   ]

            Names= country_selected.concat(Names);

         
            colors2=["#567235", "#8B161C", "#DF7C00","#FFC300", "#FF5733", "#C70039", "#900C3F", "#581845", "#1B1B1B", "#342350"] // colours for the categories 


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
                .style("fill", function(d) {  return ( d.index > country_selected.length ? colors(d.index) :colors_2(d.source.index) ); }) // colour the chords based on the country
                .style("stroke", "black")
                .attr("class", "chord_di")
                .style("opacity", "0.5")
                .attr('id', function(d) { return 'chord_di_' + d.source.index })
                .on("mouseover", function(event,d) {

                    d3.selectAll("#chord_di_" + d.source.index )
                    .style("opacity", "1") // highlight the selected chord

                   
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
                        
                // adds the colours for the outer part of the circle
            outerArcs.append("path")
                .style("fill", function(d) { return ( d.index > country_selected.length ? colors(d.index) :colors_2(d.index) ); }) // fill colour accoring to the country or category
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
                  }

           //Append the country names on the outside
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
                .append("line")              
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


 let selected_countries=[]

 function Update_Scatter()
 {
    var margin1 = { top: 20, right: 0, bottom: 50, left: 120 },
    svg_dx =w - 100, 
    svg_dy = 800,
    plot_dx = svg_dx - margin1.right - margin1.left,
    plot_dy = svg_dy - margin1.top - margin1.bottom;

    data =  GLOBAL_DATA.filter(function(d) { return d.category_id === GLOBAL_CAT_DROPDOWN; }) // filter data based on drop down selection
    


    let  x_2 = d3.scaleLinear()
    .domain([2000000,d3.max(data, function(d) {  return +d.views /5 })])
    .range([ 0, width ]);

  svg_Scat.selectAll('.xaxis1').exit().remove() 

  xAxis_2 = d3.selectAll(".xaxis1")
      .call(d3.axisBottom(x_2))
      .append("text")
      .attr("x", 220)
     .attr("y", 100)
     .attr("font-size", "12px")
     .attr("dy", "-5.1em")
     .attr("text-anchor", "end")
     .attr("stroke", "black")
    .attr("class", "scatter_x")
     .text("Likes -> ");

  svg_Scat.selectAll('.yaxis1').exit().remove() 

  // // Add Y axis
  y_2 = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.likes; })])
    .range([ height, 0 ]);

  yAxis_2 = d3.selectAll('.yaxis1')
  //.transition()
      .call(d3.axisLeft(y_2))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -120)
      .attr("y", 10)
      .attr("font-size", "12px")
      .attr("dy", "-5.1em")
      .attr("text-anchor", "end")
      .attr("stroke", "black")
      .text("Views -> ");
      


      const brush = d3.brush()
      .on("start brush end", brushed);

      svg_Scat.call(brush);

    
      svg_Scat.selectAll(".circle_scatter").remove();

      // draws all the scatter plots dots 

  scat_circle=  svg_Scat.selectAll(".circle_scatter")
        .data(data.filter(function(d) { return d.views>2000000 }))
        .enter()
           .append("circle")
          .attr("cx", function(d) { return x_2(d.views) })
        .attr("cy", function(d) { return y_2(d.likes) })
        .attr("r", function(d) { return 10})   // filters world data
        .attr("class", "circle_scatter")
        .attr('id', function(d) { return "circle"+d.country })
        .attr("fill",function(d) { return getColor(d.country)}  )
        .attr("opacity", 0.8)
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", "2px")
      

        // code below is for bi directional 

        .on("mouseover", function(event, d) {
            d3.select(this).style("r", 15).style('opacity', 1); // makes the dot bigger on mouseover
            d3.select("#"+d.country).style("fill", "red"); // hihglight the selected country

        })
        .on("mouseout", function(event, d) {
            d3.select(this).style("r", 10).style('opacity', 0.8) // makes the dot smaller on mouseout
            d3.select("#"+d.country).style("fill", function(d) { return getColor(d.country)}); // unhighlight the selected country
        })
        .transition()
        .attr("cx", function(d) { return x_2(d.views) })
        .attr("cy", function(d) { return y_2(d.likes) })

  function brushed({selection})  // source : http://bl.ocks.org/feyderm/6bdbc74236c27a843db633981ad22c1b
{

  if (selection != null) {  // only when selected

      // returns all objects to default settings


     // turns all countires to default color
    selected_countries.forEach(function(d)
     {
      d3.select('#'+d) .style("fill",function(d,i) { return getColor(d) }  ).style("stroke-width", "2px"); // unhighlight the selected countrires
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
            d3.select('#'+d.id.slice(6, )) .style("fill", "red"  ).style("stroke", "black").style("stroke-width", "10px"); // highlight the selected country
            if (selected_countries.includes(d.id.slice(6, ))!== true) {selected_countries.push(d.id.slice(6, ))} // adds the selected country to the array

        
          })
      
            
        }
          
         
  }
  
}

function isBrushed(brush_coords, cx, cy) { // returns objects within selected area source : http://bl.ocks.org/feyderm/6bdbc74236c27a843db633981ad22c1b

  var x0 = brush_coords[0][0],
      x1 = brush_coords[1][0],
      y0 = brush_coords[0][1],
      y1 = brush_coords[1][1];

return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
}






 }


function get_scalr_map_data (iso) // returns the data for a country
{
  
   return (GLOBAL_DATA.filter(function(d) { return d.country == iso; }).filter(function(d) { return d.category_id === GLOBAL_CAT_DROPDOWN }).length )


}

function Update_MapCircle()
{
    g.selectAll('.circle_sclr').remove(); // removes old circles

    g.selectAll('circle')
    .data(dataGeo.features.filter(function(d) { return countries_names.includes(d.properties.iso_a2); })) // filters the data of countries in dataset
    .enter()
    .append('circle')
    .attr('cx', function(d) {
        return path.centroid(d)[0]; // gets centre of country on svg
    })
    .attr('cy', function(d) {
    return path.centroid(d)[1];     // gets centre of country on svg
    })
    .attr('r', function(d,i) { return get_scalr_map_data(d.properties.iso_a2) })
    .attr('fill', '#ffffff')
    .attr('stroke', '#ffffff')
    .attr('stroke-width', '10px')
    .attr('class', 'circle_sclr')
    .attr('opacity', 0.8)
    .attr('pointer-events', 'none')
}

 function reset_countries_list()
 {

    // console.log(GLOBAL_COUNTRY_SELECTED)
     GLOBAL_COUNTRY_SELECTED.forEach(function(d) {
    console.log("#"+d)
        d3.select('#'+d) .style("stroke-width", 2).style("stroke", "black");
      
     })

     GLOBAL_COUNTRY_SELECTED = []

  
  
 }


 d3.select("#resetB").on("click", reset_countries_list ) // to reset the countries list



 var margin1 = { top: 20, right: 0, bottom: 50, left: 120 },
 svg_dx =w - 100, 
 svg_dy = 800,
 plot_dx = svg_dx - margin1.right - margin1.left,
 plot_dy = svg_dy - margin1.top - margin1.bottom;
 
 
 var x_clus = d3.scaleLinear().range([margin1.left, plot_dx]),
 y_clus = d3.scaleLinear().range([plot_dy, margin1.top]);
 
 var svg_clus = d3.select("#cluster")  // svg for clustering 
         .append("svg")
         .attr("width", svg_dx)
         .attr("height", svg_dy);

         Legend_cluster = [ {'name' : 'Entertainment', 'color' : '24'}, 
         {'name' : 'People & Blogs', 'color' : '22'}, 
         {'name' : 'Music', 'color' : '10'},
         {'name' : 'News & Politics', 'color' : '25'}, 
          {'name' : 'Comedy', 'color' : '23'},
           {'name' : 'Sports', 'color' : '17'}, 
           {'name' : 'Film & Animation', 'color' : '1'}, 
           {'name' : 'Howto & Style', 'color' : '26'},
           {'name' : 'Gaming', 'color' : '20'}, 
           {'name' : 'Science & Technology', 'color' : '28'}]

         svg_clus.selectAll("mydots")
         .data(Legend_cluster)
         .enter()
         .append("text")
           .attr("x", w - 310)
           .attr("y", function(d,i){ return 220 + i*(size+5)}) 
           .text( function(d){ return d.color})
       
       
           svg_clus.selectAll("mylabels")
         .data(Legend_cluster)
         .enter()
         .append("text")
           .attr("x", (w - 300) + size*1.2)
           .attr("y", function(d,i){ return 210 + i*(size+5) + (size/2)}) 
           .text(function(d){ return d.name})
           .attr("text-anchor", "left")
           .style("alignment-baseline", "middle")
              .style("font-size", "12px")
                .style("font-family", "sans-serif")
                .style("fill", "black")
                .style("font-weight", "bold")
                .style("pointer-events", "none")
 
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

 function Update_Clustering (range = 10)
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


   local_temp_data =  GLOBAL_DATA.filter(function(d) { return  d.country === GLOBAL_COUNTRY }) // gets the filtered local data
   clus_arr = []

   Categories.forEach(function(dd)
   { // for each category

        temp = local_temp_data.filter(function(d) { return d.category_id === ""+dd }) // get daata accorriding to category
        
        temp= temp.sort(function(a, b) {            // sort the data according to the number of views in descending order
            return parseFloat(b.views) - parseFloat(a.views);}).slice(0,4);                               // get the top 4

        temp.forEach(function(d) { // push to the cluster array that will be visualized
            clus_arr.push({'country':d.country,'x':d.views,'y':d.likes,'category_id':d.category_id,'thumbnail_link':d.thumbnail_link})
        })

   })


   
        d = clus_arr
  
       d.forEach(d => {   // conversion of string data to numbers
                   d.x = +d.x;
                   d.y = +d.y;
               });
   
               setScaleDomains(d);  // sets the new scaled 
               circles.selectAll(".pt").remove(); // removes prevous cluetrs 
               plotCircles(d);  // updates  new circles 

               x_axis_cluster.call(d3.axisBottom(x_clus))
               .append("text")
               .attr("transform", `translate(${plot_dx/2}, ${plot_dy - 590 })`)
               .attr("x", 0)
               .attr("y", 0)
               .attr("font-size", "22px")
               .attr("dy", "-5.1em")
               .attr("text-anchor", "end")
               .attr("stroke", "black")
               .text("Likes -> ");
               
              
               y_axis_cluster.call(d3.axisLeft(y_clus))
               .append("text")
               .attr("transform", `translate(${ plot_dy - 630}, ${ plot_dx/2})`)
               .attr("transform", "rotate(-90)")
               .attr("x", -60)
               .attr("y", 150)
               .attr("font-size", "22px")
               .attr("dy", "-5.1em")
               .attr("text-anchor", "end")
               .attr("stroke", "black")
               .text("Views -> ");
               
              
   
               // randomly select 15 data points for initial centroids
               var initialCentroids = clusters.map(() => d[Math.round(d3.randomUniform(0, d.length)())]);
   
               assignCluster(initialCentroids);  
               addHull();// adds the  clutering vizulations called hulls
   
               costs.push(computeCost());

               var iterate = d3.interval(() => {
   
                   var c = computeCentroids()
   
                   assignCluster(c)
                   addHull(); // for visualization of cluster groups 
   
                   var cost = computeCost();
   
                   // stop iterating when algorithm coverages to local minimum
                   if (cost == costs[costs.length - 1]) {
   
                       displayStats(costs);// shows the iteration of running k means
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
              
                n_iters.append("tspan")  // display number of iterations
                       .style("font-weight", "bold")
                       .text("Num. Iterations: ");
              
                n_iters.append("tspan")
                       .text(costs.length);
              
                var cost = stats.append("text")
                                .attr("x", 10)
                                .attr("y", 40);
              
                cost.append("tspan") //display local minimum
                    .style("font-weight", "bold")
                    .text("Local Minimum: ");
              
                cost.append("tspan")
                    .text(formatMin(costs[costs.length - 1]));
                   
              }
              
              function computeCentroids() { // function to get the centroids
                
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
              
                clusters.forEach(cluster => { // add clusters to the vizualtions
              
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
              
              function computeCost() { // function to compute the cost
              
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
                    var dist = Math.sqrt(Math.pow(d_pt.x - centroid.x, 2) + Math.pow(d_pt.y - centroid.y, 2)); // euclidean distance
                    return dist;
                })
                return dists;
              }
              
              function setScaleDomains(d) {
              
                 x_clus.domain(
                   [10000,5000000
                    //,d3.max(d, d => d.x)
                ]);
                 y_clus.domain( [-2000, 500000
                 // d3.max(d, d => d.y)+1000
                ]);

                 
      
              }
              
              function plotCircles(d) {

            
            
              
                circles.selectAll(".pt")
                       .data(d)
                       .enter()
                       .append("g")
                       .append("circle")
                       .attr("class", "pt")
                       .attr("r", (d)=>d.x < 4900000?((svg_dx + svg_dy)*0.008):0)
                       .attr("cx", (d) => d.x < 4900000?x_clus(d.x):-1000000)
                       .attr("cy", (d) => d.x < 4900000?y_clus(d.y):-1000000)
                       .attr('id', (d,i) => "clu" + d.x)
                       .attr('opacity', 0.5)

                       
                       .on("mouseover", function(event,d) {
                        d3.selectAll('#'+d.country).style("stroke", 'red'); // highlight the country
                        d3.selectAll('#circle'+d.country).style("stroke", 'red').style('stroke-width', '9px'); // highlight the circle on scatter plot of that country
                   
                        d3.selectAll('#clu'+d.x).style("stroke", 'red').style('stroke-width', '5px');
                     
                        d3.selectAll('#clusimg' + d.x).style('width', 200)
                        .style('height', 200);
                        
                           
                       })
                       .on("mouseout",function(event,d) { // the code below is for bi directional 
                        
                        d3.selectAll('#clu'+d.x).style("stroke", 'red').style('stroke-width', '0px'); 
                        d3.selectAll('#'+d.country) .style("fill",function(d,i) { return getColor(d) }  );
                        d3.selectAll('#circle'+d.country).style("stroke", 'red').style('stroke-width', '0px');
                       d3.selectAll('#clusimg' + d.x)    .style('width', 0)
                       .style('height', 0)

                      })

                       clust_text.selectAll(".text_clu").remove();
                       clust_text.selectAll(".img_clu").remove();

                       clust_text.selectAll(".img_clu").data(d) // this adds video thumbnail to the cluster circles
                       .enter()
                       .append("g")
                       .append('image')
                        .attr('xlink:href', function(d) { return d.thumbnail_link; })
                        .attr('width', 0)
                        .attr('height', 0)
                        .attr("x", (d) =>d.x > 11000?(x_clus(d.x)):-10000 )
                       .attr("y", (d) =>d.x > 11000?(y_clus(d.y)):-10000)
                       .attr('class','img_clu')
                       .attr('id', (d) => "clusimg" + d.x)
                       .style("pointer-events", "none")
                       

                       clust_text.selectAll(".text_clu").data(d) // this adds text to the cluster circles
                       .enter()
                       .append("g")
                       .append("g")
                       .append('text')
                       .attr("x", (d) =>d.x > 11000?(x_clus(d.x)):-10000 )
                       .attr("y", (d) =>d.x > 11000?(y_clus(d.y)):-1000000)
                       .text(function(d) { return d.category_id; })
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

            axis = d3.interpolate(0, 2000000000)

            d3.select("#ubound").on("input", function() { GLOBAL_X_BOUND_HIGH = axis(+this.value); });
            d3.select("#lbound").on("input", function() {GLOBAL_X_BOUND_LOW = axis(+this.value);});
    function handleClick(event){
      
       GLOBAL_X_BOUND_HIGH = document.getElementById("myVal2").value
       GLOBAL_X_BOUND_LOW = document.getElementById("myVal1").value
       console.log(document.getElementById("myVal").value)
      

        d3.select("#myVal2").on("input", function() {
            console.log(this.value)
          })
        ;
    //  draw(document.getElementById("myVal").value)
        return false;
    }

    d3.select("#add").on("click", handleClick ) 

    }) // main 

