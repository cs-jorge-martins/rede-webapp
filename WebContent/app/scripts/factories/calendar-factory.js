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
	var objNowFormattedDashboard = objMomentForDashboard.tz(timeTimezone).subtract(1, 'days');
	var objFirstDayOfMonth = moment("01/" + (objMomentjs.month()+1) + "/" + objMomentjs.year(), strFormat);
	var objFirstDayOfMonthFormatted = objFirstDayOfMonth.tz(timeTimezone).format(strFormat);

	var objFirstDayOfCurrentMonth = moment("01/" + (moment().month()+1) + "/" + moment().year());
	var objActualDayOfCurrentMonth = moment().date() == 1 ? moment().tz(timeTimezone) : moment().tz(timeTimezone).subtract(1, 'days');

	var objFirstDayOfLastMonth = moment((moment().month()) + "/"+ "01/" + + moment().year());
	var objLastDayOfLastMonth = moment().tz(timeTimezone).subtract(1, 'months').endOf('month');

	var objFirstDayOfLastMonthDashboard = moment((objMomentForDashboard.month()) + "/"+ "01/" + + moment().year());
	var objLastDayOfLastMonthDashboard = moment((objMomentForDashboard)).tz(timeTimezone).subtract(1, 'months').endOf('month');

	function getToday() {
		return moment().toDate();
	}

	function getDateFromString(value, strFormat){
		return moment = moment(value,strFormat);
	}

	function getFirstDayOfMonth(){
		return objFirstDayOfCurrentMonth;
	}

	function getActualDayOfCurrentMonth(){
		return objActualDayOfCurrentMonth;
	}

	function getActualDayOfCurrentMonthForDashboard(){
		return objNowFormattedDashboard;
	}

	function getFirstDayOfLastMonth(){
		return objFirstDayOfLastMonth;
	}

	function getFirstDayOfLastMonthForDashboard(){
		return objFirstDayOfLastMonthDashboard;
	}

	function getLastDayOfLastMonth(){
		return objLastDayOfLastMonth;
	}

	function getLastDayOfLastMonthForDashboard(){
		return objLastDayOfLastMonthDashboard;
	}

	function getActualDateForDashboard(){
		return objNowFormattedDashboard.format(strFormat);
	}

	function getMomentOfSpecificDate(date){
		return moment(date, strFormat).tz(timeTimezone);
	}

    function getUnixMomentOfSpecificDate(date){
		return moment.unix(date, strFormat).tz(timeTimezone);
	}

	function getFormat() {
		return strFormat;
	}

	function getActualDate() {
		return moment().tz(timeTimezone).format(strFormat);
	}
	function getLastDayOfCurrentMonth() {
		return getLastDayOfMonth();
	}
	function getTomorrowFromToday() {
		return moment().add(1, 'day').tz(timeTimezone).format(strFormat);
	}

	/**
	 * retorna o dia de ontem em date
	 * @returns date
	 */
	function getTomorrowFromTodayToDate() {
		return moment().add(1, 'day').tz(timeTimezone).toDate();
	}
	function getActualDateUploadModal() {
		return moment().tz(timeTimezone).format("DD/MM/YYYY HH:mm:ss");
	}

	function getYesterdayDate(){
		var dateToday = moment().tz(timeTimezone);
		//Obter ultimo dia do mes anterior, pois ja havia somado um mes anteriormente
		var dateYesterday = dateToday.subtract(1, 'day');
		return dateYesterday.tz(timeTimezone).format(strFormat);
	}

	function getFirstDayOfMonthForDashboard() {
		var objFirstDayOfMonthDashboard = moment("01/" + (objNowFormattedDashboard.month()+1) + "/" + objNowFormattedDashboard.year(), strFormat);
		return objFirstDayOfMonthDashboard.tz(timeTimezone).format(strFormat);
	}

	function getFirstDayOfMonth(date) {
        if( date ) {
            var objInitialDateMoment = moment(date, strFormat).startOf('month');
        } else {
            var objInitialDateMoment = objMomentjs.startOf('month');
        }
		return objInitialDateMoment.tz(timeTimezone).format(strFormat);
	}

	function getLastDayOfMonth(date, raw) {
        if( date ) {
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
	function getLastDayOfMonthToDate(date) {
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
	function getLastDayOfPlusMonthToDate(date, plusMonths) {
		return getLastDayOfMonthToDate(addMonthsOnDate(date, plusMonths));
	}

    function getDayOfWeek(date) {
        return moment(date, strFormat).day();
    }

    function getFirstDayOfYear(year) {
        return year + "0101";
	}

	function getLastDayOfYear(year) {
		return year + "1201";
	}

	function formatDate(date, isDiferentFormat) {
		if(isDiferentFormat){
			return moment(date).tz(timeTimezone).format("DD/MM/YYYY");
		}else{
			return moment(date, strFormat).tz(timeTimezone).format(strFormat);
		}
	}


    function formatDateForService(date) {
        var dateMomentTemp = moment(date, strFormat).tz(timeTimezone);
		return dateMomentTemp.format("YYYYMMDD");
    }

    function formatDateTimeForService(date) {
		if(date) {
			var objDateAux = formatDateForService(date);
			return (objDateAux === 'Invalid date') ? (moment(date).tz(timeTimezone)).format("YYYYMMDD") : objDateAux;
		}
		else {
			return date;
		}
    }

	function getDateFromString(date){
		return moment(date, strFormat);
	}

	function addDaysToDate(date, qtd){
		 var objResultMoment = moment(date, strFormat);
		 var objResultAddMoment = objResultMoment.add(qtd, 'day');

		 return objResultAddMoment.tz(timeTimezone);
	}

    function addMonthsToDate(date, qtd){
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
    function addMonthsOnDate(date, intQtd){
		 var objResultMoment = moment(date).add(intQtd, 'month');
		 return objResultMoment.toDate();
	}

    function addYearsToDate(date, intQtd){
		 var objResultMoment = moment(date, strFormat);
		 var objResultAddMoment = objResultMoment.add(intQtd, 'year');

		 return objResultAddMoment.tz(timeTimezone);
	}

	function getYear(date){
		var objMomentTemp = moment(date, strFormat).tz(timeTimezone);
		return objMomentTemp.format("YYYY");
	}

	function getMonthNumberOfDate(date){
		var objMomentFunction =  moment(date, strFormat).tz(timeTimezone);

		return objMomentFunction.month()+1;
	}

	function getDayOfMonth(date){
		return moment(date, strFormat).tz(timeTimezone).format("D");
    }

    function getDayOfDate(date){
        return moment(date).get('date');
    }

    function getMonthNameOfDate(date){
        return moment(date).format('MMMM');
    }

	function getHoursAndMinutes(hour){
		return moment(hour, "HH:mm:ss").tz(timeTimezone).format("HH:mm");
	}

	function verifyValidHours(hour){
		return moment(hour, "HH:mm:ss").isValid();
	}

	function getMonthNameAbreviation(date){
		return moment(date, strFormat).tz(timeTimezone).format("MMM");
	}

	function getNameOfMonthAndYearForDashboard(){
		return objNowFormattedDashboard.format("MMMM YYYY");
	}

	function getNameOfMonthAndYear(date){
		if(date != null){
			return moment(date, strFormat).tz(timeTimezone).format("MMMM YYYY");
		}else{
			return objMomentjs.format("MMMM YYYY");
		}
	}

    function getNameOfMonth(date){
		if(date != null){
			return moment(date, strFormat).tz(timeTimezone).format("MMMM");
		}else{
			return objMomentjs.format("MMMM");
		}
	}

	function getDayAndMonthFromDate(date) {
		var objNewDateDay = moment(date).format('D');
		var objNewDateMonth = moment(date).format('MMMM');
		return objNewDateDay + " de " + objNewDateMonth;
	}

	function getDaySlashMonth(date) {
		var objNewDateDay = moment(date).format('D');
		var objNewDateMonth = moment(date).format('MM');
		return objNewDateDay + "/" + objNewDateMonth;
	}


	function getFirstDayOfSpecificMonth(intMonth, intYear){
		var objFirstDayOfSpecificMonth = moment("01/" + (intMonth+1) + "/" + intYear, strFormat);
		var objFirstDayOfMonthFormatted = objFirstDayOfSpecificMonth.tz(timeTimezone).format(strFormat);

		return objFirstDayOfMonthFormatted;
	}

	function getLastDayOfSpecificMonth(intMonth, intYear){
		var objFirstDayOfMonth = moment("01/" + (intMonth + 1) + "/" + intYear, strFormat);
		var objFirstDayOfNextMonth = objFirstDayOfMonth.add(1, 'month');
		//Obter ultimo dia do mes anterior, pois ja havia somado um mes anteriormente
		var objLastDayOfLastMonth = objFirstDayOfNextMonth.subtract(1, 'day');

		var objLastDayOfMonthFormatted = objLastDayOfLastMonth.tz(timeTimezone).format(strFormat);

		return objLastDayOfMonthFormatted;
	}

	function getSpecificDateOfYear(intYear){
		var objMomentPersonalized = moment("01/01/" + intYear, strFormat);
		return objMomentPersonalized.tz(timeTimezone).format(strFormat);
	}

	function checkInvalidPeriod(dateInitialDate, dateFinalDate, dateInitialDateChanged, dateFinalDateChanged){
		var objInitialDateMoment = null;
		var objFinalDateMoment = null;

		if(dateInitialDateChanged){
			objInitialDateMoment = this.getMomentOfSpecificDate(formatDate(dateInitialDate, true));
		}else{
			objInitialDateMoment = this.getMomentOfSpecificDate(dateInitialDate);
		}

		if(dateFinalDateChanged){
			objFinalDateMoment = this.getMomentOfSpecificDate(formatDate(dateFinalDate, true));
		}else{
			objFinalDateMoment = this.getMomentOfSpecificDate(dateFinalDate);
		}

		if(objInitialDateMoment.isAfter(objFinalDateMoment) || objFinalDateMoment.isBefore(objInitialDateMoment)){
			return true;
		}else{
			return false;
		}
	}

	function transformBrDateIntoDate(date) {
		var arrParts = date.split("/");
		return new Date(arrParts[2], arrParts[1]-1, arrParts[0], 0, 0, 0, 0);
	}

    return {
		getMomentOfSpecificDate:getMomentOfSpecificDate,
        getUnixMomentOfSpecificDate:getUnixMomentOfSpecificDate,
		getFormat:getFormat,
		getActualDateUploadModal:getActualDateUploadModal,
		getActualDate:getActualDate,
		getFirstDayOfMonth: getFirstDayOfMonth,
		getLastDayOfMonth:getLastDayOfMonth,
        getFirstDayOfYear: getFirstDayOfYear,
		getLastDayOfYear:getLastDayOfYear,
		getYesterdayDate:getYesterdayDate,
        getDayOfWeek: getDayOfWeek,
		getFirstDayOfSpecificMonth: getFirstDayOfSpecificMonth,
		getLastDayOfSpecificMonth: getLastDayOfSpecificMonth,
		getNameOfMonthAndYear: getNameOfMonthAndYear,
        getNameOfMonth: getNameOfMonth,
		formatDate: formatDate,
		getDayOfMonth:getDayOfMonth,
		getLastDayOfLastMonth:getLastDayOfLastMonth,
		getLastDayOfLastMonthForDashboard:getLastDayOfLastMonthForDashboard,
		getActualDayOfCurrentMonth:getActualDayOfCurrentMonth,
		getActualDayOfCurrentMonthForDashboard:getActualDayOfCurrentMonthForDashboard,
		getMonthNameAbreviation:getMonthNameAbreviation,
		getActualDateForDashboard: getActualDateForDashboard,
		getFirstDayOfMonthForDashboard:getFirstDayOfMonthForDashboard,
		getNameOfMonthAndYearForDashboard:getNameOfMonthAndYearForDashboard,
        formatDateForService:formatDateForService,
        formatDateTimeForService:formatDateTimeForService,
        getFirstDayOfLastMonth:getFirstDayOfLastMonth,
        getFirstDayOfLastMonthForDashboard:getFirstDayOfLastMonthForDashboard,
		getDateFromString:getDateFromString,
		getDateFromString: getDateFromString,
		getMonthNumberOfDate:getMonthNumberOfDate,
		getHoursAndMinutes:getHoursAndMinutes,
		verifyValidHours:verifyValidHours,
		addDaysToDate:addDaysToDate,
        addMonthsToDate:addMonthsToDate,
        addYearsToDate:addYearsToDate,
		getYear:getYear,
		getSpecificDateOfYear:getSpecificDateOfYear,
		checkInvalidPeriod:checkInvalidPeriod,
        getDayOfDate:getDayOfDate,
        getMonthNameOfDate:getMonthNameOfDate,
        getLastDayOfCurrentMonth: getLastDayOfCurrentMonth,
        getTomorrowFromToday: getTomorrowFromToday,
		transformBrDateIntoDate: transformBrDateIntoDate,
		getTomorrowFromTodayToDate: getTomorrowFromTodayToDate,
		getLastDayOfPlusMonthToDate: getLastDayOfPlusMonthToDate,
		getToday: getToday,
		getDayAndMonthFromDate: getDayAndMonthFromDate,
		getDaySlashMonth: getDaySlashMonth,
	};
});
