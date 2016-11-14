/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.integrationController',['ui.bootstrap', 'angularFileUpload'])

.config(['$routeProvider','RestangularProvider', function ($routeProvider, RestangularProvider) {
	$routeProvider.when('/integration', {templateUrl: 'app/views/vendas/integration.html', controller: 'integrationController'});
}])

.controller('integrationController', function(menuFactory, $scope, $http, FileUploader, $modal, $timeout,
	calendarFactory, app, Request, FileSaver, Blob, $rootScope, $window, advancedFilterService, calendarService, integrationService){
		menuFactory.setActiveIntegration();
		$scope.labelFindFile = true;
		$scope.uploadedFiles = false;
		$scope.downloadFiles = false;
		$scope.sendFile = false;
		$scope.inProgress = false;
		$scope.fileName = [];
        $scope.sortResults = SortResults;
		$scope.sort = "createDate,DESC";

		$scope.typeData = [
			{
				id:1,
				label: 'últimos lançamentos',
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

		$scope.getUploadedFiles = GetUploadedFiles;
		$scope.showSendFile = ShowSendFile;
		$scope.downloadFile = DownloadFile;
		$scope.showDownloadFiles = ShowDownloadFiles;
		$scope.addOther = AddOther;

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

		$scope.pageChanged = PageChanged;
		$scope.totalItensPageChanged = TotalItensPageChanged;

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
				templateUrl: "app/views/vendas/upload-in-progress.html",
				scope: $scope,
				size: 'lg',
				windowClass: "integrationModalWrapper",
				controller: function($modalInstance, $timeout){
                    $scope.cancel = Cancel;
					function Cancel() {
						$scope.uploader.clearQueue();
						modal.close();
						$scope.inProgress = false;
						$scope.labelFindFile = true;
						$scope.sendFile = true;
					}
				}
			})
		}

		$scope.uploader.onSuccessItem = function(item, response, status, headers, $timeout) {
			modal.close();
			$scope.uploader.clearQueue();
			var $modalInstance = $modal.open({
				templateUrl: "app/views/vendas/enviado-com-sucesso.html",
				scope: $scope,
				size: 'lg',
				windowClass: 'integrationModalWrapper',
				controller: function($scope, $modalInstance){
                    $scope.cancel = Cancel;
                    function Cancel() {
                        $modalInstance.dismiss("cancel");
                    }
				}
			})
			$scope.inProgress = false;
			$scope.labelFindFile = true;
		}



		$scope.$watch('typeModel.type', function(response) {
			if(response != 'FUTURE') {
				SetCalendarLastReleases();
			} else {
				SetCalendarFutureReleases();
			}
		});

		$scope.$watch('initialDate', function(response) {
			if(moment($scope.finishDate).isBefore(response)) {
				$scope.finishDate = moment(response).toDate();
			}
		});

		Init();

		function Init() {
			$scope.initialDate = calendarFactory.getToday();
		}

		function SetCalendarLastReleases() {
			var today = calendarFactory.getToday();
			$scope.initialDate = today;
			$scope.finishDate = today;
			$scope.initialMinDate = null;
			$scope.finishMinDate = null;
			$scope.initialMaxDate = today;
			$scope.finishMaxDate = today;
		}

		function SetCalendarFutureReleases() {
			var tomorrow = calendarFactory.getTomorrowFromTodayToDate();
			$scope.initialDate = tomorrow;
			$scope.finishDate = tomorrow;
			$scope.initialMinDate = tomorrow;
			$scope.finishMinDate = tomorrow;
			$scope.initialMaxDate = null;
			$scope.finishMaxDate = null;
		}

		function ShowSendFile() {
			if ($scope.sendFile === false) {
				$scope.uploadedFiles = false;
				$scope.downloadFiles = false;
			}
		}

		function GetUploadedFiles(byName) {
			$scope.sendFile = false;
			$scope.downloadFiles = false;

			if(!$scope.listUploadedFiles.length || byName){
				var filter = {
					page: $scope.currentPage,
					size: $scope.totalItensPage,
					sort: $scope.sort
				};

				if($scope.fileSearch !== "") {
					filter.name = $scope.fileSearch;
					filter.page = 0;
					$scope.currentPage = 0;
				}

				if($scope.currentPage > 0 ) {
					$scope.currentPage = $scope.currentPage + 1;
				}

				integrationService.GetUploadedFiles(filter).then(function(response){
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

		function ShowDownloadFiles() {
			$scope.uploadedFiles = false;
			$scope.sendFile = false;
		}
		function DownloadFile () {
			var filter = {
				startDate: calendarFactory.formatDateTimeForService($scope.initialDate),
				endDate: calendarFactory.formatDateTimeForService($scope.finishDate),
				shopIds: JSON.parse($window.sessionStorage.user).pvList.map(function(item){
					return item.id;
				}).join(","),
				type: $scope.typeModel.type
			}

			integrationService.DownloadFiles(filter).then(function(response){
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

		function AddOther() {
			$scope.uploader.clearQueue();
			$scope.labelFindFile = true;
		}

		function PageChanged() {
			$scope.currentPage = this.currentPage - 1;
			GetUploadedFiles(true);
		};

		function TotalItensPageChanged() {
			this.currentPage = $scope.currentPage = 0;
			$scope.totalItensPage = this.totalItensPage;
			GetUploadedFiles(true);
		};

        function SortResults(elem,kind) {
			var order_string;
			order_string = $rootScope.sortResults(elem,kind);

			$scope.sort = order_string;
			GetUploadedFiles(true);

		};

    });
