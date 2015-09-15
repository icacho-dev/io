// Ionic Starter App
angular.module('app', ['ionic', 'app.controllers', 'app.services'])

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

	$ionicConfigProvider.backButton.previousTitleText(false);
	$ionicConfigProvider.backButton.icon('ion-chevron-left');
	$ionicConfigProvider.backButton.text('');
	
    $stateProvider
        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/app-menu.html"
        })
        .state('app.home', {
            url: "/home",
            views: {
                'menuContent': {
                    templateUrl: "templates/app-home.html"
                }
            }
        })
        .state('app.schedule', {
            url: "/schedule",
            views: {
                'menuContent': {
                    templateUrl: "templates/schedule.html"
                }
            }
        })
        .state('app.event', {
            url: "/event/:Id/:TypeFilter",
            views: {
                'menuContent': {
                    templateUrl: "templates/event.html"
                }
            }
        })
        .state('app.places', {
            url: "/places",
            views: {
                'menuContent': {
                    templateUrl: "templates/places.html"
                }
            }
        })
        .state('app.sponsor', {
            url: "/sponsor",
            views: {
                'menuContent': {
                    templateUrl: "templates/sponsor.html"
                }
            }
        })
        .state('app.official', {
            url: "/official",
            views: {
                'menuContent': {
                    templateUrl: "templates/official.html"
                }
            }
        })
        .state('app.winners', {
            url: "/winners",
            views: {
                'menuContent': {
                    templateUrl: "templates/winners.html"
                }
            }
        })
        .state('app.shortfilm', {
            url: "/shortfilm/:id",
            views: {
                'menuContent': {
                    templateUrl: "templates/shortfilm.html"
                }
            }
        })
    ;

    $urlRouterProvider.otherwise("/app/home");

})

//.run(function ($ionicPlatform, $ionicHistory) {
//    $ionicPlatform.onHardwareBackButton(function (e) {

//        console.info('onHardwareBackButton');
//        $ionicHistory.backView();
//        e.preventDefault();
//        return false;
//    }, 101);
//})
;
