angular.module('KaplenWeb.terminalService',[])
	.config(['$routeProvider','RestangularProvider', function ($routeProvider, RestangularProvider) {
	
}])

.service('terminalService', function(Restangular, $window) {
	
	var company = {id: $window.sessionStorage.company};

	this.saveTerminal = function(terminal){
		terminal.company = company;
		return Restangular.all('terminals').post(terminal);
	};

	this.editTerminal = function(terminal){
		return terminal.put();
	};

	this.deleteTerminal = function(terminal) {
		return terminal.remove();
	};

	this.getTerminalByCompany = function(){
		return Restangular.all('terminals').getList({companyId:company.id});
	};

	this.getSearch = function(name, terminalCode){
		var param = "";
		if(name != '' && terminalCode === ''){
			param = {companyId:company.id, name:name};
			return Restangular.all('terminals').getList(param);
		}
		else if(name === '' && terminalCode != ''){
			param = {companyId:company.id, terminalCode:terminalCode};
			return Restangular.all('terminals').getList(param);
		}
		else if(name != '' && terminalCode != ''){
			param = {companyId:company.id,  name:name, terminalCode:terminalCode};
			return Restangular.all('terminals').getList(param);
		}		
	};
});