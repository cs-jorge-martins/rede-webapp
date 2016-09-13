function pieChartVendasAnaliticasDiasReport(dataTypeText, dataSource) {
	var pie = {
			credits: {
				 enabled: false
			},
			options: {
				chart: {
		            type: 'spline',
		            width: 938,
					height: 285
		        },
		        title: {
		            text: ''
		        },
		        subtitle: {
		            text: ''
		        },
		        xAxis: {
		        	 type: 'datetime',
		        	 labels: {
		                 formatter: function () {
		                     return Highcharts.dateFormat('%d/%m', this.value);
		                 },
		                 dateTimeLabelFormats: {
		                     minute: '',
		                     hour: '',
		                     day: '%e',
		                     week: '',
		                     month: '%m',
		                     year: ''
		                 }
		             }
		        },
		        yAxis: {
		        	min:0,
		            title: {
		                text: dataTypeText
		            },
		            labels: {
		                formatter: function () {	  
		                	if(dataTypeText == "Valores"){
		                		return currency(this.value);	
		                	}else{
		                		return this.value;	
		                	}
		                }
		            }
		            
		        },
		        tooltip: {
		        	formatter: function() {
		                   return this.series.name + '<br />' + Highcharts.dateFormat('%d/%m/%Y', this.x) + '<br />Valor: ' + currency(this.y);
		            }
		        },
		        plotOptions: {
		            spline: {
		                marker: {
		                    radius: 4,
		                    lineColor: '#666666',
		                    lineWidth: 1
		                }
		            },
		           
		        }
		    },
			
	        series: dataSource
	};
	return pie;
}