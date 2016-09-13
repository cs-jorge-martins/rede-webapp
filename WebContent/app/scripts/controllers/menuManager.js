app.controller('tokenController', function($scope, $modal, tokenService, $window, $rootScope){

	$scope.getTokenAPI = function() {
		var modalInstance = $modal.open({
			templateUrl: 'app/views/menu/tokenApi.html',
			controller: function($scope, $modalInstance, $rootScope, $window) {

				if($rootScope.tokenApi != null && $rootScope.tokenApi != "null"){
					$scope.msg = "Seu Token é:";
				}else{
					$scope.msg = 'Você não possui token cadastrado. Clique no botão abaixo para';
				}

				$scope.token = $rootScope.tokenApi;

				$scope.updateToken = function(){
					tokenService.updateToken($rootScope.company).then(function(token){
						$scope.token = token;
						$rootScope.tokenApi = $window.sessionStorage.tokenApi = token;

						var companies = [];
						var companyId = parseInt($rootScope.company);

						angular.forEach($rootScope.user.companyDTOs, function(company, index){
							if(company.ID === companyId){
								company.token = token;
							}
							companies.push(company);

						});

						$rootScope.user.companyDTOs = companies;
						$window.sessionStorage.user = JSON.stringify($rootScope.user);

						if($rootScope.tokenApi != null && $rootScope.tokenApi != "null"){
							$scope.msg = "Seu novo Token é:";
						}else{
							$scope.msg = "Seu Token é:";
						}
					});
				};

				$scope.cancel = function () {
					$modalInstance.dismiss('cancel');
				};
			}
		});
	};
})

.service('tokenService', function(Restangular) {
	this.updateToken = function(companyId){
		return Restangular.one('token/updateToken').get({companyId:companyId});
	};
});

app.controller('selectEmpresaController', function($scope, selectEmpresaService){

	$scope.selectdCompanies = function() {
		selectEmpresaService.select();
	};


}).service('selectEmpresaService', function($rootScope, $modal, $window, $location, cacheService) {

	this.select = function(isFirstAccess) {

		var modalInstance = $modal.open({
			templateUrl: 'app/views/menu/selectEmpresas.html',
			resolve: {
				getCompanies: function() {
					return $rootScope.companies;
				}
			},
			controller: function($scope, $window, $modalInstance, $location, getCompanies) {

				$scope.companies = getCompanies;
				$scope.buttonActive = true;

				$scope.activeButton = function(company) {
					$scope.company = company;
					if($window.sessionStorage.company === $scope.company.ID.toString()){
						$scope.buttonActive = true;
					}
					else{
						$scope.buttonActive = false;
					}
				};

				$scope.selectedCompany = function() {
					$modalInstance.close($scope.company);
				};

				$scope.cancel = function () {
					$modalInstance.dismiss('cancel');
				};
			}
		});

		modalInstance.result.then(function (company) {
			$window.sessionStorage.company = $rootScope.company = company.ID;
			$window.sessionStorage.tokenApi = $rootScope.tokenApi = company.token;
			$window.sessionStorage.companyName = $rootScope.companyName = company.name;
			$window.sessionStorage.schemaName = company.schemaName;
			$window.sessionStorage.currencies = JSON.stringify(company.companyCurrencyDTOs);

			angular.forEach(company.companyCurrencyDTOs, function(companyCurrency, index){
				if(companyCurrency.currencyDefault){
					$window.sessionStorage.currency = companyCurrency.value;
					$rootScope.currencySymbol = $window.sessionStorage.currencySymbol = companyCurrency.symbol;
				}
			});

			cacheService.instanceCache(company.ID);

			if(isFirstAccess){	
				$location.path("/firstAccess");
			} else {
				$location.path("/dashboard");
			}

		});

	}
});
