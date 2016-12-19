/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.relatorioAjustesController',['ui.bootstrap'])

.controller('relatorioAjustesController', function(menuFactory, $scope, calendarFactory, $rootScope,
    $window, advancedFilterService, calendarService, AdjustSummaryService, AdjustService){
		//Extensao do serviço para filtro avançado
		angular.extend($scope, advancedFilterService);
		$scope.LoadParamsByFilter();

		//Extensao do serviço para calendario
		angular.extend($scope, calendarService);
		$scope.ResetCalendarService();

		menuFactory.setActiveReportsAdjustments();
		$scope.dateSelected = calendarFactory.getYesterdayDate();
		$scope.items = [];
		$scope.total = 0;
		$scope.noItensMsg = false;
		$scope.sort = 'payedDate,ASC';
		$scope.exportReport = ExportReport;

		var objInitialDate = calendarFactory.getMomentOfSpecificDate(calendarFactory.getActualDate());
		$scope.initialDate = calendarFactory.getDateFromString(calendarFactory.getFirstDayOfSpecificMonth(objInitialDate.month(), objInitialDate.year()));
		$scope.finalDate = calendarFactory.getDateFromString(calendarFactory.getLastDayOfSpecificMonth(objInitialDate.month(), objInitialDate.year()));
		$scope.pageChanged = PageChanged;
		$scope.totalItensPageChanged = TotalItensPageChanged;

		$scope.maxSize = 4;
		$scope.totalItensPageOptions = [10,20,50];
		$scope.totalItensPage = $scope.totalItensPageOptions[1];
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

			AdjustService.ListAdjusts({
				currency: 'BRL',
				startDate: calendarFactory.formatDateTimeForService($scope.initialDate),
				endDate: calendarFactory.formatDateTimeForService($scope.finalDate),
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
			var objInitialDate = calendarFactory.getMomentOfSpecificDate(calendarFactory.getActualDate());
			$scope.initialDate = calendarFactory.getFirstDayOfSpecificMonth(objInitialDate.month(), objInitialDate.year());
			$scope.finalDate = calendarFactory.getLastDayOfSpecificMonth(objInitialDate.month(), objInitialDate.year());
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
