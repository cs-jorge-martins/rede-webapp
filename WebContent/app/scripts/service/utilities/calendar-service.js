/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */
 
angular.module('KaplenWeb.calendarService',[])
	.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {

}])

.service('calendarService', function(calendarFactory) {

	var calendarService = {};

	calendarService.dataInicial = calendarFactory.getFirstDayOfMonth();
	calendarService.dataFinal = calendarFactory.getLastDayOfMonth();

	calendarService.initialDateChanged = false;
	calendarService.finalDateChanged = false;

	calendarService.resetCalendarService = function(){
		calendarService.dataInicial = this.dataInicial = calendarFactory.getFirstDayOfMonth();
		calendarService.dataFinal = this.dataFinal = calendarFactory.getLastDayOfMonth();

		calendarService.initialDateChanged = this.initialDateChanged = false;
		calendarService.finalDateChanged = this.finalDateChanged = false;
	};



	calendarService.checkDateInitial = function(date){
		if(calendarService.initialDateChanged){
			return calendarFactory.formatDate(calendarService.dataInicial, true);
		}else{
			return date;
		}
	};

	calendarService.checkDateFinal = function(date){
		if(calendarService.finalDateChanged){
			return calendarFactory.formatDate(calendarService.dataFinal, true);
		}else{
			return date;
		}
	};

	calendarService.changeInitialDate = function(data){
		if(data != calendarService.dataInicial){
			calendarService.initialDateChanged = this.initialDateChanged = true;
			calendarService.dataInicial = data;
		}
	};

	calendarService.changeFinalDate = function(data){
		if(data != calendarService.dataFinal){
			calendarService.finalDateChanged = this.finalDateChanged = true;
			calendarService.dataFinal = data;
		}
	};

	calendarService.format = 'dd/MM/yyyy';

	calendarService.dateOptions = {
		    'year-format': "'yy'",
		    'starting-day': 1,
		    'show-weeks': false
	};

	return calendarService;

});
