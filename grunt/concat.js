/*
Projeto: conciliation-webapp
Author/Empresa: Rede
Copyright (C) 2016 Redecard S.A.
*/

'use strict';

module.exports = {
	options: {
		// Replace all 'use strict' statements in the code with a single one at the top
		process: function(src, filepath) {
			return '// Source: ' + filepath + '\n' +
			src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
		},
		banner: '/*! <%= package.name %> - v<%= package.version %> - ' +
		'<%= grunt.template.today("yyyy-mm-dd") %> */',
	},
	dist: {
		src: [
			"WebContent/app/libs/angular.min.js",
			"WebContent/app/libs/angular-mocks.js",
			"WebContent/app/libs/angular-route.min.js",
			"WebContent/app/libs/lodash.min.js",
			"WebContent/app/libs/angular-locale_pt-br.js",
			"WebContent/app/libs/loading-bar.min.js",
			"WebContent/app/libs/angular-cache.min.js",
			"WebContent/app/libs/angular-sanitize.min.js",
			"WebContent/app/libs/angular-scroll.min.js",
			"WebContent/app/libs/angular-animate.min.js",
			"WebContent/app/libs/angular-touch.min.js",
			"WebContent/app/libs/ui-bootstrap-tpls-2.2.0.min.js",
			"WebContent/app/libs/modernizr-2.6.2.min.js",
			"WebContent/app/libs/jquery-1.11.1.min.js",
			"WebContent/app/libs/main.js",
			"WebContent/app/libs/angular-file-upload.min.js",
			"WebContent/app/libs/angular-file-saver.js",
			"WebContent/app/libs/FileSaver.min.js",
			"WebContent/app/libs/blob.js",
			"WebContent/app/libs/angular-resource.min.js",
			"WebContent/app/libs/moment-with-locales.min.js",
			"WebContent/app/libs/moment-timezone.min.js",
			"WebContent/app/libs/Chart.min.js",
			"WebContent/app/libs/angular-chart.min.js",
			"WebContent/app/libs/angularjs-dropdown-multiselect.min.js",
			"WebContent/assets/js/componente/max-size-pagination.js",
			"WebContent/assets/js/componente/chart-utils.js",
			"WebContent/assets/js/bootstrap.min.js",
			"WebContent/assets/js/perfect-scrollbar.min.js",

			"WebContent/app/app.js",
			"WebContent/app/routes.js",

			"WebContent/app/service/dashboard-service.js",
			"WebContent/app/service/login-service.js",
			"WebContent/app/service/transactions-service.js",
			"WebContent/app/service/relatorio-service.js",
			"WebContent/app/service/kaplen-admin-service.js",
			"WebContent/app/service/cache-service.js",
			"WebContent/app/service/integration-service.js",
			"WebContent/app/service/advanced-filter-service.js",
			"WebContent/app/service/calendar-service.js",
			"WebContent/app/service/filters-service.js",
			"WebContent/app/service/receipts-service.js",
			"WebContent/app/service/financial-service.js",
			"WebContent/app/service/movement-summary-service.js",
			"WebContent/app/service/adjust-summary-service.js",
			"WebContent/app/service/transaction-summary-service.js",
			"WebContent/app/service/transaction-conciliation-service.js",
			"WebContent/app/service/transaction-service.js",
			"WebContent/app/service/movement-service.js",
			"WebContent/app/service/adjust-service.js",
			"WebContent/app/service/rc-message-service.js",
			"WebContent/app/service/rc-disclaimer-service.js",
			"WebContent/app/service/modal-service.js",
			"WebContent/app/service/download-service.js",
			"WebContent/app/service/pv-service.js",

			"WebContent/app/controllers/header-controller.js",
			"WebContent/app/controllers/footer-controller.js",

			"WebContent/app/controllers/dashboard-controller.js",
			"WebContent/app/controllers/login-controller.js",
			"WebContent/app/controllers/sales-details-controller.js",
			"WebContent/app/controllers/sales-controller.js",
			"WebContent/app/controllers/sales-conciliated-controller.js",
			"WebContent/app/controllers/sales-conciliated-details-controller.js",
			"WebContent/app/controllers/sales-to-conciliate-controller.js",
			"WebContent/app/controllers/sales-to-conciliate-details-controller.js",
			"WebContent/app/controllers/unprocessed-sales-details-controller.js",
			"WebContent/app/controllers/relatorio-vendas-controller.js",
			"WebContent/app/controllers/relatorio-financeiro-controller.js",
			"WebContent/app/controllers/relatorio-ajustes-controller.js",
			"WebContent/app/controllers/relatorio-chargebacks-controller.js",
			"WebContent/app/controllers/help-controller.js",
			"WebContent/app/controllers/integration-controller.js",
			"WebContent/app/controllers/receipts-controller.js",
			"WebContent/app/controllers/receipts-expected-details-controller.js",
			"WebContent/app/controllers/receipts-forethought-details-controller.js",
			"WebContent/app/controllers/receipts-other-details-controller.js",
			"WebContent/app/controllers/receipts-future-details-controller.js",
			"WebContent/app/controllers/receipts-details-controller.js",
			"WebContent/app/controllers/redirect-controller.js",
			"WebContent/app/controllers/pv-grouping-controller.js",

			"WebContent/app/directives/rc-disclaimer/rc-disclaimer.js",
			"WebContent/app/directives/rc-multiselect/rc-multiselect.js",
			"WebContent/app/directives/rc-datepicker/rc-datepicker.js",
			"WebContent/app/directives/rc-datepicker-v2/rc-datepicker-v2.js",
			"WebContent/app/directives/rc-timeline/rc-timeline.js",
			"WebContent/app/directives/rc-message/rc-message.js",
			"WebContent/app/directives/rc-breadcrumb/rc-breadcrumb.js",
			"WebContent/app/directives/rc-chips/rc-chips.js",
			"WebContent/app/directives/rc-checkbox/rc-checkbox.js",
			"WebContent/app/directives/rc-pagination/rc-pagination.js",
			"WebContent/app/directives/rc-tooltip/rc-tooltip.js",
			"WebContent/app/directives/rc-downloader/rc-downloader.js",
			"WebContent/app/directives/rc-sort/rc-sort.js",
			"WebContent/app/directives/rc-select/rc-select.js",

			"WebContent/app/factories/request-factory.js",
			"WebContent/app/factories/calendar-factory.js",
			"WebContent/app/factories/utils-factory.js",
			"WebContent/app/factories/polling-factory.js",

			"WebContent/app/filters/currency-filter.js",
			"WebContent/app/filters/slugfy-filter.js",
			"WebContent/app/filters/text-filter.js",

			"WebContent/app/libs/videogular.min.js",
			"WebContent/app/libs/vg-controls.min.js",
			"WebContent/app/libs/vg-overlay-play.min.js",
			"WebContent/app/libs/vg-poster.min.js",
			"WebContent/app/libs/vg-buffering.min.js",
			"WebContent/app/config.js",
		],
		dest: "WebContent/app/build.js",
	}
};
