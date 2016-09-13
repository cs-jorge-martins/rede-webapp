function pieChartSettlementRanking(settlements, values) {
	var pie = {

			 options: {
				 credits: {
					 enabled: false
				},
	            chart: {
	                type: 'bar',
	                width: 936,
		            height: 290
	            },
	            plotOptions: {
	                bar: {
	                	pointPadding: calculeteSizeBar(settlements.length),
	                    dataLabels: {
	                        enabled: true,	                   
		                    formatter: function() {
								return currency(this.y);
	                        }	
	                    }
	                }
	            },
	            tooltip: {
	            	formatter: function() {
	                     return "Loja: " + this.x + '</b><br />Valor Total: ' + currency(this.y);
	            	}             
	            }
	        },
	        xAxis: {
	            categories: settlements
	        },
	        yAxis: {
	        	min:0,
	        	//maxPadding: 0.1,
				title: {
					text: ''
				},
				labels: {
					formatter: function() {
							return noCurrency(this.value);
					}
				}
			},
	        series: [{
	            showInLegend: false,
	            data: values
	        }],
	        title: {
	            text: ''
	        }
	};
	return pie;
}