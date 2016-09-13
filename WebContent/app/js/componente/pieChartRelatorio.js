function pieChartRelatorio(dataSource, name) {
	var pie = {

			options: {
				credits: {
					 enabled: false
				},
				colors: ['#60ace6','#3d4f65','#f97368','#00CD66','#e4cd2f','#EE3B3B'],
		        chart: {
		            plotBackgroundColor: null,
		            plotBorderWidth: 0,
		            plotShadow: false
		        },
		        title: {
		            text: 'Faturamento por '+ name,
		        },
		        tooltip: {
		            pointFormat: ''
		        },
		        legend: {
	                layout: 'vertical',
	                align: 'right',
	                verticalAlign: 'middle',
	                borderWidth: 0
	            },
		        plotOptions: {
		            pie: {
		                dataLabels: {
		                    enabled: true,
		                    format: '{point.name}: {point.percentage:.1f} %',
		                },
		                showInLegend: true,
		                allowPointSelect: true,
		                slicedOffset: 25,
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