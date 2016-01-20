app.controller('ResultsCtrl', ['$scope', '$state', 'RestService', function($scope, $state, RestService) {
	'use strict';
	
  $scope.voteAgain = function() {
    $state.go('survey');
  };

  (function() {
    RestService.call('listSurveys', 'GET', null, function(jsonData) {
      var jsonData = JSON.parse(jsonData.data); 
      drawChart();

      function drawChart() {
       var colors = ['#0000b4','#0082ca','#0094ff','#0d4bcf','#0066AE','#074285','#00187B'];

        var grid = d3.range(11).map(function(i){
          return {'x1':0,'y1':0,'x2':0,'y2':480};
        });

        var tickVals = grid.map(function(d,i){
          return i;
        });

        var xscale = d3.scale.linear()
                .domain([0, 10])
                .range([0, 700]);

        var yscale = d3.scale.linear()
                .domain([0, jsonData.length])
                .range([0, 497]);

        var colorScale = d3.scale.quantize()
                .domain([0, colors.length])
                .range(colors);

        var canvas = d3.select('#result')
                .append('svg')
                .attr({'width':900,'height':550});

        var grids = canvas.append('g')
                  .attr('id','grid')
                  .attr('transform','translate(150,10)')
                  .selectAll('line')
                  .data(grid);

        var xAxis = d3.svg.axis();
          xAxis
            .orient('bottom')
            .scale(xscale)
            .tickSize(1)
            .tickValues(tickVals);

        var yAxis = d3.svg.axis();
          yAxis
            .orient('left')
            .scale(yscale)
            .tickSize(1)
            .tickPadding('20')
            .tickFormat(function(d,i){ return jsonData[i].name + ' - ' + jsonData[i].quantity + ' people'; })
            .tickValues(d3.range(jsonData.length));

        var y_xis = canvas.append('g')
                  .attr("transform", "translate(150, 14)")
                  .attr('id','yaxis')
                  .call(yAxis);

        var x_xis = canvas.append('g')
                  .attr("transform", "translate(150, 510)")
                  .attr('id','xaxis')
                  .call(xAxis);

        var chart = canvas.append('g')
                  .attr("transform", "translate(150)")
                  .attr('id','bars')
                  .selectAll('rect')
                  .data(jsonData)
                  .enter()
                  .append('rect')
                  .attr('height',19)
                  .attr({'x':0,'y':function(d,i){ return yscale(i) + 5; }})
                  .style('fill',function(d,i){ return colorScale(i); })
                  .attr('width',function(d){ return 0; });


        var transit = d3.select("svg").selectAll("rect")
                    .data(jsonData)
                    .transition()
                    .duration(1000) 
                    .attr("width", function(d) {return xscale(d.quantity); });     
      }


      
    });
  })();
}]);