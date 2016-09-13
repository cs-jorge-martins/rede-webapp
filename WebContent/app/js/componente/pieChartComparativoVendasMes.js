
function pieChartComparativo(dataSource) {
	var pie = {

			options: {
				credits: {
					 enabled: false
				},
				chart: {
					type: 'column',
					zoomType: 'x',
					width: 938,
					height: 285
					
				},        
				colors: ['#007bb0','#7eb000'],
				tooltip: {
					formatter: function() {
			             return '<b>Mês: '+ this.series.name + '</b><br />Dia: ' + this.x + 
			             '</b><br />Valor Total: ' + currency(this.y);
			         }
				}
			},
			series: dataSource,
			title: {
				text: ''
			},
			xAxis: {currentMin: 1,  minRange: 1 , categories:1},
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

