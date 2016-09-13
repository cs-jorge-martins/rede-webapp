function pieChartTiposVendas(dataSource) {
	var pie = {

			options: {
				credits: {
					 enabled: false
				},
				colors: ['#00656e', '#8e3ead'],
		        chart: {
		            plotBackgroundColor: null,
		            plotBorderWidth: 0,
		            plotShadow: false
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
		                showInLegend: false,
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