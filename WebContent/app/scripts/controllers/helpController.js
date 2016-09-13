
angular.module('Conciliador.helpController',[])

.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {
	$routeProvider.when('/help', {templateUrl: 'app/views/help.html', controller: 'helpController'});
}]).controller('helpController', function($scope, $rootScope, menuFactory, $location,
	userService, cacheService, $sce){


	menuFactory.deactivate();

    $scope.video = {
        sources: [
            {src: $sce.trustAsResourceUrl("http://dev-conciliation-webapp.s3-website-us-east-1.amazonaws.com/app/videos/video-treinamento.mp4"), type: "video/mp4"},
            {src: $sce.trustAsResourceUrl("http://dev-conciliation-webapp.s3-website-us-east-1.amazonaws.com/app/videos/video-treinamento.webm"), type: "video/webm"},
            {src: $sce.trustAsResourceUrl("http://dev-conciliation-webapp.s3-website-us-east-1.amazonaws.com/app/videos/video-treinamento.ogg"), type: "video/ogg"}
        ],
        theme: "app/css/videogular.min.css",
        plugins: {
            poster: "/app/img/videoPoster.jpg",
            controls: {
                autoHide: true,
                autoHideTime: 1000
            }
        }
    };


	init();

	function init(){
        console.log('');
    }

});
