/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

angular.module('Conciliador.helpController',[])

.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/help', {templateUrl: 'app/views/help.html', controller: 'helpController'});
}]).controller('helpController', function($scope, $rootScope, menuFactory, $location, cacheService, $sce){

	menuFactory.deactivate();

    $scope.video = {
        sources: [
            {src: $sce.trustAsResourceUrl("app/videos/video-treinamento.mp4"), type: "video/mp4"},
            {src: $sce.trustAsResourceUrl("app/videos/video-treinamento.webm"), type: "video/webm"},
            {src: $sce.trustAsResourceUrl("app/videos/video-treinamento.ogg"), type: "video/ogg"}
        ],
        theme: "app/css/videogular.min.css",
        plugins: {
            poster: "app/img/videoPoster2.png",
            controls: {
                autoHide: true,
                autoHideTime: 1000
            }
        }
    };

});
