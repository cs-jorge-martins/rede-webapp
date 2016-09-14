angular.module('Conciliador.integrationController',['ui.bootstrap', 'angularFileUpload'])

.config(['$routeProvider','RestangularProvider', function ($routeProvider, RestangularProvider) {
	$routeProvider.when('/integration', {templateUrl: 'app/views/vendas/integration.html', controller: 'integrationController'});
}])

.controller('integrationController', function(menuFactory, $scope, $http, FileUploader, $modal, 
	calendarFactory, app, Request, FileSaver, Blob, $rootScope, $window, advancedFilterService, calendarService, integrationService, filtersService){

		menuFactory.setActiveIntegration();
		$scope.labelFindFile = true;
		$scope.uploadedFiles = false;
		$scope.downloadFiles = false;
		$scope.sendFile = false;
		$scope.inProgress = false;
		$scope.fileName = [];

		$scope.typeModel = [];
		$scope.typeData = [
			{
				id:1, 
				label: 'ultimos lançamentos',
				type: 'CURRENT'
			},
			{
				id: 2, 
				label: 'lançamentos futuros',
				type: 'FUTURE'
			}
		]

		$scope.initialDate = [];
		$scope.finishDate = [];

		$scope.getUploadedFiles = getUploadedFiles;
		$scope.showSendFile = showSendFile;
		$scope.downloadFile = downloadFile;
		$scope.showDownloadFiles = showDownloadFiles;
		$scope.searchFileByName = searchFileByName;

		$scope.fileSearch = '';
		$scope.listUploadedFiles = [];
		
		$scope.shopsData = [];
		$scope.shopIds = [];
		$scope.shopsFutureModel = [];
		$scope.shopsModel = [];

		$scope.uploader = new FileUploader({
			disableMultipart: true,
			url: app.endpoint + "/integration/files",
			headers: Request.setHeaders(),
		});
		
		$scope.uploader.onAfterAddingFile = function (fileItem) {
			console.log(fileItem);
			$scope.labelFindFile = false;
			$scope.inProgress = true;
			$scope.fileName = fileItem.file.name;
			fileItem.url += "?fileName=" + $scope.fileName;
		}

		$scope.uploader.onBeforeUploadItem = function(item){
			var $modalInstance = $modal.open({
				templateUrl: "app/views/vendas/uploadInProgress.html",
				scope: $scope,
				size: 'lg',
				windowClass: "integrationModalWrapper",
				controller: function($scope, $modalInstance){
					$scope.cancel = function() {
						$modalInstance.dismiss("cancel");
					}
				}
			})
		}

		$scope.uploader.onSuccessItem = function(item, response, status, headers) {
			$scope.uploader.clearQueue();
			var $modalInstance = $modal.open({
				templateUrl: "app/views/vendas/enviadoComSucesso.html",
				scope: $scope,
				size: 'lg',
				windowClass: 'integrationModalWrapper',
				controller: function($scope, $modalInstance){
					$scope.cancel = function (){
						$modalInstance.dismiss("cancel");
					}
				}
			})
			$scope.inProgress = false;
			$scope.labelFindFile = true;
		}

		function showSendFile() {
			if ($scope.sendFile === false) {
				$scope.uploadedFiles = false;	
				$scope.downloadFiles = false;
			}
		}

		function getUploadedFiles() {
			$scope.fileSearch = '';
			if ($scope.uploadedFiles === false) {
				$scope.sendFile = false;
				integrationService.getUploadedFiles().then(function(response){
					$scope.listUploadedFiles = [];
					var data = response.data.content;
					for (var i in data) {
						$scope.listUploadedFiles.push(data[i]);
					}
				}).catch(function(response){

				}).finally(function(){

				})	
			}
		}

		function searchFileByName () {
			$scope.listUploadedFiles = [];
			var filter = {
				name: $scope.fileSearch
			}
			integrationService.getUploadedFiles(filter).then(function(response){
				var data = response.data.content;
				for (var i in data) {
					$scope.listUploadedFiles.push(data[i]);
					console.log($scope.listUploadedFiles);
				}
			})
		}

		function showDownloadFiles() {
			$scope.uploadedFiles = false;
			$scope.sendFile = false;
		}
		function downloadFile () {
			var filter = {
				startDate: calendarFactory.formatDateTimeForService($scope.initialDate),
				endDate: calendarFactory.formatDateTimeForService($scope.finishDate),
				shopIds: JSON.parse($window.sessionStorage.user).pvList[0].id,
				type: $scope.typeModel.type
			}
			integrationService.downloadFiles(filter).then(function(response){
				console.log("response", response.data);

				var vm = this;

				vm.val = {
					text: response.data
				}
				vm.download = function (text) {
					var data = new Blob([text], {type: 'text/csv'});
					FileSaver.saveAs(data, 'planilha.csv');
				};
				vm.download(vm.val.text);
			})
		}
    });
