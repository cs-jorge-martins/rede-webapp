/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('KaplenWeb.dashboardController',[])

.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/home', {templateUrl: 'app/views/dashboard.html', controller: 'dashboardController'});
	$routeProvider.otherwise({ redirectTo: '/home'} );
}])

.controller('dashboardController', function($scope, $modal, $rootScope, menuFactory, $window,
	calendarFactory, $location, dashboardService, cacheService, TransactionConciliationService, TransactionSummaryService){

	menuFactory.setActiveDashboard();

	$scope.firstDayOfCurrentMonth = calendarFactory.getFirstDayOfMonthForDashboard();
	$scope.now = calendarFactory.getActualDateForDashboard();
	$scope.actualMonth = calendarFactory.getNameOfMonthAndYearForDashboard();

	$scope.sales = Sales;

	SetUpDashboard();

	function SetUpDashboard(){
		$scope.actualPeriod = {};
		$scope.lastPeriod = {};
		$scope.taxesValues ={};
		$scope.dashboardComparativeValuesDTO = {};
		$scope.cancellationValues = {};

		$scope.dashboardComparativeValuesDTO.sumOfQuantitiesTransactions = 0;
		//	$scope.dashboardComparativeValuesDTO.percentOfQuantityTransactionsBetweenMonths = 0;
		$scope.dashboardComparativeValuesDTO.sumOfQuantitiesTransactionsLastMonth = 0;
		$scope.dashboardComparativeValuesDTO.sumOfTotalsAmountTransactions = 0;
		$scope.percentOfQuantityTransactionsBetweenMonths = 0;
		$scope.percentOfTotalsAmountTransactionsBetweenMonths = 0;
		//	$scope.dashboardComparativeValuesDTO.percentOfTotalsAmountTransactionsBetweenMonths = 0;
		$scope.dashboardComparativeValuesDTO.sumOfTotalsAmountTransactionsLastMonth = 0;
		$scope.dashboardComparativeValuesDTO.totalPayedPeriod = 0;
		$scope.dashboardComparativeValuesDTO.percentOfTotalPayedBetweenMonths = 0;
		$scope.dashboardComparativeValuesDTO.totalPayedPeriodLastMonth = 0;
		$scope.dashboardComparativeValuesDTO.ticketAverage = 0;
		$scope.dashboardComparativeValuesDTO.percentOfTicketAverageBetweenMonths = 0;
		$scope.dashboardComparativeValuesDTO.ticketAverageLastMonth = 0;
		$scope.percentOfTotalPayedBetweenMonths = 0;
		$scope.percentOfTicketAverageBetweenMonths = 0;

		$scope.cancellationValues.totalAmountTransactions = 0;
		$scope.cancellationValues.totalAmountCancellations = 0;
		$scope.cancellationValues.totalAmountChargeback = 0;

		$scope.actualPeriod.totalConcilied = 0;
		$scope.actualPeriod.totalToReconcile = 0;
		$scope.actualPeriod.totalToProcess = 0;

		$scope.taxesValues.totalTaxaAdm = 0;
		$scope.taxesValues.totalDuplicate = 0;
		$scope.taxesValues.totalConectivityTaxes = 0;

		$scope.transactionSummaryBoxPrevMonth = {};
		$scope.transactionSummaryBoxPrevMonth.quantity = 0;
		$scope.transactionSummaryBoxCurrentMonth = {};
		$scope.transactionSummaryBoxCurrentMonth.amount = 0;
		$scope.movementSummaryBoxCurrentMonth = {};
		$scope.movementSummaryBoxCurrentMonth.payedAmount = 0;
		$scope.ticketAveragePrevMonth = 0;

		$scope.dateSelected = calendarFactory.getYesterdayDate();

		if($window.sessionStorage.tour) {
			ShowVideoModal();
			delete $window.sessionStorage.tour;
		}

		SetTransactionConciliationCalendar();
		SetTransactionSummaryLineChart();
	};

	SetUp();

 	function SetUp() {
		var today = new Date();

		// Se primeiro dia do mês exibe o anterior
		if(today.getDate() == 1) {
			today.setDate(today.getDate()-1);
		}

		var day = today.getDate();
		var month = today.getMonth();
		var year = today.getFullYear();

		$scope.currentMonthPerid = new Period();
		$scope.currentMonthPerid.firstDate = calendarFactory.formatDateForService(calendarFactory.getFirstDayOfMonthForDashboard());
		$scope.currentMonthPerid.lastDate = calendarFactory.formatDateForService(calendarFactory.getActualDayOfCurrentMonthForDashboard());

		$scope.currentMonthPeridMovement = new Period();
		$scope.currentMonthPeridMovement.firstDate = calendarFactory.formatDateForService(calendarFactory.getFirstDayOfMonthForDashboard());
		$scope.currentMonthPeridMovement.lastDate = calendarFactory.formatDateForService(calendarFactory.getActualDate());

		$scope.lastMonthPerid = new Period();
		$scope.lastMonthPerid.firstDate = calendarFactory.formatDateForService(calendarFactory.getFirstDayOfLastMonthForDashboard());
		$scope.lastMonthPerid.lastDate = calendarFactory.formatDateForService(calendarFactory.getLastDayOfLastMonthForDashboard());

		SetTransactionSummaryBox();
		SetMovementSummaryBox();
		SetNplicateTransactionBox();
		SetTransactionConciliationBox();
	}

	/********************************* TRANSACTION SUMMARY BOX *************************************/
	function SetTransactionSummaryBox(){
		var transactionSummaryFilterCurrentMonth = {};
		transactionSummaryFilterCurrentMonth.currency =  $rootScope.currency;
		transactionSummaryFilterCurrentMonth.startDate = $scope.currentMonthPerid.firstDate;
		transactionSummaryFilterCurrentMonth.endDate = $scope.currentMonthPerid.lastDate;
		transactionSummaryFilterCurrentMonth.conciliationStatus = 'TO_CONCILIE,CONCILIED';
		// Consulta do mês corrente
		dashboardService.GetTransactionSummaryBox(transactionSummaryFilterCurrentMonth).then(function(item){
			item = item.data.content;
			$scope.transactionSummaryBoxCurrentMonth = {};

			if (item !== undefined ){
				if(item.length > 0){
					$scope.transactionSummaryBoxCurrentMonth =  item[0];
				}
			}

			var transactionSummaryFilterPrevMonth = {};
			transactionSummaryFilterPrevMonth.currency =  $rootScope.currency;
			transactionSummaryFilterPrevMonth.startDate = $scope.lastMonthPerid.firstDate;
			transactionSummaryFilterPrevMonth.endDate = $scope.lastMonthPerid.lastDate;

			// Consulta do mes anterior
			dashboardService.GetTransactionSummaryBox(transactionSummaryFilterPrevMonth).then(function(item){
				item = item.data.content;
				$scope.transactionSummaryBoxPrevMonth = {};

				if (item !== undefined ){
					if(item.length > 0){
						$scope.transactionSummaryBoxPrevMonth =  item[0];
					}
				}

				// Calculo de percentuais
				$scope.percentOfQuantityTransactionsBetweenMonths = (($scope.transactionSummaryBoxCurrentMonth.quantity - $scope.transactionSummaryBoxPrevMonth.quantity) * 100) / $scope.transactionSummaryBoxPrevMonth.quantity | 0;
				$scope.percentOfTotalsAmountTransactionsBetweenMonths = (($scope.transactionSummaryBoxCurrentMonth.amount - $scope.transactionSummaryBoxPrevMonth.amount) * 100) / $scope.transactionSummaryBoxPrevMonth.amount | 0;

				// Calculo ticket médio
				if($scope.transactionSummaryBoxCurrentMonth.quantity !== 0){
					$scope.ticketAverageCurrentMonth = ($scope.transactionSummaryBoxCurrentMonth.amount/$scope.transactionSummaryBoxCurrentMonth.quantity);
				}else{
					$scope.ticketAverageCurrentMonth = 0;
				}

				if($scope.transactionSummaryBoxPrevMonth.quantity !== 0){
					$scope.ticketAveragePrevMonth = ($scope.transactionSummaryBoxPrevMonth.amount/$scope.transactionSummaryBoxPrevMonth.quantity);
				}else{
					$scope.ticketAveragePrevMonth = 0;
				}

				$scope.percentOfTicketAverageBetweenMonths = ([($scope.ticketAverageCurrentMonth - $scope.ticketAveragePrevMonth) * 100]/ $scope.ticketAveragePrevMonth) | 0;

				$scope.totalTaxaAdm = ($scope.transactionSummaryBoxCurrentMonth.amount - $scope.transactionSummaryBoxCurrentMonth.net);

			});
		});
	};

	/********************************* MOVEMENT SUMMARY BOX *************************************/
	function SetMovementSummaryBox(){

		var movementSummaryBoxCurrentMonthFilter = {};
		movementSummaryBoxCurrentMonthFilter.currency = $rootScope.currency;
		movementSummaryBoxCurrentMonthFilter.startDate = $scope.currentMonthPeridMovement.firstDate;
		movementSummaryBoxCurrentMonthFilter.endDate = $scope.currentMonthPeridMovement.lastDate;
		movementSummaryBoxCurrentMonthFilter.status = 'FORETHOUGHT,RECEIVED';

		dashboardService.GetMovementSummary(movementSummaryBoxCurrentMonthFilter).then(function(item){
			item = item.data.content;
			$scope.movementSummaryBoxCurrentMonth = {};

			if(item.length > 0){
				$scope.movementSummaryBoxCurrentMonth = item[0];
			}

			var movementSummaryBoxCurrentPrevFilter = {};
			movementSummaryBoxCurrentPrevFilter.currency = $rootScope.currency;
			movementSummaryBoxCurrentPrevFilter.startDate = $scope.lastMonthPerid.firstDate;
			movementSummaryBoxCurrentPrevFilter.endDate = $scope.lastMonthPerid.lastDate;
			movementSummaryBoxCurrentPrevFilter.status = 'FORETHOUGHT,RECEIVED';


			dashboardService.GetMovementSummary(movementSummaryBoxCurrentPrevFilter).then(function(item){
				item = item.data.content;
				$scope.movementionSummaryBoxPrevMonth = {};

				if(item.length > 0){
					$scope.movementionSummaryBoxPrevMonth = item[0];
				}

				$scope.percentOfTotalPayedBetweenMonths = ([($scope.movementSummaryBoxCurrentMonth.payedAmount - $scope.movementionSummaryBoxPrevMonth.payedAmount) * 100]/ $scope.movementionSummaryBoxPrevMonth.payedAmount) | 0;
			});
		});
	}


	/********************************* NPLICATE SUMMARY BOX *************************************/
	function SetNplicateTransactionBox(){
		var transactionSummaryNplicate = {};
		transactionSummaryNplicate.currency =  $rootScope.currency;
		transactionSummaryNplicate.startDate = $scope.currentMonthPerid.firstDate;
		transactionSummaryNplicate.endDate = $scope.currentMonthPerid.lastDate;

		dashboardService.GetNplicateTransactionSummary(transactionSummaryNplicate).then(function(response){
			var item = response.data.content;
			$scope.totalDuplicate = item[0].amount;
		});
	}

	/***************************************** TRANSACTION SUMMARY LINE CHART ******************************************/
	function SetTransactionSummaryLineChart(){

		var date = $scope.dateSelected;
		var actualMonthData = [];
		var lastMonthData = [];

		var lastDayFlag = calendarFactory.getLastDayOfMonth(date, true);

		var chartData = {
			labels: [],
			series: [], // janeiro, feveriro
			data: [] // [ [janeiro data], [fevereiro data]]
		};


		var filter = {
			currency: 'BRL',
			startDate: calendarFactory.formatDateForService(calendarFactory.getFirstDayOfMonth(date)),
			endDate: calendarFactory.formatDateForService(calendarFactory.getLastDayOfMonth(date)),
			groupBy: 'DAY',
			size: 31,
			conciliationStatus: 'TO_CONCILIE,CONCILIED'
		};

		// actual month data
		TransactionSummaryService.ListTransactionSummaryByFilter(filter).then(function(response){
			var response = response.data.content;

			for(var item in response){
				if(typeof response[item] === 'object') {
					actualMonthData.push(response[item]);
				} else {
					break;
				}
			}


			var lastMonthDate = calendarFactory.addMonthsToDate(date, -1);
			filter.startDate = calendarFactory.formatDateForService(calendarFactory.getFirstDayOfMonth(lastMonthDate));
			filter.endDate = calendarFactory.formatDateForService(calendarFactory.getLastDayOfMonth(lastMonthDate));

			if(lastDayFlag < calendarFactory.getLastDayOfMonth(lastMonthDate, true)){
				lastDayFlag = calendarFactory.getLastDayOfMonth(lastMonthDate, true);
			}

			for(var day = 1; day < lastDayFlag+1; day++) {
				chartData.labels.push(day);
			}

			chartData.series.push(calendarFactory.getNameOfMonth(date));
			chartData.data.push(ProccessChartDays(actualMonthData, true));

			// last month data
			TransactionSummaryService.ListTransactionSummaryByFilter(filter).then(function(response){
				var response = response.data.content;

				for(var item in response){
					if(typeof response[item] === 'object') {
						lastMonthData.push(response[item]);
					} else {
						break;
					}
				}

				chartData.series.push(calendarFactory.getNameOfMonth(lastMonthDate));
				chartData.data.push(ProccessChartDays(lastMonthData));

				$scope.chartjs = chartData;
				$scope.chartOptions = chartUtils.Options.vendas;

			}).catch(function(error){
			});

		}).catch(function(error){
		});

	}

	function ProccessChartDays(data, isCurrentMonth){
		var chartDays = [];

		if(data.length){
			var dayIndex = parseInt(data[data.length - 1].date.split('-')[2]);

			for(var x = 0; x < dayIndex; x++){
				chartDays.push(0);
			}

			for(item in data) {
				var itemDay = parseInt(data[item].date.split('-')[2]);
				chartDays[itemDay - 1] = data[item].amount;
			}

		}

		if(isCurrentMonth) {
			var currentDay = (new Date()).getDate();

			if(chartDays.length < currentDay) {
				var index = chartDays.length;
				for (index; index < currentDay; index++) {
					chartDays.push(0);
				}
			}
		}

		return chartDays;
	}

	/***************************************** TRANSACTION CONCILIATION CALENDAR *******************************************/

	function SetTransactionConciliationCalendar(){

		var date = $scope.dateSelected;

		var firstDayOfMonth = calendarFactory.getFirstDayOfMonth(date);
		var lastDayOfMonth = calendarFactory.getLastDayOfMonth(date);

		var days = [];
		var weeks = [];
		var totalDays = calendarFactory.getLastDayOfMonth(date, true) - 1;
		var firstWeekDay = calendarFactory.getDayOfWeek(firstDayOfMonth);

		for(var x = 0; x < firstWeekDay; x++) {
			days.push({
				date: '',
				toProcess: false,
				toReconcile: false,
				concilied: false,
				oneItem: false
			});
		}

		for(var day = 0; day <= totalDays; day++) {
			days.push({
				date: day+1,
				toProcess: false,
				toReconcile: false,
				concilied: false,
				oneItem: false
			});
		}

		while(days.length) {
			weeks.push(days.splice(0,7));
		}

		$scope.weeks = weeks;
		$scope.calendarMonth = calendarFactory.getNameOfMonth(date);

		TransactionConciliationService.ListTransactionConciliationByFilter({
			currency: 'BRL',
			startDate: calendarFactory.formatDateForService(firstDayOfMonth),
			endDate: calendarFactory.formatDateForService(lastDayOfMonth),
			cardProductIds: $scope.productsSelected,
			shopIds: $scope.settlementsSelected,
			groupBy: 'DAY',
			size: 31,
			page: 0
		}).then(function(data){
			data = data.data.content;

			var days = [];

			for(var item in data){
				if(typeof data[item] === 'object') {
					days.push(data[item]);
				} else {
					break;
				}
			}

			for(day in days) {
				var itemDay = parseInt(days[day].date.split('-')[2]);
				var daysOnWeek = 7;
				var index = (itemDay + firstWeekDay) - 1;
				var weekIndex = Math.floor(index / daysOnWeek);
				var week = weeks[weekIndex];

				for(x in week) {
					if(week[x].date === itemDay) {

						var oneItemFlag = Boolean(days[day].transctionToConcilieQuantity) + Boolean(days[day].transctionUnprocessedQuantity) + Boolean(days[day].transctionConciliedQuantity);

						week[x].toProcess = Boolean(days[day].transctionUnprocessedQuantity) | false;
						week[x].toReconcile = Boolean(days[day].transctionToConcilieQuantity) | false;
						week[x].concilied = Boolean(days[day].transctionConciliedQuantity) | false;

						if(oneItemFlag > 1) {
							week[x].oneItem = false;
						} else {
							week[x].oneItem = true;
						}
					}
				}
			}
		});
	}

	/***************************************** TRANSACTION CONCILIATION BOX *******************************************/

	function SetTransactionConciliationBox(){

		var transactionConciliationFilter = {};
		transactionConciliationFilter.currency = $rootScope.currency;
		transactionConciliationFilter.startDate = $scope.currentMonthPerid.firstDate;
		transactionConciliationFilter.endDate = $scope.currentMonthPerid.lastDate;

		dashboardService.GetTransactionConciliationBox(transactionConciliationFilter).then(function(item){
			item = item.data.content;
			$scope.transactionConciliationBox = {};

			if (item !== undefined ){
				$scope.transactionConciliationBox.transctionToConcilieQuantity = item[0].transctionToConcilieQuantity;
				$scope.transactionConciliationBox.transctionConciliedQuantity = item[0].transctionConciliedQuantity;
				$scope.transactionConciliationBox.transctionUnprocessedQuantity = item[0].transctionUnprocessedQuantity;
			}
		});
	}

	function Sales(day) {
		if(day){
			day = day < 10 ? 0 + String(day) : day;
			var date = $scope.dateSelected;
			date = date.split('/');
			date[0] = day;
			date = date.join('/');
			$rootScope.salesFromDashDate = date;
			$location.path('/sales');
		}
	}

	function Period(){
		this.firstDate;
		this.lastDate;
	}

	function ShowVideoModal() {
		var modalInstance = $modal.open({
			templateUrl: 'video.html',
			controller: function ($scope, $modalInstance, $sce) {
				$scope.video = {
					sources: [
						{src: $sce.trustAsResourceUrl("http://dev-conciliation-webapp.s3-website-us-east-1.amazonaws.com/app/videos/video-treinamento.mp4"), type: "video/mp4"},
						{src: $sce.trustAsResourceUrl("http://dev-conciliation-webapp.s3-website-us-east-1.amazonaws.com/app/videos/video-treinamento.webm"), type: "video/webm"},
						{src: $sce.trustAsResourceUrl("http://dev-conciliation-webapp.s3-website-us-east-1.amazonaws.com/app/videos/video-treinamento.ogg"), type: "video/ogg"}
					],
					theme: "app/css/videogular.min.css",
					plugins: {
						poster: "/app/img/videoPoster.jpg",
						controls: {
							autoHide: true,
							autoHideTime: 1000
						}
					}
				};

				$scope.ok = Ok;
				$scope.cancel = Cancel;

				function Ok(){
					$modalInstance.close($scope.selected.item);
				}

				function Cancel(){
					$modalInstance.dismiss('cancel');
				}
			}
		});

	}
});
