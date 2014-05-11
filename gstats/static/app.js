

AmCharts.ready(function(){

  // function labelFunction(value, formattedValue, yAxis) {
  //       axisVal = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  //       return axisVal[value];
  //   }

  function renderChart(chartData){
    // XY Chart
    chart = new AmCharts.AmXYChart();
    chart.dataProvider = chartData;
    chart.startDuration = 1.5;

    // AXES
    // X
    var xAxis = new AmCharts.ValueAxis();
    xAxis.position = "bottom";
    xAxis.autoGridCount = false;
    xAxis.gridCount = 24;
    xAxis.maximum = 23;
    xAxis.unit = 'h';
    chart.addValueAxis(xAxis);

    // Y
    var yAxis = new AmCharts.ValueAxis();
    // yAxis.labelFunction =  labelFunction

    yAxis.position = "left";
    yAxis.maximum = 6;
    yAxis.axisAlpha = 0;
    chart.addValueAxis(yAxis);

    // GRAPHS
    // first graph
    var graph = new AmCharts.AmGraph();
    graph.valueField = "commits";
    graph.lineColor = "#b0de09";
    graph.xField = "time";
    graph.yField = "day";
    graph.lineAlpha = 0;
    graph.bullet = "bubble";
    graph.balloonText = "Time:<b>[[x]]</b> Day:<b>[[y]]</b><br>Commits:<b>[[value]]</b>";
    chart.addGraph(graph);

    // CURSOR
    var chartCursor = new AmCharts.ChartCursor();
    chart.addChartCursor(chartCursor);

    // SCROLLBAR
    var chartScrollbar = new AmCharts.ChartScrollbar();
    chart.addChartScrollbar(chartScrollbar);

    // WRITE                                                
    chart.write("chartdiv");

  }

  $('#get_stats').on('click',function(evt){
    evt.preventDefault();
    var user_input = $('#repository').val();
    var data = {
      username : user_input.substr(0,user_input.indexOf('/')),
      repository : user_input.substr(user_input.lastIndexOf('/')+1),
    }
    ajaxHandler(data,'search')
  })

  $('.repositories .rep').on('click',function(evt){
    evt.preventDefault();
    var user_input = $(this);
    console.log(user_input);
    var data = {
      username : user_input.find('span.username').text(),
      repository : user_input.find('span.repository').text(),
    }
    ajaxHandler(data,'history')
  })

  function ajaxHandler(data,source){
    $('.chart #chartdiv').html('')
    $('#loader').removeClass('hide');

    $.ajax({
      type:'get',
      data:data,
      url: 'http://0.0.0.0:6543/stats',
      success:function(response){
        renderChart(response.stats)
        $('#loader').addClass('hide');

        if(source=='search'){
          var elem = '<div class="rep"><span class="username">'+data.username+'</span>';
          elem+='<span class="repository">'+data.repository+'</span></div>';
          $('.repositories').append(elem)
          $('#repository').val('');
        }
      },
      error:function(){
        $('#loader').addClass('hide');
        $('#chartdiv').html('<h5>Some thing went wrong. Please make sure you entered valid and public Github Repo.</h5>')
      }
    })
  }

})

