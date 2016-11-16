/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('KaplenWeb.calendarService',[])
	.config(['$routeProvider', function($routeProvider) {

}])

.service('calendarService', function(calendarFactory) {

	var objCalendarService = {};

	objCalendarService.dateDataInicial = calendarFactory.getFirstDayOfMonth();
	objCalendarService.dateDataFinal = calendarFactory.getLastDayOfMonth();

	objCalendarService.bolInitialDateChanged = false;
	objCalendarService.bolFinalDateChanged = false;

	objCalendarService.ResetCalendarService = function(){
		objCalendarService.dateDataInicial = this.dateDataInicial = calendarFactory.getFirstDayOfMonth();
		objCalendarService.dateDataFinal = this.dateDataFinal = calendarFactory.getLastDayOfMonth();

		objCalendarService.bolInitialDateChanged = this.bolInitialDateChanged = false;
		objCalendarService.bolFinalDateChanged = this.bolFinalDateChanged = false;
	};



	objCalendarService.CheckDateInitial = function(date){
		if(objCalendarService.bolInitialDateChanged){
			return calendarFactory.formatDate(objCalendarService.dateDataInicial, true);
		}else{
			return date;
		}
	};

	objCalendarService.CheckDateFinal = function(date){
		if(objCalendarService.bolFinalDateChanged){
			return calendarFactory.formatDate(objCalendarService.dateDataFinal, true);
		}else{
			return date;
		}
	};

	objCalendarService.ChangeInitialDate = function(data){
		if(data != objCalendarService.dateDataInicial){
			objCalendarService.bolInitialDateChanged = this.bolInitialDateChanged = true;
			objCalendarService.dateDataInicial = data;
		}
	};

	objCalendarService.ChangeFinalDate = function(data){
		if(data != objCalendarService.dateDataFinal){
			objCalendarService.bolFinalDateChanged = this.bolFinalDateChanged = true;
			objCalendarService.dateDataFinal = data;
		}
	};

	objCalendarService.format = 'dd/MM/yyyy';

	objCalendarService.dateOptions = {
		    'year-format': "'yy'",
		    'starting-day': 1,
		    'show-weeks': false
	};

	return objCalendarService;

});
