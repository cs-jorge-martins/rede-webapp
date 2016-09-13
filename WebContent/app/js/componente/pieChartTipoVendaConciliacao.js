function pieChartTipoVendaConciliacao(dataSource) {
	var pie = {

			options: {
				credits: {
					 enabled: false
				},
				colors: ['#2dcc6f','#f29811','#bd3c2d'],
		        chart: {
		            plotBorderWidth: 0,
		            plotShadow: false,
		            width: 468,
		            height: 280,
		            margin:30
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
		                innerSize: 90,
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
