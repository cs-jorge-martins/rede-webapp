
function pieChart(dataSource) {
	var pie = {

			options: {
				credits: {
					 enabled: false
				},
				chart: {
					type: 'line',
					zoomType: 'x'
				},        
				colors: ['#38da7c','#8e44ad'],
				tooltip: {
					formatter: function() {
		                   return this.series.name + '<br />Dia: ' + this.x + '</b><br />Valor Total: ' + currency(this.y);
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
			yAxis: {
				min:0,
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

