/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Kaplen.CalendarFactory',[])
.factory('calendarFactory', function() {

    var format = "DD/MM/YYYY";

	var timezone = "America/Brasilia";
	moment.locale('pt-BR');
	var momentjs = moment();
	var momentForDashboard = moment();
	var nowFormattedDashboard = momentForDashboard.tz(timezone).subtract(1, 'days');
	var firstDayOfMonth = moment("01/" + (momentjs.month()+1) + "/" + momentjs.year(), format);
	var firstDayOfMonthFormatted = firstDayOfMonth.tz(timezone).format(format);

	var firstDayOfCurrentMonth = moment("01/" + (moment().month()+1) + "/" + moment().year());
	var actualDayOfCurrentMonth = moment().date() == 1 ? moment().tz(timezone) : moment().tz(timezone).subtract(1, 'days');

	var firstDayOfLastMonth = moment((moment().month()) + "/"+ "01/" + + moment().year());
	var lastDayOfLastMonth = moment().tz(timezone).subtract(1, 'months').endOf('month');

	var firstDayOfLastMonthDashboard = moment((momentForDashboard.month()) + "/"+ "01/" + + moment().year());
	var lastDayOfLastMonthDashboard = moment((momentForDashboard)).tz(timezone).subtract(1, 'months').endOf('month');

	function getToday() {
		return moment().toDate();
	}

	function getDateFromString(value, format){
		return moment = moment(value,format);
	}

	function getFirstDayOfMonth(){
		return firstDayOfCurrentMonth;
	}

	function getActualDayOfCurrentMonth(){
		return actualDayOfCurrentMonth;
	}

	function getActualDayOfCurrentMonthForDashboard(){
		return nowFormattedDashboard;
	}

	function getFirstDayOfLastMonth(){
		return firstDayOfLastMonth;
	}

	function getFirstDayOfLastMonthForDashboard(){
		return firstDayOfLastMonthDashboard;
	}

	function getLastDayOfLastMonth(){
		return lastDayOfLastMonth;
	}

	function getLastDayOfLastMonthForDashboard(){
		return lastDayOfLastMonthDashboard;
	}

	function getActualDateForDashboard(){
		return nowFormattedDashboard.format(format);
	}

	function getMomentOfSpecificDate(date){
		return moment(date, format).tz(timezone);
	}

    function getUnixMomentOfSpecificDate(date){
		return moment.unix(date, format).tz(timezone);
	}

	function getFormat() {
		return format;
	}

	function getActualDate() {
		return moment().tz(timezone).format(format);
	}
	function getLastDayOfCurrentMonth() {
		return getLastDayOfMonth();
	}
	function getTomorrowFromToday() {
		return moment().add(1, 'day').tz(timezone).format(format);
	}

	/**
	 * retorna o dia de ontem em date
	 * @returns date
	 */
	function getTomorrowFromTodayToDate() {
		return moment().add(1, 'day').tz(timezone).toDate();
	}
	function getActualDateUploadModal() {
		return moment().tz(timezone).format("DD/MM/YYYY HH:mm:ss");
	}

	function getYesterdayDate(){
		var today = moment().tz(timezone);
		//Obter ultimo dia do mes anterior, pois ja havia somado um mes anteriormente
		var yesterday = today.subtract(1, 'day');
		return yesterday.tz(timezone).format(format);
	}

	function getFirstDayOfMonthForDashboard() {
		var firstDayOfMonthDashboard = moment("01/" + (nowFormattedDashboard.month()+1) + "/" + nowFormattedDashboard.year(), format);
		return firstDayOfMonthDashboard.tz(timezone).format(format);
	}

	function getFirstDayOfMonth(date) {
        if( date ) {
            var initialDateMoment = moment(date, format).startOf('month');
        } else {
            var initialDateMoment = momentjs.startOf('month');
        }
		return initialDateMoment.tz(timezone).format(format);
	}

	function getLastDayOfMonth(date, raw) {
        if( date ) {
            var finalDateMoment = moment(date, format).endOf('month');
        } else {
            var finalDateMoment = momentjs.endOf('month');
        }

        if(raw) {
            return finalDateMoment.date();
        }
		return finalDateMoment.tz(timezone).format(format);
	}

	/**
	 * Pega o ultimo dia de um date e retorna o proximo mês em Date
	 * @param date
	 * @returns date
	 */
	function getLastDayOfMonthToDate(date) {
        if( date ) {
            var finalDateMoment = moment(date).endOf('month');
        }
		return finalDateMoment.toDate();
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
        return moment(date, format).day();
    }

    function getFirstDayOfYear(year) {
        return year + "0101";
	}

	function getLastDayOfYear(year) {
		return year + "1201";
	}

	function formatDate(date, isDiferentFormat) {
		if(isDiferentFormat){
			return moment(date).tz(timezone).format("DD/MM/YYYY");
		}else{
			return moment(date, format).tz(timezone).format(format);
		}
	}


    function formatDateForService(date) {
        var momentTemp = moment(date, format).tz(timezone);
		return momentTemp.format("YYYYMMDD");
    }

    function formatDateTimeForService(date) {
		if(date) {
			var dateAux = formatDateForService(date);
			return (dateAux === 'Invalid date') ? (moment(date).tz(timezone)).format("YYYYMMDD") : dateAux;
		}
		else {
			return date;
		}
    }

	function getDateFromString(date){
		return moment(date, format);
	}

	function addDaysToDate(date, qtd){
		 var resultMoment = moment(date, format);
		 var resultAddMoment = resultMoment.add(qtd, 'day');

		 return resultAddMoment.tz(timezone);
	}

    function addMonthsToDate(date, qtd){
		 var resultMoment = moment(date, format);
		 var resultAddMoment = resultMoment.add(qtd, 'month');

		 return resultAddMoment.tz(timezone);
	}

	/**
	 * função para somar meses em uma data sem formato
	 * @param date
	 * @param qtd
	 * @returns date
	 */
    function addMonthsOnDate(date, qtd){
		 var resultMoment = moment(date).add(qtd, 'month');
		 return resultMoment.toDate();
	}

    function addYearsToDate(date, qtd){
		 var resultMoment = moment(date, format);
		 var resultAddMoment = resultMoment.add(qtd, 'year');

		 return resultAddMoment.tz(timezone);
	}

	function getYear(date){
		var momentTemp = moment(date, format).tz(timezone);
		return momentTemp.format("YYYY");
	}

	function getMonthNumberOfDate(date){
		var momentFunction =  moment(date, format).tz(timezone);

		return momentFunction.month()+1;
	}

	function getDayOfMonth(date){
		return moment(date, format).tz(timezone).format("D");
    }

    function getDayOfDate(date){
        return moment(date).get('date');
    }

    function getMonthNameOfDate(date){
        return moment(date).format('MMMM');
    }

	function getHoursAndMinutes(hour){
		return moment(hour, "HH:mm:ss").tz(timezone).format("HH:mm");
	}

	function verifyValidHours(hour){
		return moment(hour, "HH:mm:ss").isValid();
	}

	function getMonthNameAbreviation(date){
		return moment(date, format).tz(timezone).format("MMM");
	}

	function getNameOfMonthAndYearForDashboard(){
		return nowFormattedDashboard.format("MMMM YYYY");
	}

	function getNameOfMonthAndYear(date){
		if(date != null){
			return moment(date, format).tz(timezone).format("MMMM YYYY");
		}else{
			return momentjs.format("MMMM YYYY");
		}
	}

    function getNameOfMonth(date){
		if(date != null){
			return moment(date, format).tz(timezone).format("MMMM");
		}else{
			return momentjs.format("MMMM");
		}
	}

	function getDayAndMonthFromDate(date) {
		var new_date_day = moment(date).format('D');
		var new_date_month = moment(date).format('MMMM');
		return new_date_day + " de " + new_date_month;
	}

	function getDaySlashMonth(date) {
		var new_date_day = moment(date).format('D');
		var new_date_month = moment(date).format('MM');
		return new_date_day + "/" + new_date_month;
	}


	function getFirstDayOfSpecificMonth(month, year){
		var firstDayOfSpecificMonth = moment("01/" + (month+1) + "/" + year, format);
		var firstDayOfMonthFormatted = firstDayOfSpecificMonth.tz(timezone).format(format);

		return firstDayOfMonthFormatted;
	}

	function getLastDayOfSpecificMonth(month, year){
		var firstDayOfMonth = moment("01/" + (month+1) + "/" + year, format);
		var firstDayOfNextMonth = firstDayOfMonth.add(1, 'month');
		//Obter ultimo dia do mes anterior, pois ja havia somado um mes anteriormente
		var lastDayOfLastMonth = firstDayOfNextMonth.subtract(1, 'day');

		var lastDayOfMonthFormatted = lastDayOfLastMonth.tz(timezone).format(format);

		return lastDayOfMonthFormatted;
	}

	function getSpecificDateOfYear(year){
		var momentPersonalized = moment("01/01/" + year, format);
		return momentPersonalized.tz(timezone).format(format);
	}

	function checkInvalidPeriod(initialDate, finalDate, initialDateChanged, finalDateChanged){
		var initialDateMoment = null;
		var finalDateMoment = null;

		if(initialDateChanged){
			initialDateMoment = this.getMomentOfSpecificDate(formatDate(initialDate, true));
		}else{
			initialDateMoment = this.getMomentOfSpecificDate(initialDate);
		}

		if(finalDateChanged){
			finalDateMoment = this.getMomentOfSpecificDate(formatDate(finalDate, true));
		}else{
			finalDateMoment = this.getMomentOfSpecificDate(finalDate);
		}

		if(initialDateMoment.isAfter(finalDateMoment) || finalDateMoment.isBefore(initialDateMoment)){
			return true;
		}else{
			return false;
		}
	}

	function transformBrDateIntoDate(date) {
		var parts = date.split("/");
		return new Date(parts[2], parts[1]-1, parts[0], 0, 0, 0, 0);
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
