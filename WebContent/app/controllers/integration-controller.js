/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

"use strict";

angular.module('Conciliador.integrationController',['ui.bootstrap', 'angularFileUpload'])

.controller('integrationController', function(menuFactory, $scope, $http, FileUploader, $uibModal, $timeout,
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

		$scope.typeModel = {"id": 1, type: 'CURRENT'};
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
		$scope.totalItensPageOptions = [10,20,50];
		$scope.totalItensPage = $scope.totalItensPageOptions[0];
        $scope.currentPage = 0;
		$scope.totalItens = 0;

		$scope.pageChanged = PageChanged;
		$scope.totalItensPageChanged = TotalItensPageChanged;

		// adicionado para corrigir erro ao tentar fazer upload do mesmo arquivo em sequencia
		// ver https://github.com/nervgh/angular-file-upload/wiki/FAQ#4-no-file-chosen-or-re-add-same-file
		FileUploader.FileSelect.prototype.isEmptyAfterSelection = function() {
			return true;
		};

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
		};

		var objModal;
		$scope.uploader.onBeforeUploadItem = function(){
			objModal = $uibModal.open({
				templateUrl: "app/views/vendas/upload-in-progress.html",
				scope: $scope,
				size: 'lg',
				windowClass: "integrationModalWrapper",
				appendTo:  angular.element(document.querySelector('#modalWrapperV1')),
				controller: function(){
					$scope.cancel = Cancel;
					function Cancel() {
						$scope.uploader.clearQueue();
						objModal.close();
						$scope.inProgress = false;
						$scope.labelFindFile = true;
						$scope.sendFile = true;
					}
				}
			});
		};

		$scope.uploader.onCompleteItem = function() {
            objModal.close();
            $scope.uploader.clearQueue();
            $scope.inProgress = false;
            $scope.labelFindFile = true;
            $scope.fileName = '';
		};

		$scope.uploader.onSuccessItem = function() {
			$uibModal.open({
				templateUrl: "app/views/vendas/enviado-com-sucesso.html",
				scope: $scope,
				size: 'lg',
				windowClass: 'integrationModalWrapper',
				appendTo:  angular.element(document.querySelector('#modalWrapperV1')),
				controller: function($scope, $uibModalInstance){
                    $scope.cancel = Cancel;
                    function Cancel() {
                        $uibModalInstance.dismiss("cancel");
                    }
				}
			});
		};

		$scope.uploader.onErrorItem = function onError(item, response, status) {
			if (status === 403) {
                $rootScope.showAlert('app/views/action-forbidden.html');
            }
		};

		$scope.$watch('typeModel.type', function(objResponse) {
			if(objResponse !== 'FUTURE') {
				SetCalendarLastReleases();
			} else {
				SetCalendarFutureReleases();
			}
		});

		$scope.$watch('initialDate', function(objResponse) {
			if(moment($scope.finishDate).isBefore(objResponse)) {
				$scope.finishDate = moment(objResponse).toDate();
			}
		});

		Init();

		function Init() {
			$scope.initialDate = calendarFactory.getToday();
		}

		function SetCalendarLastReleases() {
			var objToday = calendarFactory.getToday();
			$scope.initialDate = objToday;
			$scope.finishDate = objToday;
			$scope.initialMinDate = null;
			$scope.initialMaxDate = objToday;
			$scope.finishMinDate = $scope.initialDate;
			$scope.finishMaxDate = objToday;
		}

		function SetCalendarFutureReleases() {
			var objTomorrow = calendarFactory.getTomorrowFromTodayToDate();
			$scope.initialDate = objTomorrow;
			$scope.finishDate = objTomorrow;
			$scope.initialMinDate = objTomorrow;
			$scope.initialMaxDate = null;
			$scope.finishMinDate = $scope.initialDate;
			$scope.finishMaxDate = null;
		}

		function ShowSendFile() {
			if ($scope.sendFile === false) {
				$scope.uploadedFiles = false;
				$scope.downloadFiles = false;
			}
		}

		function GetUploadedFiles(bolByName) {
			$scope.sendFile = false;
			$scope.downloadFiles = false;

			if(!$scope.listUploadedFiles.length || bolByName){
				var objFilter = {
					page: $scope.currentPage,
					size: $scope.totalItensPage,
					sort: $scope.sort
				};

				if($scope.fileSearch !== "") {
					objFilter.name = $scope.fileSearch;
					objFilter.page = 0;
					$scope.currentPage = 0;
				}

				if($scope.currentPage > 0 ) {
					$scope.currentPage = $scope.currentPage + 1;
				}

				integrationService.GetUploadedFiles(objFilter).then(function(objResponse){
					$scope.listUploadedFiles = [];
					var objData = objResponse.data.content;
					var objPagination = objResponse.data.page;

					for (var intIndex in objData) {
						$scope.listUploadedFiles.push(objData[intIndex]);
					}

					$scope.totalItens = objPagination.totalElements;
				}).catch(function(){
					// TODO: implementar erro
				});
			}
		}

		function ShowDownloadFiles() {
			$scope.uploadedFiles = false;
			$scope.sendFile = false;
		}
		function DownloadFile () {
			var objFilter = {
				startDate: calendarFactory.formatDateTimeForService($scope.initialDate),
				endDate: calendarFactory.formatDateTimeForService($scope.finishDate),
				shopIds: JSON.parse($window.sessionStorage.user).pvList.map(function(item){
					return item.id;
				}).join(","),
				type: $scope.typeModel.type
			};

			integrationService.DownloadFiles(objFilter, function success(objResponse){
				// dispara evento para rc-downloader adicionar download na fila
				$rootScope.$broadcast('download-init', objResponse.data);
			}, function error(objResponse){
                var strMsg;

                if(objResponse.status === 408){
                    strMsg = "O período escolhido não pôde ser processado devido ao grande número de transações. Por favor escolha um período menor.";
                }
                $rootScope.alerts =  [ { type: "danger", msg: strMsg} ];
            });
		}

		function AddOther() {
			$scope.uploader.clearQueue();
			$scope.labelFindFile = true;
		}

		function PageChanged() {
			$scope.currentPage = this.currentPage - 1;
			GetUploadedFiles(true);
		}

		function TotalItensPageChanged() {
			this.currentPage = $scope.currentPage = 0;
			$scope.totalItensPage = this.totalItensPage;
			GetUploadedFiles(true);
		}

        function SortResults(objElem, strKind) {
			var strOrderString;
			strOrderString = $rootScope.sortResults(objElem, strKind);

			$scope.sort = strOrderString;
			GetUploadedFiles(true);
		}
    });
