/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */
 
angular.module('KaplenWeb.userService',[])
.config(['$routeProvider','RestangularProvider', function ($routeProvider, RestangularProvider) {

}])

.service('userService', function(Restangular, $window, $location) {

	var company = {id: $window.sessionStorage.company};

	this.saveUser = function(user){
		return Restangular.all('users').customPOST(user, "", {companyId: $window.sessionStorage.company}, {});
	};

	this.editUser = function(user){
		return user.put();
	};

	this.editUserChangePassword = function(user){
		user.route="users/updatecache";
		user.token = "";
		user.firstAccess = false;
		return user.put();
	};

	this.deleteUser = function(user) {
		return user.remove();
	};

	this.getUsersByCompany = function(companyId){
		return Restangular.all('users').getList({companyId:companyId});
	};

	this.getSearch = function(name, email, companyId){
		var param = "";
		if(name != '' && email === ''){
			param = {companyId:companyId, name:name};
			return Restangular.all('users').getList(param);
		}
		else if(name === '' && email != ''){
			param = {companyId:companyId, email:email};
			return Restangular.all('users').getList(param);
		}
		else if(name != '' && email != ''){
			param = {companyId:companyId,  name:name, email:email};
			return Restangular.all('users').getList(param);
		}
	};

	this.getByEmail = function(email) {
		return Restangular.all('users?email='+email).getList();
	};

	this.getTourVendas = function(){
		window.location.assign("#/resumoConciliacao");
	};

});
