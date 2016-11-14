/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */



var chartUtils = window.chartUtil || {};

/**
 * proxy para traduzir dados vindos da API, do modelo do hicharts para o charts.js
 */
chartUtils.Proxy = function( dataSource ) {
	var chart = {
		labels: [],
		series: [],
		data: []
	};

	for(x in dataSource) {
		if(typeof dataSource[x] === 'object'){
			chart.series.push(dataSource[x].name);
			chart.data.push(dataSource[x].data);

			if(dataSource[x].data.length > chart.labels.length){
				chart.labels = [];
				for(y in dataSource[x].data) {
					chart.labels.push(y);
				}
			}
		} else {
			break;
		}
	}

	return chart;
};

chartUtils.Tooltip = function(tooltip) {
	var tooltipEl = jQuery('#chartjs-tooltip');

   if (!tooltip) {
	   tooltipEl.css({
		   opacity: 0
	   });
	   return;
   }

   tooltipEl.removeClass('above below');
   tooltipEl.addClass(tooltip.yAlign);

   // split out the label and value and make your own tooltip here
   var parts = tooltip.text.split(":");
   var innerHtml = '<span>' + parts[0].trim() + '</span> : <span><b>' + parts[1].trim() + '</b></span>';
   tooltipEl.html(innerHtml);

   tooltipEl.css({
	   opacity: 1,
	   left: tooltip.chart.canvas.offsetLeft + tooltip.x + 'px',
	   top: tooltip.chart.canvas.offsetTop + tooltip.y + 'px',
	   fontFamily: tooltip.fontFamily,
	   fontSize: tooltip.fontSize,
	   fontStyle: tooltip.fontStyle,
   });
};

chartUtils.Formatters = {
	currency: function( value ) {

		var formatted = value.toFixed(2);
		var tmp;

		tmp = formatted.split('.');
		tmp[0] = tmp[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
		formatted = tmp.join(',');
		formatted = "R$ " + formatted;

		return formatted;
	}
};

chartUtils.Options = {
	vendas: {
		scaleShowVerticalLines: false,
		bezierCurve : false,
		datasetFill : false,
		pointHitDetectionRadius : 5,
		scaleLabel: '<%="R$ " + value%>',
		scaleFontSize: 11,
		tooltipYPadding: 8,
		tooltipXPadding: 8,
		tooltipFontSize: 12,
		tooltipTitleFontSize: 13,
		multiTooltipTemplate: '<%= datasetLabel + ": " + chartUtils.Formatters.currency(value) %>'
	},
	relatorioSintetico: {
		scaleFontSize: 11,
		tooltipYPadding: 8,
		tooltipXPadding: 8,
		tooltipFontSize: 12,
		tooltipTitleFontSize: 13,
		tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %> %"
	}
};
