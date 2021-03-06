/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

"use strict";

angular.module('Conciliador.helpController',[])

.controller('helpController', function($scope, $rootScope, menuFactory, $location, cacheService, $sce){

	menuFactory.deactivate();

    $scope.video = {
        sources: [
            {src: $sce.trustAsResourceUrl("app/videos/video-treinamento.mp4"), type: "video/mp4"},
            {src: $sce.trustAsResourceUrl("app/videos/video-treinamento.webm"), type: "video/webm"},
            {src: $sce.trustAsResourceUrl("app/videos/video-treinamento.ogg"), type: "video/ogg"}
        ],
        theme: "assets/css/videogular.min.css",
        plugins: {
            poster: "assets/img/videoPoster2.png",
            controls: {
                autoHide: true,
                autoHideTime: 1000
            }
        }
    };

});
