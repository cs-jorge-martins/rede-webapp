angular.module('KaplenWeb.dashboardController',[])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	$routeProvider.when('/home', {templateUrl: 'app/views/dashboard.html', controller: 'dashboardController'});
	$routeProvider.otherwise({ redirectTo: '/home'} );
}])

.controller('dashboardController', function($scope, $modal, $rootScope, menuFactory, $window,
	calendarFactory, $location, dashboardService, userService, cacheService, resumoConciliacaoService, TransactionSummaryService){

	menuFactory.setActiveDashboard();

	$scope.firstDayOfCurrentMonth = calendarFactory.getFirstDayOfMonthForDashboard();
	$scope.now = calendarFactory.getActualDateForDashboard();
	$scope.actualMonth = calendarFactory.getNameOfMonthAndYearForDashboard();

	$scope.sales = sales;

	setUpDashboard();

	function setUpDashboard(){
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
			showVideoModal();
			delete $window.sessionStorage.tour;
		}

		var data = [];
		data.push(0);

		$scope.chartVendas = pieChart(data);
		$scope.charTiposVendas = pieChartTiposVendas(data);

		setTransactionConciliationCaledar();
		setTransactionSummaryLineChart();
	};


	function checkOneItemStatusDay(item){
		var count = 0;

		if(item.toReconcile){
			count++;
		}

		if(item.toProcess){
			count++;
		}

		if(item.concilied && !item.toReconcile && !item.toProcess){
			count++;
		}

		if(count == 1){
			item.oneItem = true;
		}else{
			item.oneItem = false;
		}
	};

	/**************************************************************** Chama conciliação do dia ***********************************************************************************/

	$scope.conciliacaoDia = function(day) {
		if(day.date != "" && day.date != null){
			dashboardService.setDay(day);
			$location.path('/resumoConciliacao/');
		}
	};

	$scope.conciliacaoMes = function() {
		$location.path('/resumoConciliacao/');
	};

	/************************************************************************************************************************************/
	/************************************************************ V1 TRANSACTION CONCILIATION *******************************************/

	setUp();

 	function setUp() {
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

		$scope.lastMonthPerid = new Period();
		$scope.lastMonthPerid.firstDate = calendarFactory.formatDateForService(calendarFactory.getFirstDayOfLastMonthForDashboard());
		$scope.lastMonthPerid.lastDate = calendarFactory.formatDateForService(calendarFactory.getLastDayOfLastMonthForDashboard());

		setTransactionSummaryBox();
		setMovementSummaryBox();
		setNplicateTransactionBox();
		setConectivityFeeBox();
		setTransactionConciliationBox();
	}

	/********************************* TRANSACTION SUMMARY BOX *************************************/
	function setTransactionSummaryBox(){
		var transactionSummaryFilterCurrentMonth = new TransactionSummaryFilter();
		transactionSummaryFilterCurrentMonth.currency =  $rootScope.currency;
		transactionSummaryFilterCurrentMonth.startDate = $scope.currentMonthPerid.firstDate;
		transactionSummaryFilterCurrentMonth.endDate = $scope.currentMonthPerid.lastDate;

		// Consulta do mês corrente
		
		dashboardService.getTransactionSummaryBox(transactionSummaryFilterCurrentMonth).then(function(item){
			item = item.data.content;
			$scope.transactionSummaryBoxCurrentMonth = new TransactionSummary();

			if (item !== undefined ){
				if(item.length > 0){
					$scope.transactionSummaryBoxCurrentMonth =  item[0];
				}
			}

			var transactionSummaryFilterPrevMonth = new TransactionSummaryFilter();
			transactionSummaryFilterPrevMonth.currency =  $rootScope.currency;
			transactionSummaryFilterPrevMonth.startDate = $scope.lastMonthPerid.firstDate;
			transactionSummaryFilterPrevMonth.endDate = $scope.lastMonthPerid.lastDate;

			// Consulta do mes anterior
			dashboardService.getTransactionSummaryBox(transactionSummaryFilterPrevMonth).then(function(item){
				item = item.data.content;
				$scope.transactionSummaryBoxPrevMonth = new TransactionSummary();

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
	function setMovementSummaryBox(){

		var movementSummaryBoxCurrentMonthFilter = new MovementSummaryFilter();
		movementSummaryBoxCurrentMonthFilter.currency = $rootScope.currency;
		movementSummaryBoxCurrentMonthFilter.payedStartDate = $scope.currentMonthPerid.firstDate;
		movementSummaryBoxCurrentMonthFilter.payedEndDate = $scope.currentMonthPerid.lastDate;
		movementSummaryBoxCurrentMonthFilter.status = ['FORETHOUGHT','RECEIVED'];

		dashboardService.getMovementSummary(movementSummaryBoxCurrentMonthFilter).then(function(item){
			item = item.data;
			$scope.movementSummaryBoxCurrentMonth = new MovementSummary();

			if (item !== undefined ){
				if(item.length > 0){
					$scope.movementSummaryBoxCurrentMonth = item[0];
				}
			}

			var movementSummaryBoxCurrentPrevFilter = new MovementSummaryFilter();
			movementSummaryBoxCurrentPrevFilter.currency = $rootScope.currency;
			movementSummaryBoxCurrentPrevFilter.payedStartDate = $scope.lastMonthPerid.firstDate;
			movementSummaryBoxCurrentPrevFilter.payedEndDate = $scope.lastMonthPerid.lastDate;
			movementSummaryBoxCurrentPrevFilter.status = ['FORETHOUGHT','RECEIVED'];


			dashboardService.getMovementSummary(movementSummaryBoxCurrentPrevFilter).then(function(item){
				item = item.data.content;
				$scope.movementionSummaryBoxPrevMonth = new MovementSummary();

				if (item !== undefined ){
					if(item.length > 0){
						$scope.movementionSummaryBoxPrevMonth = item[0];
					}
				}

				$scope.percentOfTotalPayedBetweenMonths = ([($scope.movementSummaryBoxCurrentMonth.payedAmount - $scope.movementionSummaryBoxPrevMonth.payedAmount) * 100]/ $scope.movementionSummaryBoxPrevMonth.payedAmount) | 0;
			});
		});
	}


	/********************************* NPLICATE SUMMARY BOX *************************************/
	function setNplicateTransactionBox(){
		var transactionSummaryNplicate = new TransactionSummaryFilter();
		transactionSummaryNplicate.currency =  $rootScope.currency;
		transactionSummaryNplicate.startDate = $scope.currentMonthPerid.firstDate;
		transactionSummaryNplicate.endDate = $scope.currentMonthPerid.lastDate;

		dashboardService.getNplicateTransactionSummary(transactionSummaryNplicate).then(function(response){
			var item = response.data.content;
			$scope.totalDuplicate = item[0].amount;
		});

		//var summaryNplicateTransaction = dashboardService.getNplicateTransactionSummary(transactionSummaryNplicate);
		//$scope.totalDuplicate = summaryNplicateTransaction.amount;
	}

	/********************************* CONNECTIVITY FEE  BOX *************************************/
	function setConectivityFeeBox(){

		var adjustSummaryFilter = new AdjustSummaryFilter();
		adjustSummaryFilter.currency =  $rootScope.currency;
		adjustSummaryFilter.startDate = $scope.currentMonthPerid.firstDate;
		adjustSummaryFilter.endDate = $scope.currentMonthPerid.lastDate;
		adjustSummaryFilter.status = ['POS_CONECTIVITY'];
		adjustSummaryFilter.status = ['RECEIVED'];

		dashboardService.getAdjustSummary(adjustSummaryFilter).then(function(item){
			item = item.data.content;

			$scope.totalConectivityTaxes = new AdjustSummary();

			if (item !== undefined ){
				if(item.lenth > 0){
					//alert(item.lenth + " - "+ item[0] );
					$scope.totalConectivityTaxes = item[0];
				}
			}
		});
	}

	/***************************************** TRANSACTION SUMMARY LINE CHART ******************************************/
	function setTransactionSummaryLineChart(){

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
			groupBy: 'DAY'
		};

		// actual month data
		TransactionSummaryService.listTransactionSummaryByFilter(filter).then(function(response){
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
			chartData.data.push(proccessChartDays(actualMonthData));

			// last month data
			TransactionSummaryService.listTransactionSummaryByFilter(filter).then(function(response){
				var response = response.data.content;

				for(var item in response){
					if(typeof response[item] === 'object') {
						lastMonthData.push(response[item]);
					} else {
						break;
					}
				}

				chartData.series.push(calendarFactory.getNameOfMonth(lastMonthDate));
				if (lastMonthData.length) {
					chartData.data.push(proccessChartDays(lastMonthData));
				}

				$scope.chartjs = chartData;
				$scope.chartOptions = chartUtils.options.vendas;

			}).catch(function(error){
			});

		}).catch(function(error){
		});

	}

	function proccessChartDays(data){
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

		return chartDays;
	}

	/***************************************** TRANSACTION CONCILIATION CALENDAR *******************************************/

	function setTransactionConciliationCaledar(){

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

		resumoConciliacaoService.listTransactionConciliationCalendarMonth({
			currency: 'BRL',
			startDate: calendarFactory.formatDateForService(firstDayOfMonth),
			endDate: calendarFactory.formatDateForService(lastDayOfMonth),
			cardProductIds: $scope.productsSelected,
			shopIds: $scope.settlementsSelected,
			groupBy: 'DAY'
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
			/*
			for(day in days) {
				var item = days[day]

				var oneItemFlag = Boolean(item.transctionToConcilieQuantity) + Boolean(item.transctionUnprocessedQuantity) + Boolean(item.transctionConciliedQuantity);

				$scope.days[index].isActiveButton = true;
				$scope.days[index].isActive = false;
				$scope.days[index].toReconcile = item.transctionToConcilieQuantity;
				$scope.days[index].toProcess = item.transctionUnprocessedQuantity;
				$scope.days[index].concilied = item.transctionConciliedQuantity;

				if(oneItemFlag > 1) {
					$scope.days[index].oneItem = false;
				}
			}
			*/
		});
		//var transactionConciliationCalendarFilter = new TransactionConciliationFilter();
		//transactionConciliationCalendarFilter.currency = $rootScope.currency;
		//transactionConciliationCalendarFilter.startDate = calendarFactory.formatDateForService(calendarFactory.getFirstDayOfMonthForDashboard());
		//transactionConciliationCalendarFilter.endDate = calendarFactory.formatDateForService(calendarFactory.getActualDateForDashboard());
		//transactionConciliationCalendarFilter.groupBy = ['DAY'];
		//var transactionConciliationDay = dashboardService.getTransactionConciliationCalendar(transactionConciliationCalendarFilter);
		//$scope.TransactionConciliationDayCalendar = transactionConciliationDay;
	}

	/***************************************** TRANSACTION CONCILIATION BOX *******************************************/

	function setTransactionConciliationBox(){

		var transactionConciliationFilter = new TransactionConciliationFilter();
		transactionConciliationFilter.currency = $rootScope.currency;
		transactionConciliationFilter.startDate = $scope.currentMonthPerid.firstDate;
		transactionConciliationFilter.endDate = $scope.currentMonthPerid.lastDate;

		dashboardService.getTransactionConciliationBox(transactionConciliationFilter).then(function(item){
			item = item.data.content;
			$scope.transactionConciliationBox = new TransactionConciliation();

			if (item !== undefined ){
				if(item.length == 1){
					$scope.transactionConciliationBox.transctionToConcilieQuantity = item[0].transctionToConcilieQuantity;
				} else if (item.length == 2) {
					$scope.transactionConciliationBox.transctionToConcilieQuantity = item[0].transctionToConcilieQuantity;
					$scope.transactionConciliationBox.transctionConciliedQuantity = item[1].transctionConciliedQuantity;
				} else if (item.length == 3) {
					$scope.transactionConciliationBox.transctionToConcilieQuantity = item[0].transctionToConcilieQuantity;
					$scope.transactionConciliationBox.transctionConciliedQuantity = item[1].transctionConciliedQuantity;
					$scope.transactionConciliationBox.transctionToConcilieQuantity = item[2].transctionUnprocessedQuantity;
				}
			}
		});
	}

	function sales(day) {
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

	/***************************************** ENTITIES ***************************************/

	function TransactionSummary(){

		this.date;
		this.quantity = 0;
		this.acquirer = {
				id: false,
				name: false
		};
		this.cardProduct;
		this.shop;
		this.conciliationStatus;
		this.amount = 0;
		this.net = 0;
		this.cancelledAmount = 0;
	}

	function MovementSummary(){

		this.date;
		this.acquirer ={
			id:null,
			name:null
		};
		this.cardProduct = {
				id:null,
				name:null
		};
		this.bankAccount = {
				id:null,
				bankNumber:null,
				agencyNumber:null,
				accountNumber:null
		};
		this.shop = {
				id:null,
				name:null
		};
		this.quantity = 0;
		this.expetedAmount = 0;
		this.payedAmount = 0;
	}

	function TransactionConciliation(){

		this.date = null;
		this.acquirer = {
				id: null,
				name: null
		};
		this.cardProduct = {
				id: null,
				name: null
		};

		this.transctionToConcilieQuantity = 0;
		this.transctionToConcilieAmount = 0;
		this.transctionConciliedQuantity = 0;
		this.transctionConciliedAmount = 0;
		this.transctionUnprocessedQuantity = 0;
		this.transctionUnprocessedAmount = 0;
	}

	function Period(){
		this.firstDate;
		this.lastDate;
	}

	function showVideoModal() {
		// modal


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

				$scope.ok = function () {
					$modalInstance.close($scope.selected.item);
				};

				$scope.cancel = function () {
					$modalInstance.dismiss('cancel');
				};
			}
		});

	}

	/***************************************** FILTERS ***************************************/

	function AdjustSummaryFilter(){

		this.currency; // BRL
		this.startDate;  // yyyyMMdd
		this.endDate;  // yyyyMMdd
		this.acquirers; // ARRAY {1,2,3}
		this.shopIds; // ARRAY {1,2,3}
		this.cardProductIds; // ARRAY {1,2,3}
		this.types; // ARRAY {ADJUST, POS_CONECTIVITY, CANCELLATION, CHARGEBACK}
		this.status; // ARRAY {EXPECTED, PAYED, SUSPENDED}
		this.groupBy; // ARRAY {	DAY, MONTH, BANK_ACCOUNT, SHOP, ACQUIRER, CARD_PRODUCT, TYPE}

		this.pageNumber; // 1;
		this.maxPageSize; // 50;
	}

	function MovementSummaryFilter(){

		this.currency; // BRL
		this.expectedStartDate; // yyyyMMdd
		this.expecedEndDate; // yyyyMMdd
		this.payedStartDate; // yyyyMMdd
		this.payedEndDate; // yyyyMMdd
		this.status; // ARRAY {EXPECTED , RECEIVED , FORETHOUGHT}
		this.acquirers; // ARRAY {REDE,CIELO}
		this.sourceShopIds; // ARRAY {1,2,3}
		this.creditedShopIds; // ARRAY {1,2,3}
		this.banckAccountIds; // ARRAY {1,2,3}
		this.cardProductIds; // ARRAY {1,2,3}
		this.groupBy; // ARRAY {DAY, MONTH, BANK_ACCOUNT, SHOP, ACQUIRER, CARD_PRODUCT}

		this.pageNumber; // 1
		this.maxPageSize; // 50
	}

	function TransactionConciliationFilter(){

		this.currency; // BRL
		this.startDate; // yyyyMMdd
		this.endDate; // yyyyMMdd
		this.acquirers; // ARRAY {REDE,CIELO}
		this.shopIds; // ARRAY {1,2,3}
		this.cardProductIds; // ARRAY {1,2,3}
		this.status; // ARRAY {EXPECTED , RECEIVED , FORETHOUGHT}
		this.types; // ARRAY {CREDIT, DEBIT}
		this.modalitys; // 	ARRAY{ IN_CASH, PRE_DATED, INSTALLMENT, BILL_PAYMENT}
		this.adjustTypes; // ARRAY { ADJUST, CANCELLATION, CHARGEBACK}
		this.groupBy; // ARRAY { DAY, MONTH, ACQUIRER, SHOP, CARD_PRODUCT}

		this.pageNumber; // 1
		this.maxPageSize; // 50
	}

	function TransactionSummaryFilter(){

		var currency; // BRL
		var startDate; // yyyyMMdd
		var endDate; // yyyyMMdd
		var acquirers; // ARRAY{REDE,CIELO}
		var shopIds; // ARRAY {1,2,3}
		var cardProductIds; // ARRAY {1,2,3}
		var conciliationStatus; // ARRAY {TO_CONCILIE, CONCILIED, UNPROCESSED}
		var status; // ARRAY { PROCESSED, CANCELLED, ADJUSTED}
		var types; // ARRAY {CREDIT,DEBIT}
		var modalitys; // ARRAY { IN_CASH, PRE_DATED, INSTALLMENT, BILL_PAYMENT}
		var adjustType; //  ARRAY {AJUST, CANCELLATION, CHARGEBACK}

		var pageNumber; // 1
		var maxPageSize; // 50
	}

	function AdjustSummary(){

		this.date;
		this.acquirer = {
				id: null,
				name: null
		};
		this.cardProduct= {
				id: null,
				name: null
		};
		this.bankAccount = {
				id: null,
				bankNumber: null,
				agencyNumber: null,
				accountNumber: null
		};
		this.shop= {
				id: null,
				name: null
		};
		this.quantity = 0;
		this.amount = 0;
		this.type = null;
		this.descritption = null;

	}
});
