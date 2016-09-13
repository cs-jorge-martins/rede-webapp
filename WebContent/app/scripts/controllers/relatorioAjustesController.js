angular.module('KaplenWeb.relatorioAjustesController',['ui.bootstrap'])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	$routeProvider.when('/relatorio/ajustes', {templateUrl: 'app/views/relatorios/ajustes/index.html', controller: 'relatorioAjustesController'});
}])

.controller('relatorioAjustesController', function(menuFactory, $scope, $modal, calendarFactory, $rootScope,
    relatorioService, installmentsService, $window, advancedFilterService, calendarService, AdjustSummaryService){
		//Extensao do serviço para filtro avançado
		angular.extend($scope, advancedFilterService);
		$scope.loadParansByFilter();

		//Extensao do serviço para calendario
		angular.extend($scope, calendarService);
		$scope.resetCalendarService();

		menuFactory.setActiveReportsAdjustments();
		$scope.dateSelected = calendarFactory.getYesterdayDate();
		$scope.totalItensPage = "10";
		$scope.items = [];
		$scope.total = 0;
		$scope.noItensMsg = false;

		$scope.exportReport = exportReport;

		var initialDate = calendarFactory.getMomentOfSpecificDate(calendarFactory.getActualDate());
		$scope.initialDate = calendarFactory.getFirstDayOfSpecificMonth(initialDate.month(), initialDate.year());
		$scope.finalDate = calendarFactory.getLastDayOfSpecificMonth(initialDate.month(), initialDate.year());
		$scope.pageChanged = pageChanged;
		$scope.totalItensPageChanged = totalItensPageChanged;

		$scope.maxSize = 4;
		$scope.totalItensPage = 10;
        $scope.currentPage = 0;
		$scope.totalItens = 0;

		init();

		function init(){
			getReport();

			$scope.clearFilter = clearFilter;
			$scope.search = search;
		}

		function getReport() {
            
            var curPage = $scope.currentPage == 0 ? 0 : ($scope.currentPage - 1);

			AdjustSummaryService.listAdjustSummary({
				currency: 'BRL',
				startDate: calendarFactory.formatDateTimeForService($scope.initialDate),
				endDate: calendarFactory.formatDateTimeForService($scope.finalDate),
				groupBy: 'PAYED_DATE,DESCRIPTION',
                page: curPage,
				size: $scope.totalItensPage
			}).then(function(response){
				var data = response.data.content;
                var pagination = response.data.page;
                console.log(response);

				$scope.items = data;
				$scope.noItensMsg = data.length ? false : true;
				$scope.totalItens = pagination.totalElements;
			});
		}

		function exportReport() {
			AdjustSummaryService.exportReport({
				currency: 'BRL',
				startDate: calendarFactory.formatDateTimeForService($scope.initialDate),
				endDate: calendarFactory.formatDateTimeForService($scope.finalDate),
				groupBy: 'DAY',
				page: ($scope.currentPage - 1),
				size: $scope.totalItensPage
			}).then(function(response) {
				var data = response.data.content;
                var pagination = response.data.page;

				if(response.status == 200) {
					window.open(data.uri);
				} else {
					// TODO Tratamento de erros
				}
			});
		}

		function clearFilter() {
			var initialDate = calendarFactory.getMomentOfSpecificDate(calendarFactory.getActualDate());
			$scope.initialDate = calendarFactory.getFirstDayOfSpecificMonth(initialDate.month(), initialDate.year());
			$scope.finalDate = calendarFactory.getLastDayOfSpecificMonth(initialDate.month(), initialDate.year());
		}

		function search() {
			getReport();
		}

		function pageChanged() {
			$scope.currentPage = this.currentPage;
			getReport();
		};

		function totalItensPageChanged() {
			this.currentPage = $scope.currentPage = 1;
			$scope.totalItensPage = this.totalItensPage;
			getReport();
		};
    });
