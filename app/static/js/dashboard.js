// Example found from http://blockbuilder.org/nychi713/21c30beccc41c64f1d402e35a73f9b80

function dashboard(id, fData){
    var barColor = 'steelblue';
    function segColor(c){ return {hacked:"#807dba", Lost:"#e08214",InsideJob:"#41ab5d",Others:"#aa406a"}[c]; }
    
    // compute total for each state.
    fData.forEach(function(d){d.total=d.freq.hacked+d.freq.Lost+d.freq.InsideJob+d.freq.Others;});
    
    // function to handle histogram.
    function histoGram(fD){
        var hG={},    hGDim = {t: 60, r: 0, b: 30, l: 0};
        hGDim.w = 500 - hGDim.l - hGDim.r, 
        hGDim.h = 300 - hGDim.t - hGDim.b;
     
            
        //create svg for histogram.
        var hGsvg = d3.select(id).append("svg")
            .attr("width", hGDim.w + hGDim.l + hGDim.r)
            .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
            .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

        // create function for x-axis mapping.
        var x = d3.scaleBand().range([0, hGDim.w], 0.1)
                .domain(fD.map(function(d) { return d[0]; })).padding(.1);

        // Add x-axis to the histogram svg.
        hGsvg.append("g").attr("class", "x axis")
            .attr("transform", "translate(0," + hGDim.h + ")")
            .call(d3.axisBottom().scale(x));

        // Create function for y-axis map.
        var y = d3.scaleLinear().range([hGDim.h, 0])
                .domain([0, d3.max(fD, function(d) { return d[1]; })]);

        // Create bars for histogram to contain rectangles and freq labels.
        var bars = hGsvg.selectAll(".bar").data(fD).enter()
                .append("g").attr("class", "bar1");
        
        //create the rectangles.
        bars.append("rect")
            .attr("x", function(d) { return x(d[0]); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return hGDim.h - y(d[1]); })
            .attr('fill',barColor)
            .on("mouseover",mouseover)// mouseover is defined below.
            .on("mouseout",mouseout);// mouseout is defined below.
            
        //Create the frequency labels above the rectangles.
        bars.append("text").text(function(d){ return d3.format(",")(d[1])})
            .attr("x", function(d) { return x(d[0])+x.bandwidth()/2; })
            .attr("y", function(d) { return y(d[1])-5; })
        
            .attr("text-anchor", "middle")
        ;
        
        function mouseover(d){  // utility function to be called on mouseover.
            // filter for selected state.
            var st = fData.filter(function(s){ return s.State == d[0];})[0],
                nD = d3.keys(st.freq).map(function(s){ return {type:s, freq:st.freq[s]};});
               
            // call update functions of pie-chart and legend.    
            pC.update(nD);
            leg.update(nD);
        }
        
        function mouseout(d){    // utility function to be called on mouseout.
            // reset the pie-chart and legend.    
            pC.update(tF);
            leg.update(tF);
        }
        
        // create function to update the bars. This will be used by pie-chart.
        hG.update = function(nD, color){
            // update the domain of the y-axis map to reflect change in frequencies.
            y.domain([0, d3.max(nD, function(d) { return d[1]; })]);
            
            // Attach the new data to the bars.
            var bars = hGsvg.selectAll(".bar1").data(nD);
            
            // transition the height and color of rectangles.
            bars.select("rect").transition().duration(500)
                .attr("y", function(d) {return y(d[1]); })
                .attr("height", function(d) { return hGDim.h - y(d[1]); })
                .attr("fill", color);

            // transition the frequency labels location and change value.
            bars.select("text").transition().duration(500)
                .text(function(d){ return d3.format(",")(d[1])})
                .attr("y", function(d) {return y(d[1])-5; });            
        }        
        return hG;
    }
    
    // function to handle pieChart.
  
  
  function secondBarChart(pD){
    var pC={},    hGDim = {t: 60, r: 2, b: 30, l: 10};
        hGDim.w = 500 - hGDim.l - hGDim.r, 
        hGDim.h = 300 - hGDim.t - hGDim.b;
    
            
        //create svg for histogram.
        var hGsvg = d3.select(id).append("svg")
            .attr("width", hGDim.w + hGDim.l + hGDim.r)
            .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
            .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

        // create function for x-axis mapping.
        var x = d3.scaleBand().range([0, hGDim.w], 0.1)
                .domain(pD.map(function(d) { return (d.type); })).padding(.1);

        // Add x-axis to the histogram svg.
        hGsvg.append("g").attr("class", "x axis")
            .attr("transform", "translate(0," + hGDim.h + ")")
            .call(d3.axisBottom().scale(x));

        // Create function for y-axis map.
        var y = d3.scaleLinear().range([hGDim.h, 0])
                .domain([0, d3.max(pD, function(d) { return d.freq; })]);

        // Create bars for histogram to contain rectangles and freq labels.
        var bars2 = hGsvg.selectAll(".bar").data(pD).enter()
                .append("g").attr("class", "bar2");
        
        //create the rectangles.
        bars2.append("rect")
            .attr("x", function(d) { return x(d.type); })
            .attr("y", function(d) { return y(d.freq); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return hGDim.h - y(d.freq); })
            .attr('fill',function(d) { return segColor(d.type); })
            .on("mouseover",mouseover)// mouseover is defined below.
            .on("mouseout",mouseout);// mouseout is defined below.
            
    
        //Create the frequency labels above the rectangles.
        bars2.append("text").text(function(d){ return getPercent(d,tF);})
            .attr("x", function(d) { return x(d.type)+x.bandwidth()/2; })
            .attr("y", function(d) { return y(d.freq)-5; })
            .attr("text-anchor", "middle");
        
       pC.update = function(nD){
            // update the domain of the y-axis map to reflect change in frequencies.
            y.domain([0, d3.max(nD, function(d) { return d.freq; })]);
            
            // Attach the new data to the bars.
            var bars = hGsvg.selectAll(".bar2").data(nD);
            
            // transition the height and color of rectangles.
            bars.select("rect").transition().duration(500)
                .attr("y", function(d) {return y(d.freq); })
                .attr("height", function(d) { return hGDim.h - y(d.freq); })
                .attr("fill",  function(d) { return segColor(d.type); });

            // transition the frequency labels location and change value.
            bars.select("text").transition().duration(500)
                .text(function(d){ return getPercent(d,nD);})
                .attr("y", function(d) {return y(d.freq)-5; });            
        } 
       
        function mouseover(d){  // utility function to be called on mouseover.
            // filter for selected state.
            hG.update(fData.map(function(v){ 
                return [v.State,v.freq[d.type]];}),segColor(d.type));
        }
        
        function mouseout(d){    // utility function to be called on mouseout.
            // reset the pie-chart and legend.    
           hG.update(fData.map(function(v){
                return [v.State,v.total];}), barColor);
        }
    
     function getPercent(d,aD){ // Utility function to compute percentage.
       var p = Math.max(0, d3.precisionFixed(0.05) - 2),
    f = d3.format("." + p + "%")
       return f((d.freq/d3.sum(aD.map(function(v){ return v.freq; }))));
        }
        
        // create function to update the bars. This will be used by pie-chart.
            
        return pC;
  }
    
    // function to handle legend.
    function legend(lD){
        var leg = {};
            
        // create table for legend.
        var legend = d3.select(id).append("table").attr('class','legend');
        
        // create one row per segment.
        var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");
            
        // create the first column for each segment.
        tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
            .attr("width", '16').attr("height", '16')
			.attr("fill",function(d){ return segColor(d.type); });
            
        // create the second column for each segment.
        tr.append("td").text(function(d){ return d.type;});

        // create the third column for each segment.
        tr.append("td").attr("class",'legendFreq')
            .text(function(d){ return d3.format(",")(d.freq);});

        // create the fourth column for each segment.
        tr.append("td").attr("class",'legendPerc')
            .text(function(d){ return getLegend(d,lD);});

        // Utility function to be used to update the legend.
        leg.update = function(nD){
            // update the data attached to the row elements.
            var l = legend.select("tbody").selectAll("tr").data(nD);

            // update the frequencies.
            l.select(".legendFreq").text(function(d){ return d3.format(",")(d.freq);});

            // update the percentage column.
            l.select(".legendPerc").text(function(d){ return getLegend(d,nD);});        
        }
        
        function getLegend(d,aD){ // Utility function to compute percentage.
            return d3.format("%")(d.freq/d3.sum(aD.map(function(v){ return v.freq; })));
        }

        return leg;
    }
    
    // calculate total frequency by segment for all state.
    var tF = ['hacked','Lost','InsideJob','Others'].map(function(d){ 
        return {type:d, freq: d3.sum(fData.map(function(t){ return t.freq[d];}))
               }; 
    });    
    
    // calculate total frequency by state for all segment.
    var sF = fData.map(function(d){return [d.State,d.total];});

    var hG = histoGram(sF), // create the histogram.
        pC = secondBarChart(tF), // create the pie-chart.
        leg= legend(tF);  // create the legend.
}
  
