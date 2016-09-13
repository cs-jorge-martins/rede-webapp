function pieChartRecebimentosVisaoReport(dataSource) {
	var pie = {

			options: {
				credits: {
					 enabled: false
				},
				colors: ['#2dcc6f','#f29811','#bd3c2d'],
		        chart: {
		            plotBorderWidth: 0,
		            plotShadow: false,
		            width: 936,
		            height: 280,
		            margin:40
		        },
		        title: {
		            text: '',
		        },
		        tooltip: {
		            pointFormat: ''
		        },
		        plotOptions: {
		            pie: {
		                dataLabels: {
		                    enabled: true,
		                    format: '{point.percentage:.1f} %',
		                },
		                innerSize: 170,
	                    depth: 45,
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