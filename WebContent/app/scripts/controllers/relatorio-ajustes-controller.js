/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('KaplenWeb.relatorioAjustesController',['ui.bootstrap'])

.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/relatorio/ajustes', {templateUrl: 'app/views/relatorios/ajustes/index.html', controller: 'relatorioAjustesController'});
}])

.controller('relatorioAjustesController', function(menuFactory, $scope, $modal, calendarFactory, $rootScope,
    $window, advancedFilterService, calendarService, AdjustSummaryService){
		//Extensao do serviço para filtro avançado
		angular.extend($scope, advancedFilterService);
		$scope.LoadParamsByFilter();

		//Extensao do serviço para calendario
		angular.extend($scope, calendarService);
		$scope.ResetCalendarService();

		menuFactory.setActiveReportsAdjustments();
		$scope.dateSelected = calendarFactory.getYesterdayDate();
		$scope.totalItensPage = "10";
		$scope.items = [];
		$scope.total = 0;
		$scope.noItensMsg = false;
		$scope.sort = 'date,ASC';
		$scope.exportReport = ExportReport;

		var dateInitialDate = calendarFactory.getMomentOfSpecificDate(calendarFactory.getActualDate());
		$scope.initialDate = calendarFactory.getFirstDayOfSpecificMonth(dateInitialDate.month(), dateInitialDate.year());
		$scope.finalDate = calendarFactory.getLastDayOfSpecificMonth(dateInitialDate.month(), dateInitialDate.year());
		$scope.pageChanged = PageChanged;
		$scope.totalItensPageChanged = TotalItensPageChanged;

		$scope.maxSize = 4;
		$scope.totalItensPage = 10;
        $scope.currentPage = 0;
		$scope.totalItens = 0;
        $scope.sortResults = SortResults;

		Init();

		function Init(){
			$scope.clearFilter = ClearFilter;
			$scope.search = Search;

			GetReport();
		}

		function GetReport() {

            var intCurPage = $scope.currentPage == 0 ? 0 : ($scope.currentPage - 1);

			AdjustSummaryService.ListAdjustSummary({
				currency: 'BRL',
				startDate: calendarFactory.formatDateTimeForService($scope.initialDate),
				endDate: calendarFactory.formatDateTimeForService($scope.finalDate),
				groupBy: 'PAYED_DATE,DESCRIPTION',
                page: intCurPage,
				size: $scope.totalItensPage,
				sort: $scope.sort
			}).then(function(objResponse){
				var objData = objResponse.data.content;
                var objPagination = objResponse.data.page;

				$scope.items = objData;
				$scope.noItensMsg = objData.length ? false : true;
				$scope.totalItens = objPagination.totalElements;
			});
		}

		function ExportReport() {
			AdjustSummaryService.exportReport({
				currency: 'BRL',
				startDate: calendarFactory.formatDateTimeForService($scope.initialDate),
				endDate: calendarFactory.formatDateTimeForService($scope.finalDate),
				groupBy: 'DAY',
				page: ($scope.currentPage - 1),
				size: $scope.totalItensPage
			}).then(function(objResponse) {
				var objData = objResponse.data.content;

				if(objResponse.status == 200) {
					window.open(objData.uri);
				} else {
					// TODO Tratamento de erros
				}
			});
		}

		function ClearFilter() {
			var dateInitialDate = calendarFactory.getMomentOfSpecificDate(calendarFactory.getActualDate());
			$scope.initialDate = calendarFactory.getFirstDayOfSpecificMonth(dateInitialDate.month(), dateInitialDate.year());
			$scope.finalDate = calendarFactory.getLastDayOfSpecificMonth(dateInitialDate.month(), dateInitialDate.year());
		}

		function Search() {
			GetReport();
		}

		function PageChanged() {
			$scope.currentPage = this.currentPage;
			GetReport();
		};

		function TotalItensPageChanged() {
			this.currentPage = $scope.currentPage = 1;
			$scope.totalItensPage = this.totalItensPage;
			GetReport();
		};

		function SortResults(objElem, strKind) {
			$scope.sort = $rootScope.sortResults(objElem, strKind);
			GetReport();
		};

    });
