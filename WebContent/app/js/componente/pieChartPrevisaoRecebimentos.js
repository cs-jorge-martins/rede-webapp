function pieChartVendasVisoes(dataSource) {
	var pie = {
			
			options: {
				credits: {
					 enabled: false
				},
				colors: ['#2dcc6f','#f29811','#bd3c2d'],
		        chart: {
		            plotBorderWidth: 0,
		            plotShadow: false,
		            plotBackgroundColor: null,
		        },
		        title: {
		            text: '',
		        },
		        tooltip: {
		        	pointFormat: '<b>{point.percentage:.1f}%</b>'
		        },
		        plotOptions: {
		            pie: {
		                dataLabels: {
		                    enabled: true,
	                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
		                }
		            }
		        },
			},
			series: [{
	            type: 'pie',
	            data: dataSource
		    }]
	};
	return pie;
}