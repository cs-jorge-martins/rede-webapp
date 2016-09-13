
function pieChartGestao(dataSource) {
	var pie = {

			options: {
				credits: {
					 enabled: false
				},
				chart: {
					type: 'line',
					zoomType: 'x',
					width: 936,
					height: 280
				},        
				colors: ['#00656f','#222e3c'],
				tooltip: {
					 formatter: function() {
				        return '<b>Mês: '+ this.series.name + '</b><br />Dia: ' + this.x + 
				             '</b><br />Valor Total: ' + currency(this.y);
				     }
		            
				},
				plotOptions: {
				    series: {
				        marker: {
				            enabled: false
				        }
				    }
				}
			},
			series: dataSource,
			title: {
				text: ''
			},
			xAxis: {currentMin: 1,  minRange: 1 ,categories:1},
			yAxis: {min:0,
				title: {
					text: ''
				},
				labels: {
					formatter: function() {
							return currency(this.value);
					}
				}
			},
			loading: false
	};
	return pie;
};