function dashboard1( data){
  var chartWidth       = 700,
    barHeight        = 20,
    groupHeight      = barHeight * data.series.length,
    gapBetweenGroups = 10,
    spaceForLabels   = 150,
    spaceForLegend   = 150;

// Zip the series data together (first values, second values, etc.)
var zippedData = [];
for (var i=0; i<data.labels.length; i++) {
  for (var j=0; j<data.series.length; j++) {
    zippedData.push(data.series[j].values[i]);
  }
}

// Color scale
var color =d3.scaleOrdinal(d3.schemeCategory20);
var chartHeight = barHeight * zippedData.length + gapBetweenGroups * data.labels.length;

var x = d3.scaleLinear()
    .domain([0, d3.max(zippedData)])
    .range([0, chartWidth]);

var y = d3.scaleLinear()
    .range([chartHeight + gapBetweenGroups, 0]);

var yAxis = d3.axisLeft()
    .scale(y)
    .tickFormat('')
    .tickSize(0);

// Specify the chart area and dimensions
var chart = d3.select(".chart").append("svg")
    .attr("width", spaceForLabels + chartWidth + spaceForLegend)
    .attr("height", chartHeight);

// Create bars
var bar = chart.selectAll("g")
    .data(zippedData)
    .enter().append("g")
    .attr("transform", function(d, i) {
      return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i/data.series.length))) + ")";
    });

