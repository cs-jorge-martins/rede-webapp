/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */



var chartUtils = window.chartUtil || {};

/**
 * proxy para traduzir dados vindos da API, do modelo do hicharts para o charts.js
 */
chartUtils.Proxy = function( objDataSource ) {
	var objChart = {
		labels: [],
		series: [],
		data: []
	};

	for(x in objDataSource) {
		if(typeof objDataSource[x] === 'object'){
			objChart.series.push(objDataSource[x].name);
			objChart.data.push(objDataSource[x].data);

			if(objDataSource[x].data.length > objChart.labels.length){
				objChart.labels = [];
				for(y in objDataSource[x].data) {
					objChart.labels.push(y);
				}
			}
		} else {
			break;
		}
	}

	return objChart;
};

chartUtils.Tooltip = function(tooltip) {
	var divTooltipEl = jQuery('#chartjs-tooltip');

   if (!tooltip) {
	   divTooltipEl.css({
		   opacity: 0
	   });
	   return;
   }

   divTooltipEl.removeClass('above below');
   divTooltipEl.addClass(tooltip.yAlign);

   // split out the label and value and make your own tooltip here
   var arrParts = tooltip.text.split(":");
   var strInnerHtml = '<span>' + arrParts[0].trim() + '</span> : <span><b>' + arrParts[1].trim() + '</b></span>';
   divTooltipEl.html(strInnerHtml);

   divTooltipEl.css({
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

		var fltFormatted = value.toFixed(2);
		var objTmp;

		objTmp = fltFormatted.split('.');
		objTmp[0] = objTmp[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
		fltFormatted = objTmp.join(',');
		fltFormatted = "R$ " + fltFormatted;

		return fltFormatted;
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
