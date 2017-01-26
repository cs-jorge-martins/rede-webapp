/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Kaplen.CalendarFactory',[])
.factory('calendarFactory', function() {

    var strFormat = "DD/MM/YYYY";

	var timeTimezone = "America/Brasilia";
	moment.locale('pt-BR');
	var objMomentjs = moment();
	var objMomentForDashboard = moment();
	var objNowFormattedDashboard = objMomentForDashboard.tz(timeTimezone).subtract(1, 'd');
	var objFirstDayOfMonth = moment(objMomentjs).startOf('M');
	var objFirstDayOfMonthFormatted = objFirstDayOfMonth.tz(timeTimezone).format(strFormat);

	var objFirstDayOfCurrentMonth = moment(moment()).startOf('M');
	var objActualDayOfCurrentMonth = moment().date() == 1 ? moment().tz(timeTimezone) : moment().tz(timeTimezone).subtract(1, 'd');

	var objFirstDayOfLastMonth = moment(moment()).subtract(1, 'M').startOf('month');
	var objActualDayOfLastMonth = objActualDayOfCurrentMonth.subtract(1, 'M');
	var objLastDayOfLastMonth = moment().tz(timeTimezone).subtract(1, 'M').endOf('month');

	var objFirstDayOfLastMonthDashboard = moment(objMomentForDashboard).subtract(1, 'M').startOf('month');
	var objLastDayOfLastMonthDashboard = moment(objMomentForDashboard).tz(timeTimezone).subtract(1, 'M').endOf('month');

	var objActualDayOfNextYear = moment().tz(timeTimezone).add(1, 'Year');

	function GetActualDateOfNextYear() {
		return objActualDayOfNextYear;
	}

	function GetToday() {
		return moment().toDate();
	}

	function GetYesterday() {
		return moment().add(-1, 'day').tz(timeTimezone).toDate();
	}
	
	function GetNextYear() {
		return moment().add(1, 'years');
	}

	function GetFirstDayOfMonth(){
		return objFirstDayOfCurrentMonth;
	}

	function GetActualDayOfCurrentMonth(){
		return objActualDayOfCurrentMonth;
	}

	function GetActualDayOfCurrentMonthForDashboard(){
		return objNowFormattedDashboard;
	}

	function GetFirstDayOfLastMonth(){
		return objFirstDayOfLastMonth;
	}

	function GetFirstDayOfLastMonthForDashboard(){
		return objFirstDayOfLastMonthDashboard;
	}

	function GetLastDayOfLastMonth(){
		return objLastDayOfLastMonth;
	}

	function GetLastDayOfLastMonthForDashboard(){
		return objLastDayOfLastMonthDashboard;
	}

	function GetActualDateForDashboard(){
		return objNowFormattedDashboard.format(strFormat);
	}

	function GetActualDayOfLastMonthForDashboard(){
		return objActualDayOfLastMonth;
	}

	function GetMomentOfSpecificDate(date){
		return moment(date, strFormat).tz(timeTimezone);
	}

    function GetUnixMomentOfSpecificDate(date){
		return moment.unix(date, strFormat).tz(timeTimezone);
	}

	function GetFormat() {
		return strFormat;
	}

	function GetActualDate() {
		return moment().tz(timeTimezone).format(strFormat);
	}

	function GetActualDateOfLastMonth() {
		return moment().tz(timeTimezone).subtract(1, 'M').format(strFormat);
	}

	function GetLastDayOfCurrentMonth() {
		return GetLastDayOfMonth();
	}

	function GetTomorrowFromToday() {
		return moment().add(1, 'day').tz(timeTimezone).format(strFormat);
	}

	/**
	 * retorna o dia de ontem em date
	 * @returns date
	 */
	function GetTomorrowFromTodayToDate() {
		return moment().add(1, 'day').tz(timeTimezone).toDate();
	}

	function GetActualDateUploadModal() {
		return moment().tz(timeTimezone).format("DD/MM/YYYY HH:mm:ss");
	}

	function GetYesterdayDate(){
		var dateToday = moment().tz(timeTimezone);
		//Obter ultimo dia do mes anterior, pois ja havia somado um mes anteriormente
		var dateYesterday = dateToday.subtract(1, 'day');
		return dateYesterday.tz(timeTimezone).format(strFormat);
	}

	function GetFirstDayOfMonthForDashboard() {
		var objFirstDayOfMonthDashboard = moment("01/" + (objNowFormattedDashboard.month()+1) + "/" + objNowFormattedDashboard.year(), strFormat);
		return objFirstDayOfMonthDashboard.tz(timeTimezone).format(strFormat);
	}

	function GetFirstDayOfMonth(date) {
        if( date ) {
            var objInitialDateMoment = moment(date, strFormat).startOf('month');
        } else {
            var objInitialDateMoment = objMomentjs.startOf('month');
        }
		return objInitialDateMoment.tz(timeTimezone).format(strFormat);
	}

	function GetLastDayOfMonth(date, raw) {
        if( date ) {
        	if(date instanceof Date) {
        		return moment(date).endOf('month').toDate();
			}
            var objFinalDateMoment = moment(date, strFormat).endOf('month');
        } else {
            var objFinalDateMoment = objMomentjs.endOf('month');
        }

        if(raw) {
            return objFinalDateMoment.date();
        }
		return objFinalDateMoment.tz(timeTimezone).format(strFormat);
	}

	/**
	 * Pega o ultimo dia de um date e retorna o proximo mês em Date
	 * @param date
	 * @returns date
	 */
	function GetLastDayOfMonthToDate(date) {
        if( date ) {
            var objFinalDateMoment = moment(date).endOf('month');
        }
		return objFinalDateMoment.toDate();
	}


	/**
	 * faz o somatorio: ultimo_dia_do_mes(startDate + x mês)
	 * @param date
	 * @param plusMonths
	 * @returns {*}
	 */
	function GetLastDayOfPlusMonthToDate(date, plusMonths) {
		return GetLastDayOfMonthToDate(AddMonthsOnDate(date, plusMonths));
	}

    function GetDayOfWeek(date) {
        return moment(date, strFormat).day();
    }

    function GetFirstDayOfYear(year) {
        return year + "0101";
	}

	function GetLastDayOfYear(year) {
		return year + "1201";
	}

	function FormatDate(date, isDiferentFormat, bolReturnDate) {
		if(isDiferentFormat){
			if(bolReturnDate) {
				return moment(date).tz(timeTimezone).toDate();
			}
			return moment(date).tz(timeTimezone).format("DD/MM/YYYY");
		}else{
			return moment(date, strFormat).tz(timeTimezone).format(strFormat);
		}
	}


    function FormatDateForService(date) {
        if(date instanceof Date) {
            return moment(date).format("YYYYMMDD");
        }
        var dateMomentTemp = moment(date, strFormat).tz(timeTimezone);
		return dateMomentTemp.format("YYYYMMDD");
    }

    function FormatDateTimeForService(date) {
		if(date) {
			var objDateAux = FormatDateForService(date);
			return (objDateAux === 'Invalid date') ? (moment(date).tz(timeTimezone)).format("YYYYMMDD") : objDateAux;
		}
		else {
			return date;
		}
    }

	function GetDateFromString(date){
		return moment(date, strFormat);
	}

	function AddDaysToDate(date, qtd){
		 var objResultMoment = moment(date, strFormat);
		 var objResultAddMoment = objResultMoment.add(qtd, 'day');

		 return objResultAddMoment.tz(timeTimezone);
	}

    function AddMonthsToDate(date, qtd){
		 var objResultMoment = moment(date, strFormat);
		 var objResultAddMoment = objResultMoment.add(qtd, 'month');

		 return objResultAddMoment.tz(timeTimezone);
	}

	/**
	 * função para somar meses em uma data sem formato
	 * @param date
	 * @param qtd
	 * @returns date
	 */
    function AddMonthsOnDate(date, intQtd){
		 var objResultMoment = moment(date).add(intQtd, 'month');
		 return objResultMoment.toDate();
	}

    function AddYearsToDate(date, intQtd, bolFormatToDate){


		var objResultMoment = moment(date, strFormat);
		if(bolFormatToDate) {
            objResultMoment = moment(date);
		}
		 var objResultAddMoment = objResultMoment.add(intQtd, 'years');

		 if(bolFormatToDate && bolFormatToDate === true) {
             return objResultAddMoment.tz(timeTimezone).toDate();
		 }

		 return objResultAddMoment.tz(timeTimezone);
	}

	function GetYear(date){
		var objMomentTemp = moment(date, strFormat).tz(timeTimezone);
		return objMomentTemp.format("YYYY");
	}

	function GetMonthNumberOfDate(date){
		var objMomentFunction =  moment(date, strFormat).tz(timeTimezone);

		return objMomentFunction.month()+1;
	}

	function GetDayOfMonth(date){
		return moment(date, strFormat).tz(timeTimezone).format("D");
    }

    function GetDayOfDate(date){
        return moment(date).get('date');
    }

    function GetMonthNameOfDate(date){
        return moment(date).format('MMMM');
    }

    function GetYearOfDate(date){
        return moment(date).format('YYYY');
    }

	function GetHoursAndMinutes(hour){
		return moment(hour, "HH:mm:ss").tz(timeTimezone).format("HH:mm");
	}

	function VerifyValidHours(hour){
		return moment(hour, "HH:mm:ss").isValid();
	}

	function GetMonthNameAbreviation(date){
		return moment(date, strFormat).tz(timeTimezone).format("MMM");
	}

	function GetNameOfMonthAndYearForDashboard(){
		return objNowFormattedDashboard.format("MMMM YYYY");
	}

	function GetNameOfMonthAndYear(date){
		if(date != null){
			return moment(date, strFormat).tz(timeTimezone).format("MMMM YYYY");
		}else{
			return objMomentjs.format("MMMM YYYY");
		}
	}

    function GetNameOfMonth(date){
		if(date != null){
			return moment(date, strFormat).tz(timeTimezone).format("MMMM");
		}else{
			return objMomentjs.format("MMMM");
		}
	}

	function GetDayAndMonthFromDate(date) {
		var objNewDateDay = moment(date).format('D');
		var objNewDateMonth = moment(date).format('MMMM');
		return objNewDateDay + " de " + objNewDateMonth;
	}

	function GetDaySlashMonth(date) {
		var objNewDateDay = moment(date).format('D');
		var objNewDateMonth = moment(date).format('MM');
		return objNewDateDay + "/" + objNewDateMonth;
	}


	function GetFirstDayOfSpecificMonth(intMonth, intYear){
		var objFirstDayOfSpecificMonth = moment("01/" + (intMonth+1) + "/" + intYear, strFormat);
		var objFirstDayOfMonthFormatted = objFirstDayOfSpecificMonth.tz(timeTimezone).format(strFormat);

		return objFirstDayOfMonthFormatted;
	}

	function GetLastDayOfSpecificMonth(intMonth, intYear){
		var objFirstDayOfMonth = moment("01/" + (intMonth + 1) + "/" + intYear, strFormat);
		var objFirstDayOfNextMonth = objFirstDayOfMonth.add(1, 'month');
		//Obter ultimo dia do mes anterior, pois ja havia somado um mes anteriormente
		var objLastDayOfLastMonth = objFirstDayOfNextMonth.subtract(1, 'day');

		var objLastDayOfMonthFormatted = objLastDayOfLastMonth.tz(timeTimezone).format(strFormat);

		return objLastDayOfMonthFormatted;
	}

	function GetSpecificDateOfYear(intYear){
		var objMomentPersonalized = moment("01/01/" + intYear, strFormat);
		return objMomentPersonalized.tz(timeTimezone).format(strFormat);
	}

	function CheckInvalidPeriod(dateInitialDate, dateFinalDate, dateInitialDateChanged, dateFinalDateChanged){
		var objInitialDateMoment = null;
		var objFinalDateMoment = null;

		if(dateInitialDateChanged){
			objInitialDateMoment = this.GetMomentOfSpecificDate(FormatDate(dateInitialDate, true));
		}else{
			objInitialDateMoment = this.GetMomentOfSpecificDate(dateInitialDate);
		}

		if(dateFinalDateChanged){
			objFinalDateMoment = this.GetMomentOfSpecificDate(FormatDate(dateFinalDate, true));
		}else{
			objFinalDateMoment = this.GetMomentOfSpecificDate(dateFinalDate);
		}

		if(objInitialDateMoment.isAfter(objFinalDateMoment) || objFinalDateMoment.isBefore(objInitialDateMoment)){
			return true;
		}else{
			return false;
		}
	}

    function IsInBetweenHours(dateMin, dateMax, date, intHours) {

        var objDateMin = moment(dateMin).startOf('day');
        var objDateMax = moment(dateMax).startOf('day');
        var objDate = moment(date).startOf('day');

        var hoursDiffMinDate = objDate.diff(objDateMin, 'hours');
        var hoursDiffMaxDate = objDate.diff(objDateMax, 'hours');

        return hoursDiffMinDate >= intHours && hoursDiffMaxDate < 0;

    }

    function IsInBetween(date, dateStart, dateEnd) {

        var objDate = moment(date).startOf('day');

        var objDateStart = moment(dateStart).startOf('day');
        var objDateEnd = moment(dateEnd).startOf('day');

		var bolIsBetween = objDate.isAfter(objDateStart) && objDate.isBefore(objDateEnd);
		var bolisSameAsStart = objDate.isSame(objDateStart);
		var bolisSameAsEnd = objDate.isSame(objDateEnd);

        return  bolIsBetween || bolisSameAsStart || bolisSameAsEnd;

    }
    
    function GetFirstHourFromDate(date) {
		return moment(date).startOf('day').toDate();
    }

    function IsEqualDate(dateOne, dateTwo) {


        var objDateOne = moment(dateOne).startOf('day');
        var objDateTwo = moment(dateTwo).startOf('day');

        return objDateOne.diff(objDateTwo, 'hours') === 0;

    }

    function IsFirstDayOfMonth(date) {

		var objMomentDate = moment(date).startOf('day');
		var objMomentMonthDate = moment(date).startOf('month');
        return objMomentDate.diff(objMomentMonthDate, 'hours') === 0;

    }

	function TransformBrDateIntoDate(date) {
		if(date) {
		var arrParts = date.split("/");
		return new Date(arrParts[2], arrParts[1]-1, arrParts[0], 0, 0, 0, 0);
        }
	}

    return {
        getMomentOfSpecificDate: GetMomentOfSpecificDate,
        getUnixMomentOfSpecificDate: GetUnixMomentOfSpecificDate,
        getFormat: GetFormat,
        getActualDateUploadModal: GetActualDateUploadModal,
        getActualDate: GetActualDate,
        getActualDateOfLastMonth: GetActualDateOfLastMonth,
        getFirstDayOfMonth: GetFirstDayOfMonth,
        getLastDayOfMonth: GetLastDayOfMonth,
        getFirstDayOfYear: GetFirstDayOfYear,
        getLastDayOfYear: GetLastDayOfYear,
        getYesterdayDate: GetYesterdayDate,
        getDayOfWeek: GetDayOfWeek,
        getFirstDayOfSpecificMonth: GetFirstDayOfSpecificMonth,
        getLastDayOfSpecificMonth: GetLastDayOfSpecificMonth,
        getNameOfMonthAndYear: GetNameOfMonthAndYear,
        getNameOfMonth: GetNameOfMonth,
        formatDate: FormatDate,
        getDayOfMonth: GetDayOfMonth,
        getLastDayOfLastMonth: GetLastDayOfLastMonth,
        getActualDayOfLastMonthForDashboard: GetActualDayOfLastMonthForDashboard,
        getLastDayOfLastMonthForDashboard: GetLastDayOfLastMonthForDashboard,
        getActualDayOfCurrentMonth: GetActualDayOfCurrentMonth,
        getActualDayOfCurrentMonthForDashboard: GetActualDayOfCurrentMonthForDashboard,
        getMonthNameAbreviation: GetMonthNameAbreviation,
        getActualDateForDashboard: GetActualDateForDashboard,
        getFirstDayOfMonthForDashboard: GetFirstDayOfMonthForDashboard,
        getNameOfMonthAndYearForDashboard: GetNameOfMonthAndYearForDashboard,
        formatDateForService: FormatDateForService,
        formatDateTimeForService: FormatDateTimeForService,
        getFirstDayOfLastMonth: GetFirstDayOfLastMonth,
        getFirstDayOfLastMonthForDashboard: GetFirstDayOfLastMonthForDashboard,
        getDateFromString: GetDateFromString,
        getMonthNumberOfDate: GetMonthNumberOfDate,
        getHoursAndMinutes: GetHoursAndMinutes,
        verifyValidHours: VerifyValidHours,
        addDaysToDate: AddDaysToDate,
        addMonthsToDate: AddMonthsToDate,
        addYearsToDate: AddYearsToDate,
        getYear: GetYear,
        getSpecificDateOfYear: GetSpecificDateOfYear,
        checkInvalidPeriod: CheckInvalidPeriod,
        getDayOfDate: GetDayOfDate,
        getMonthNameOfDate: GetMonthNameOfDate,
        getYearOfDate: GetYearOfDate,
        getLastDayOfCurrentMonth: GetLastDayOfCurrentMonth,
        getTomorrowFromToday: GetTomorrowFromToday,
        transformBrDateIntoDate: TransformBrDateIntoDate,
        getTomorrowFromTodayToDate: GetTomorrowFromTodayToDate,
        getLastDayOfPlusMonthToDate: GetLastDayOfPlusMonthToDate,
        getToday: GetToday,
        getDayAndMonthFromDate: GetDayAndMonthFromDate,
        getDaySlashMonth: GetDaySlashMonth,
		getNextYear: GetNextYear,
		getYesterday: GetYesterday,
		getActualDateOfNextYear: GetActualDateOfNextYear,
        isInBetweenHours: IsInBetweenHours,
        isInBetween: IsInBetween,
        isEqualDate: IsEqualDate,
        isFirstDayOfMonth: IsFirstDayOfMonth,
        getFirstHourFromDate: GetFirstHourFromDate
	};
});