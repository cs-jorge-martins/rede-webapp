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
		];
		$scope.typeModel = {"id": 1, type: 'CURRENT'}


		$scope.initialDate = [];
		$scope.finishDate = [];

		$scope.getUploadedFiles = getUploadedFiles;
		$scope.showSendFile = showSendFile;
		$scope.downloadFile = downloadFile;
		$scope.showDownloadFiles = showDownloadFiles;
		$scope.addOther = addOther;

		$scope.fileSearch = '';
		$scope.listUploadedFiles = [];

		$scope.shopsData = [];
		$scope.shopIds = [];
		$scope.shopsFutureModel = [];
		$scope.shopsModel = [];

		/* pagination */
		$scope.maxSize = 4;
		$scope.totalItensPage = 10;
        $scope.currentPage = 0;
		$scope.totalItens = 0;

		$scope.pageChanged = pageChanged;
		$scope.totalItensPageChanged = totalItensPageChanged;

		$scope.uploader = new FileUploader({
			disableMultipart: true,
			url: app.endpoint + "/integration/files",
			headers: Request.setHeaders()
		});

		$scope.uploader.onAfterAddingFile = function (fileItem) {
			$scope.labelFindFile = false;
			$scope.inProgress = true;
			$scope.fileName = fileItem.file.name;
			fileItem.url += "?fileName=" + $scope.fileName;
		}

		var modal;
		$scope.uploader.onBeforeUploadItem = function(item){
			modal = $modal.open({
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
			modal.close();
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



		$scope.$watch('typeModel.type', function(response) {
			if(response != 'FUTURE') {
				setCalendarLastReleases();
			} else {
				setCalendarFutureReleases();
			}
		});

		$scope.$watch('initialDate', function(response) {
			if(moment($scope.finishDate).isBefore(response)) {
				$scope.finishDate = moment(response).toDate();
			}
		});

		init();

		function init() {
			$scope.initialDate = calendarFactory.getToday();
		}

		function setCalendarLastReleases() {
			var today = calendarFactory.getToday();
			$scope.initialDate = today;
			$scope.finishDate = today;
			$scope.initialMinDate = null;
			$scope.finishMinDate = null;
			$scope.initialMaxDate = today;
			$scope.finishMaxDate = today;
		}

		function setCalendarFutureReleases() {
			var tomorrow = calendarFactory.getTomorrowFromTodayToDate();
			$scope.initialDate = tomorrow;
			$scope.finishDate = tomorrow;
			$scope.initialMinDate = tomorrow;
			$scope.finishMinDate = tomorrow;
			$scope.initialMaxDate = null;
			$scope.finishMaxDate = null;
		}

		function showSendFile() {
			if ($scope.sendFile === false) {
				$scope.uploadedFiles = false;
				$scope.downloadFiles = false;
			}
		}

		function getUploadedFiles(byName) {
			$scope.sendFile = false;
			$scope.downloadFiles = false;

			if(!$scope.listUploadedFiles.length || byName){
				var filter = {
					page: $scope.currentPage,
					size: $scope.totalItensPage,
					sort: 'createDate,DESC'
				};

				if($scope.fileSearch !== "") {
					filter.name = $scope.fileSearch;
					filter.page = 0;
					$scope.currentPage = 0;
				}

				if($scope.currentPage > 0 ) {
					$scope.currentPage = $scope.currentPage + 1;
				}


				integrationService.getUploadedFiles(filter).then(function(response){
					$scope.listUploadedFiles = [];
					var data = response.data.content;
					var pagination = response.data.page;

					for (var i in data) {
						$scope.listUploadedFiles.push(data[i]);
					}

					$scope.totalItens = pagination.totalElements;
				}).catch(function(response){

				}).finally(function(){

				});
			}
		}

		function showDownloadFiles() {
			$scope.uploadedFiles = false;
			$scope.sendFile = false;
		}
		function downloadFile () {
			var filter = {
				startDate: calendarFactory.formatDateTimeForService($scope.initialDate),
				endDate: calendarFactory.formatDateTimeForService($scope.finishDate),
				// shopIds: JSON.parse($window.sessionStorage.user).pvList[0].id,
				shopIds: JSON.parse($window.sessionStorage.user).pvList.map(function(item){
					return item.id;
				}).join(","),
				type: $scope.typeModel.type
			}

			integrationService.downloadFiles(filter).then(function(response){
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

		function addOther() {
			$scope.uploader.clearQueue();
			$scope.labelFindFile = true;
		}

		function pageChanged() {
			$scope.currentPage = this.currentPage - 1;
			getUploadedFiles(true);
		};

		function totalItensPageChanged() {
			this.currentPage = $scope.currentPage = 0;
			$scope.totalItensPage = this.totalItensPage;
			getUploadedFiles(true);
		};

    });
