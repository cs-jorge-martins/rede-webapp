function pieChartOperadora(dataValores, dataDiferencaValores, categories) {
	var pie = {
			options: {
				credits: {
					 enabled: false
				},
	            chart: {
	                type: 'column',
	                width: 80 * (categories.length + 0.5),
	                height: 280
	            },
	            
	            xAxis: {
		            categories: categories ,
		            labels:{
		            	style: {
		            		fontWeight: 'bold',
		                    color: 'black',
		                    fontSize: 11
		                }
		            }
	            },
	            
	            yAxis: {
	            	min: 0,
		            title: {
		                text: ''
		            },
			        stackLabels: {
			        	enabled: true,
			            	style: {
			            		fontWeight: 'bold',
			                    color: 'black',
			                    fontSize:15
			                },
			            formatter: function() {
			            	if(this.axis.series[1].yData[this.x] == 100){
			            		return (this.axis.series[1].yData[this.x]) + '%';
			            	}
			            	
			            	return (this.axis.series[1].yData[this.x] / this.total * 100).toPrecision(3) + '%';
			            }
	            },
	            
	            labels: {
	                enabled: false
	            },
	            
	            gridLineWidth: 0,
	                lineWidth: 0,
	                minorGridLineWidth: 0,
	                lineColor: 'transparent',
	                minorTickLength: 0,
	                tickLength: 0,
	            },  
	            
	            tooltip: {
	               enabled: false
	            },
	            
	            plotOptions: {
	                column: {
	                    stacking: 'normal',
	                }
	            },
	            
	            legend: {
	            	enabled: false
	            },
	        },
	        
	        title: {
	            text: ''
	        },       
	        series: [{
	            name: '',
	            data: dataDiferencaValores,
	            color:'#e6e6e6'
	        }, {
	            name: '',
	            data: dataValores
	        }]
	};
	return pie;
}