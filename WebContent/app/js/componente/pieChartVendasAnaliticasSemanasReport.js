function pieChartVendasAnaliticasSemanasReport(initialDate, finalDate, proportionOfWeeks, dataTypeText, dataSource) {
	var pie = {
	        credits : {
			  enabled : false
			},
			options: {
				chart: {
		            type: 'line',
		            width:928,
					height: 285
		        },
		        title: {
		            text: false
		        },
		        xAxis: {  
		            tickInterval:  proportionOfWeeks * 24 * 3600 * 1000,
			        type: 'datetime',
		            startOnTick: true,
		            startOfWeek: 0,
			        labels: {
			            format: '{value:%d/%m}',
			            rotation: -45,
			            y: 30,
			            align: 'center'
			        },
		            min: initialDate,
		            max: finalDate
			    },
		        yAxis: {
		        	min: 0,
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
		            series: {
		                pointStart: initialDate,
		                pointInterval: proportionOfWeeks * 24 * 3600 * 1000
		            }
		        }
			},
	        series: dataSource
	};
	return pie;
}