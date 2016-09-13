angular.module('KaplenWeb.optionsService',[])
.config(['$routeProvider','RestangularProvider', function ($routeProvider, RestangularProvider) {

}])

.service('optionsService', function(Restangular) {

	var url = getDominio('users') + '';
	this.getUser = function() {
		return Restangular.oneUrl('users', url).get();
	};
	
	this.renewPassword = function(email) {
		return Restangular.all('options/renewPassword').post({email:email});
	};
	
	this.changePassword = function(user) {
		//return Restangular.allUrl('options', getDominio('settings') +  'options/changePassword').post(user);
		return Restangular.oneUrl('changePassword', getDominio('settings') +  'options/changePassword/' + user.id)
			.customPUT(user, "", {}, {});
	};
	
});