// Create rectangles of the correct width
bar.append("rect")
    .attr("fill", function(d,i) { return color(i % data.series.length); })
    .attr("class", "bar")
    .attr("width", x)
    .attr("height", barHeight - 1);

// Add text label in bar
bar.append("text")
    .attr("x", function(d) { return x(d) - 3; })
    .attr("y", barHeight / 2)
    .attr("fill", "red")
    .attr("dy", ".35em")
    .text(function(d) { return d; });

// Draw labels
bar.append("text")
    .attr("class", "label")
    .attr("x", function(d) { return - 10; })
    .attr("y", groupHeight / 2)
    .attr("dy", ".35em")
    .text(function(d,i) {
      if (i % data.series.length === 0)
        return data.labels[Math.floor(i/data.series.length)];
      else
        return ""});

chart.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups/2 + ")")
      .call(yAxis);

// Draw legend
var legendRectSize = 18,
    legendSpacing  = 4;

var legend = chart.selectAll('.legend')
    .data(data.series)
    .enter()
    .append('g')
    .attr('transform', function (d, i) {
        var height = legendRectSize + legendSpacing;
        var offset = -gapBetweenGroups/2;
        var horz = spaceForLabels + chartWidth + 40 - legendRectSize;
        var vert = i * height - offset;
        return 'translate(' + horz + ',' + vert + ')';
    });

legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', function (d, i) { return color(i); })
    .style('stroke', function (d, i) { return color(i); });

legend.append('text')
    .attr('class', 'legend')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function (d) { return d.label; });
}
  
  
function drawBars() {

var margin = {top: 80, right: 180, bottom: 80, left: 180},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#barras3").append("svg")
	.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("static/sampleData/YearsVsEntities.tsv", function(error, dataG){

  
	// filter year
	var data = dataG.filter(function(d){return d.Year == '2005';});
 
	// Get every column value
	var elements = Object.keys(data[0])
		.filter(function(d){
			return ((d != "Year") & (d != "Entity"));
		});
  

	var y = d3.scaleLinear()
			.domain([0, d3.max(data, function(d){
				return +d.Records;
			})])
			.range([height, 0]);

	var x = d3.scaleBand()
			.domain(data.map(function(d){ return d.Entity;}))
			.range([0, width]);


	var xAxis = d3.axisBottom()
		.scale(x);

	var yAxis = d3.axisLeft()
		.scale(y);

	svg.append("g")
    	.attr("class", "x axis")
    	.attr("transform", "translate(0," + height + ")")
    	.call(xAxis)
    	.selectAll("text")
    	.style("font-size", "8px")
      	.style("text-anchor", "end")
      	.attr("dx", "-.8em")
      	.attr("dy", "-.55em")
      	.attr("transform", "rotate(-90)" );


 	svg.append("g")
    	.attr("class", "y axis")
    	.call(yAxis);

	svg.selectAll("rectangle")
		.data(data)
		.enter()
		.append("rect")
		.attr("class","rectangle")
		.attr("width", width/data.length)
		.attr("height", function(d){
			return height - y(+d.Records);
		})
		.attr("x", function(d, i){
			return (width / data.length) * i ;
		})
		.attr("y", function(d){
			return y(+d.Records);
		})
		.append("title")
		.text(function(d){
			return d.Entity + " : " + d.Records;
		});


	
  var selector = d3.select("#drop")
    	.append("select")
    	.attr("id","dropdown")
    	.on("change", function(d){
        	selection = document.getElementById("dropdown");
        
			var dataS = dataG.filter(function(d){return d.Year == selection.value;});
		      
        	y.domain([0, d3.max(dataS, function(d){
				return +d.Records;})]);
        	x.domain(dataS.map(function(d){ return d.Entity;}))
			.range([0, width]);

        	yAxis.scale(y);
        	xAxis.scale(x);
  svg.selectAll(".rectangle").remove();

        

        
    svg.selectAll("rectangle")
		.data(dataS)
		.enter()
		.append("rect")
		.attr("class","rectangle")
		.attr("width", width/dataS.length)
		.attr("height", function(d){
			return height - y(+d.Records);
		})
		.attr("x", function(d, i){
			return (width / dataS.length) * i ;
		})
		.attr("y", function(d){
			return y(+d.Records);
		})
		.append("title")
		.text(function(d){
			return d.Entity + " : " + d.Records;
		});

      
        d3.selectAll("g.y.axis")
           		.transition()
           		.call(yAxis);
 d3.selectAll("g.x.axis")
           .attr("transform", "translate(0," + height + ")")
           .call(xAxis)
        	 .selectAll("text")
    			 .style("font-size", "8px")
      	   .style("text-anchor", "end")
      	   .attr("dx", "-.8em")
      	   .attr("dy", "-.55em")
      	   .attr("transform", "rotate(-90)" );

         });

  var elementosSelector=["2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016"];
    selector.selectAll("option")
      .data(elementosSelector)
      .enter().append("option")
      .attr("value", function(d){
        return d;
      })
      .text(function(d){
        return d;
      })

});

}

