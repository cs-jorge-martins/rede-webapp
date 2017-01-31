/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.dashboardController',[])

.controller('dashboardController', function($scope, $uibModal, $rootScope, menuFactory, $window,
	calendarFactory, $location, dashboardService, cacheService, TransactionConciliationService, TransactionSummaryService, RcDisclaimerService,
	$httpParamSerializer){

	menuFactory.setActiveDashboard();

	$scope.now = calendarFactory.getActualDateForDashboard();

	$scope.currentPeriodStartDateDay = calendarFactory.getDayOfMonth(calendarFactory.getFirstDayOfMonth());
	$scope.currentPeriodEndDateDay = calendarFactory.getDayOfMonth(calendarFactory.getActualDayOfCurrentMonthForDashboard());
	$scope.currentPeriodStartDateMonth = calendarFactory.getMonthNameOfDate(calendarFactory.getActualDayOfCurrentMonthForDashboard());
	$scope.currentPeriodStartDateYear = calendarFactory.getYearOfDate(calendarFactory.getActualDayOfCurrentMonthForDashboard());

	$scope.prevPeriodStartDateDay = calendarFactory.getDayOfMonth(calendarFactory.getFirstDayOfLastMonthForDashboard());
	$scope.prevPeriodEndDateDay = calendarFactory.getDayOfMonth(calendarFactory.getActualDayOfLastMonthForDashboard());
	$scope.prevPeriodStartDateMonth = calendarFactory.getMonthNameOfDate(calendarFactory.getFirstDayOfLastMonthForDashboard());
	$scope.prevPeriodStartDateYear = calendarFactory.getYearOfDate(calendarFactory.getFirstDayOfLastMonthForDashboard());

	$scope.prevPeriodEndDateDayMovement = calendarFactory.getDayOfMonth(calendarFactory.getActualDateOfLastMonth());

	$scope.sales = Sales;

	SetUpDashboard();

	function SetUpDashboard(){
		$scope.actualPeriod = {};
		$scope.lastPeriod = {};
		$scope.taxesValues ={};
		$scope.dashboardComparativeValuesDTO = {};
		$scope.cancellationValues = {};

		$scope.dashboardComparativeValuesDTO.sumOfQuantitiesTransactions = 0;
		$scope.dashboardComparativeValuesDTO.sumOfQuantitiesTransactionsLastMonth = 0;
		$scope.dashboardComparativeValuesDTO.sumOfTotalsAmountTransactions = 0;
		$scope.percentOfQuantityTransactionsBetweenMonths = 0;
		$scope.percentOfTotalsAmountTransactionsBetweenMonths = 0;
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
		var objToday = new Date();

		// Se primeiro dia do mês exibe o anterior
		if(objToday.getDate() == 1) {
			objToday.setDate(objToday.getDate()-1);
		}

		$scope.currentMonthPerid = new Period();
		$scope.currentMonthPerid.firstDate = calendarFactory.formatDateForService(calendarFactory.getFirstDayOfMonthForDashboard());
		$scope.currentMonthPerid.lastDate = calendarFactory.formatDateForService(calendarFactory.getActualDayOfCurrentMonthForDashboard());

		$scope.currentMonthPeridMovement = new Period();
		$scope.currentMonthPeridMovement.firstDate = calendarFactory.formatDateForService(calendarFactory.getFirstDayOfMonthForDashboard());
		$scope.currentMonthPeridMovement.lastDate = calendarFactory.formatDateForService(calendarFactory.getActualDate());

		$scope.lastMonthPerid = new Period();
		$scope.lastMonthPerid.firstDate = calendarFactory.formatDateForService(calendarFactory.getFirstDayOfLastMonthForDashboard());
		$scope.lastMonthPerid.lastDate = calendarFactory.formatDateForService(calendarFactory.getActualDayOfLastMonthForDashboard());

		$scope.lastMonthPeridMovement = new Period();
		$scope.lastMonthPeridMovement.firstDate = calendarFactory.formatDateForService(calendarFactory.getFirstDayOfLastMonthForDashboard());
		$scope.lastMonthPeridMovement.lastDate = calendarFactory.formatDateForService(calendarFactory.getActualDateOfLastMonth());

		SetTransactionSummaryBox();
		SetMovementSummaryBox();
		SetTransactionConciliationBox();
        InitDisclaimer();
	}

	function InitDisclaimer() {

        var objDisclaimer = {
            type: 'warning',
            text: 'Os termos de uso e política de privacidade foram atualizados e ao continuar navegando neste você aceita suas condições.',
            actionText: 'Saiba Mais.',
            onClick: 'assets/files/contrato-control-rede.pdf'
        };

        RcDisclaimerService.create(objDisclaimer.type, objDisclaimer.text, objDisclaimer.actionText, objDisclaimer.onClick);
    }

	/********************************* TRANSACTION SUMMARY BOX *************************************/
	function SetTransactionSummaryBox(){
		var objTransactionSummaryFilterCurrentMonth = {};
		objTransactionSummaryFilterCurrentMonth.currency =  $rootScope.currency;
		objTransactionSummaryFilterCurrentMonth.startDate = $scope.currentMonthPerid.firstDate;
		objTransactionSummaryFilterCurrentMonth.endDate = $scope.currentMonthPerid.lastDate;
		objTransactionSummaryFilterCurrentMonth.conciliationStatus = 'TO_CONCILIE,CONCILIED';
		// Consulta do mês corrente
		dashboardService.GetTransactionSummaryBox(objTransactionSummaryFilterCurrentMonth).then(function(objItem){
			objItem = objItem.data.content;
			$scope.transactionSummaryBoxCurrentMonth = {};

			if (objItem !== undefined ){
				if(objItem.length > 0){
					$scope.transactionSummaryBoxCurrentMonth =  objItem[0];
				}
			}

			var objTransactionSummaryFilterPrevMonth = {};
			objTransactionSummaryFilterPrevMonth.currency =  $rootScope.currency;
			objTransactionSummaryFilterPrevMonth.startDate = $scope.lastMonthPerid.firstDate;
			objTransactionSummaryFilterPrevMonth.endDate = $scope.lastMonthPerid.lastDate;
			objTransactionSummaryFilterPrevMonth.conciliationStatus = 'TO_CONCILIE,CONCILIED';

			// Consulta do mes anterior
			dashboardService.GetTransactionSummaryBox(objTransactionSummaryFilterPrevMonth).then(function(objItem){
				objItem = objItem.data.content;
				$scope.transactionSummaryBoxPrevMonth = {};

				if (objItem !== undefined ){
					if(objItem.length > 0){
						$scope.transactionSummaryBoxPrevMonth =  objItem[0];
					}
				}

				// Calculo de percentuais
				$scope.percentOfQuantityTransactionsBetweenMonths = (($scope.transactionSummaryBoxCurrentMonth.quantity - $scope.transactionSummaryBoxPrevMonth.quantity) * 100) / ($scope.transactionSummaryBoxPrevMonth.quantity || 1);
				$scope.percentOfTotalsAmountTransactionsBetweenMonths = (($scope.transactionSummaryBoxCurrentMonth.amount - $scope.transactionSummaryBoxPrevMonth.amount) * 100) / ($scope.transactionSummaryBoxPrevMonth.amount || 1);

				// Calculo ticket médio
				if($scope.transactionSummaryBoxCurrentMonth.quantity !== 0){
					$scope.ticketAverageCurrentMonth = ($scope.transactionSummaryBoxCurrentMonth.amount / $scope.transactionSummaryBoxCurrentMonth.quantity);
				}else{
					$scope.ticketAverageCurrentMonth = 0;
				}

				if($scope.transactionSummaryBoxPrevMonth.quantity !== 0){
					$scope.ticketAveragePrevMonth = ($scope.transactionSummaryBoxPrevMonth.amount / $scope.transactionSummaryBoxPrevMonth.quantity);
				}else{
					$scope.ticketAveragePrevMonth = 0;
				}

				$scope.percentOfTicketAverageBetweenMonths = (($scope.ticketAverageCurrentMonth - $scope.ticketAveragePrevMonth) * 100) / ($scope.ticketAveragePrevMonth || 1);
			});
		});
	};

	/********************************* MOVEMENT SUMMARY BOX *************************************/
	function SetMovementSummaryBox(){

		var objMovementSummaryBoxCurrentMonthFilter = {};
		objMovementSummaryBoxCurrentMonthFilter.currency = $rootScope.currency;
		objMovementSummaryBoxCurrentMonthFilter.startDate = $scope.currentMonthPeridMovement.firstDate;
		objMovementSummaryBoxCurrentMonthFilter.endDate = $scope.currentMonthPeridMovement.lastDate;
		objMovementSummaryBoxCurrentMonthFilter.status = 'FORETHOUGHT,RECEIVED';

		dashboardService.GetMovementSummary(objMovementSummaryBoxCurrentMonthFilter).then(function(objItem){
			objItem = objItem.data.content;
			$scope.movementSummaryBoxCurrentMonth = {};

			if(objItem.length > 0){
				$scope.movementSummaryBoxCurrentMonth = objItem[0];
			}

			var objMovementSummaryBoxCurrentPrevFilter = {};
			objMovementSummaryBoxCurrentPrevFilter.currency = $rootScope.currency;
			objMovementSummaryBoxCurrentPrevFilter.startDate = $scope.lastMonthPeridMovement.firstDate;
			objMovementSummaryBoxCurrentPrevFilter.endDate = $scope.lastMonthPeridMovement.lastDate;
			objMovementSummaryBoxCurrentPrevFilter.status = 'FORETHOUGHT,RECEIVED';


			dashboardService.GetMovementSummary(objMovementSummaryBoxCurrentPrevFilter).then(function(objItem){
				objItem = objItem.data.content;
				$scope.movementionSummaryBoxPrevMonth = {};

				if(objItem.length > 0){
					$scope.movementionSummaryBoxPrevMonth = objItem[0];
				}

				$scope.percentOfTotalPayedBetweenMonths = (($scope.movementSummaryBoxCurrentMonth.payedAmount - $scope.movementionSummaryBoxPrevMonth.payedAmount) * 100) / ($scope.movementionSummaryBoxPrevMonth.payedAmount || 1);
			});
		});
	}

	/***************************************** TRANSACTION SUMMARY LINE CHART ******************************************/
	function SetTransactionSummaryLineChart(){

		var objDate = $scope.dateSelected;
		var arrActualMonthData = [];
		var arrLastMonthData = [];

		var intLastDayFlag = calendarFactory.getLastDayOfMonth(objDate, true);

		var objChartData = {
			labels: [],
			series: [], // janeiro, feveriro
			data: [] // [ [janeiro data], [fevereiro data]]
		};


		var objFilter = {
			currency: 'BRL',
			startDate: calendarFactory.formatDateForService(calendarFactory.getFirstDayOfMonth(objDate)),
			endDate: calendarFactory.formatDateForService(calendarFactory.getLastDayOfMonth(objDate)),
			groupBy: 'DAY',
			size: 31,
			conciliationStatus: 'TO_CONCILIE,CONCILIED'
		};

		// actual month data
		TransactionSummaryService.ListTransactionSummaryByFilter(objFilter).then(function(objResponse){
			var objResponse = objResponse.data.content;

			for(var objItem in objResponse){
				if(typeof objResponse[objItem] === 'object') {
					arrActualMonthData.push(objResponse[objItem]);
				} else {
					break;
				}
			}

			var objLastMonthDate = calendarFactory.addMonthsToDate(objDate, -1);
			objFilter.startDate = calendarFactory.formatDateForService(calendarFactory.getFirstDayOfMonth(objLastMonthDate));
			objFilter.endDate = calendarFactory.formatDateForService(calendarFactory.getLastDayOfMonth(objLastMonthDate));

			if(intLastDayFlag < calendarFactory.getLastDayOfMonth(objLastMonthDate, true)){
				intLastDayFlag = calendarFactory.getLastDayOfMonth(objLastMonthDate, true);
			}

			for(var intDay = 1; intDay < intLastDayFlag+1; intDay++) {
				objChartData.labels.push(intDay);
			}

			objChartData.series.push(calendarFactory.getNameOfMonth(objDate));
			objChartData.data.push(ProccessChartDays(arrActualMonthData, true));

			// last month data
			TransactionSummaryService.ListTransactionSummaryByFilter(objFilter).then(function(objResponse){
				var objResponse = objResponse.data.content;

				for(var objItem in objResponse){
					if(typeof objResponse[objItem] === 'object') {
						arrLastMonthData.push(objResponse[objItem]);
					} else {
						break;
					}
				}

				objChartData.series.push(calendarFactory.getNameOfMonth(objLastMonthDate));
				objChartData.data.push(ProccessChartDays(arrLastMonthData));

				$scope.chartjs = objChartData;
				$scope.chartOptions = chartUtils.Options.vendas;

			}).catch(function(error){
			});

		}).catch(function(error){
		});

	}

	function ProccessChartDays(objData, bolIsCurrentMonth){
		var arrChartDays = [];

		if(objData.length){
			var intDayIndex = parseInt(objData[objData.length - 1].date.split('-')[2]);

			for(var intX = 0; intX < intDayIndex; intX++){
				arrChartDays.push(0);
			}

			for(var objItem in objData) {
				var intItemDay = parseInt(objData[objItem].date.split('-')[2]);
				arrChartDays[intItemDay - 1] = objData[objItem].amount;
			}

		}

		if(bolIsCurrentMonth) {
			var objCurrentDay = (new Date()).getDate();

			if(arrChartDays.length < objCurrentDay) {
				var intIndex = arrChartDays.length;
				for (intIndex; intIndex < objCurrentDay; intIndex++) {
					arrChartDays.push(0);
				}
			}
			arrChartDays.pop();
		}

		return arrChartDays;
	}

	/***************************************** TRANSACTION CONCILIATION CALENDAR *******************************************/

	function SetTransactionConciliationCalendar(){

		var objDate = $scope.dateSelected;

		var intFirstDayOfMonth = calendarFactory.getFirstDayOfMonth(objDate);
		var intLastDayOfMonth = calendarFactory.getLastDayOfMonth(objDate);

		var arrDays = [];
		var arrWeeks = [];
		var intTotalDays = calendarFactory.getLastDayOfMonth(objDate, true) - 1;
		var intFirstWeekDay = calendarFactory.getDayOfWeek(intFirstDayOfMonth);

		for(var intX = 0; intX < intFirstWeekDay; intX++) {
			arrDays.push({
				date: '',
				toProcess: false,
				toReconcile: false,
				concilied: false,
				oneItem: false
			});
		}

		for(var intDay = 0; intDay <= intTotalDays; intDay++) {
			arrDays.push({
				date: intDay + 1,
				toProcess: false,
				toReconcile: false,
				concilied: false,
				oneItem: false
			});
		}

		while(arrDays.length) {
			arrWeeks.push(arrDays.splice(0,7));
		}

		$scope.weeks = arrWeeks;
		$scope.calendarMonth = calendarFactory.getNameOfMonth(objDate);

		TransactionConciliationService.ListTransactionConciliationByFilter({
			currency: 'BRL',
			startDate: calendarFactory.formatDateForService(intFirstDayOfMonth),
			endDate: calendarFactory.formatDateForService(intLastDayOfMonth),
			cardProductIds: $scope.productsSelected,
			shopIds: $scope.settlementsSelected,
			groupBy: 'DAY',
			size: 31,
			page: 0
		}).then(function(objData){
			objData = objData.data.content;

			var arrDays = [];

			for(var objItem in objData){
				if(typeof objData[objItem] === 'object') {
					arrDays.push(objData[objItem]);
				} else {
					break;
				}
			}

			for(var objDay in arrDays) {
				var intItemDay = parseInt(arrDays[objDay].date.split('-')[2]);
				var intDaysOnWeek = 7;
				var index = (intItemDay + intFirstWeekDay) - 1;
				var intWeekIndex = Math.floor(index / intDaysOnWeek);
				var arrWeek = arrWeeks[intWeekIndex];

				for(var intX in arrWeek) {
					if(arrWeek[intX].date === intItemDay) {

						var bolOneItemFlag = Boolean(arrDays[objDay].transctionToConcilieQuantity) + Boolean(arrDays[objDay].transctionUnprocessedQuantity) + Boolean(arrDays[objDay].transctionConciliedQuantity);

						arrWeek[intX].toProcess = Boolean(arrDays[objDay].transctionUnprocessedQuantity) | false;
						arrWeek[intX].toReconcile = Boolean(arrDays[objDay].transctionToConcilieQuantity) | false;
						arrWeek[intX].concilied = Boolean(arrDays[objDay].transctionConciliedQuantity) | false;

						if(bolOneItemFlag > 1) {
							arrWeek[intX].oneItem = false;
						} else {
							arrWeek[intX].oneItem = true;
						}
					}
				}
			}
		});
	}

	/***************************************** TRANSACTION CONCILIATION BOX *******************************************/

	function SetTransactionConciliationBox(){

		var objTransactionConciliationFilter = {};
		objTransactionConciliationFilter.currency = $rootScope.currency;
		objTransactionConciliationFilter.startDate = $scope.currentMonthPerid.firstDate;
		objTransactionConciliationFilter.endDate = $scope.currentMonthPerid.lastDate;

		dashboardService.GetTransactionConciliationBox(objTransactionConciliationFilter).then(function(objItem){
			objItem = objItem.data.content;
			$scope.transactionConciliationBox = {};

			if (objItem.length){
				$scope.transactionConciliationBox.transctionToConcilieQuantity = objItem[0].transctionToConcilieQuantity;
				$scope.transactionConciliationBox.transctionConciliedQuantity = objItem[0].transctionConciliedQuantity;
				$scope.transactionConciliationBox.transctionUnprocessedQuantity = objItem[0].transctionUnprocessedQuantity;
			} else {
				$scope.transactionConciliationBox.transctionToConcilieQuantity = 0;
				$scope.transactionConciliationBox.transctionConciliedQuantity = 0;
				$scope.transactionConciliationBox.transctionUnprocessedQuantity = 0;
			}
		});
	}

	function Sales(intDay) {
		if(intDay){
			intDay = intDay < 10 ? 0 + String(intDay) : intDay;
			var objDate = $scope.dateSelected;
			objDate = objDate.split('/');
			objDate[0] = intDay;
			objDate = objDate.join('/');
			$location.path('/sales').search({ date: objDate });
		}
	}

	function Period(){
		this.firstDate;
		this.lastDate;
	}

	function ShowVideoModal() {
		var objModalInstance = $uibModal.open({
			templateUrl: 'video.html',
			controller: function ($scope, $uibModalInstance, $sce) {

				$scope.ok = Ok;
				$scope.cancel = Cancel;

				function Ok(){
					$uibModalInstance.close($scope.selected.item);
				}

				function Cancel(){
					$uibModalInstance.dismiss('cancel');
				}
			}
		});
	}
});
