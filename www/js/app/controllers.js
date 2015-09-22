
angular.module('app.controllers', ['ionic'])
  .controller('appCtrl', [
    '$scope', '$rootScope', 'AppService', '$ionicLoading', '$state', '$filter', '$ionicSideMenuDelegate',
    function($scope, $rootScope, AppService, $ionicLoading, $state, $filter, $ionicSideMenuDelegate) {
      //------------------------
      $scope.App = {};
      $scope.OfficialSelection = {};
      $scope.loadingOfficialSelection = false;
      $scope.EventDetail = {};
      $scope.Winners = {};
      $scope.loadingWinners = false;
      $scope.Feed = [];
      $scope.filterSchedule = {};
      $scope.ListEventFilter = [];
      $scope.filterOfficialSelection = {Search: ''};
      $scope.activeShortFilm = {};
      $scope.loadingReloadHomeFeed = false;
      //------------------------
      $scope.Host = 'http://ecofilmfestival.info/api/PublicService/';
      //------------------------
      $scope.IsInitialize = false;
      $scope.IsOnline = false;
      $scope.consoleActive = false;
      // ----------------------------
      // ----------------------------
      // ----------------------------
      $scope.$watch('filterSchedule.DateFilter ', function(newNames, oldNames) {
        $scope.filterSchedule.PlaceFilter = null;
        $scope.GetFilterSchedule();
        if ($scope.ListEventFilter !== undefined) {
          $scope.filterEventPlaces = $filter('unique')($scope.ListEventFilter, 'PlaceFilter');
        }
      });

      $scope.$watch('filterSchedule.PlaceFilter ', function(newNames, oldNames) {
        $scope.GetFilterSchedule();
      });

      $scope.GetFilterSchedule = function() {
        var filteredListEvent;
        filteredListEvent = $filter('filter')($scope.App.ListEvent, {
          DateFilter: $scope.filterSchedule.DateFilter || undefined,
          PlaceFilter: $scope.filterSchedule.PlaceFilter || undefined,
        });
        $scope.ListEventFilter = filteredListEvent;
      };

      $scope.$watchCollection('filterOfficialSelection', function() {
        $scope.GetListOfficialSelectionShortFilmFilter();
      });

      $scope.GetListOfficialSelectionShortFilmFilter = function() {
        var filteredListOfficialSelection;
        var filteredListOfficialSelectionBySearch = $filter('filter')($scope.OfficialSelection.ListShortFilm, function(shortFilm) {

          var _titulo = shortFilm.Titulo_Original.toLowerCase();
          var _director = shortFilm.DirectorCorto.toLowerCase();
          var _search = $scope.filterOfficialSelection.Search.toLowerCase();
          return _titulo.indexOf(_search) >= 0 || _director.indexOf(_search) >= 0
        });

        filteredListOfficialSelection = $filter('filter')(filteredListOfficialSelectionBySearch, {
          CategoriaId: $scope.filterOfficialSelection.CategoriaId || undefined,
          NacionalidadId: $scope.filterOfficialSelection.NacionalidadId || undefined,
        });


        $scope.ListOfficialSelectionShortFilmFilter = filteredListOfficialSelection;
      };
      // ----------------------------
      // ----------------------------
      // ----------------------------
      $scope.Initialize = function(goHome) {
        var _msgSuccess = function(data) {
          $scope.IsInitialize = true;
          $scope.IsOnline = true;
          $ionicLoading.hide();
          $scope.GetFilterSchedule();
        };
        var _msgFail = function(data) {
          $ionicLoading.hide();
          $scope.IsOnline = false;
          if (goHome) $state.go('app.home');
        };
        $ionicLoading.show({
          template: 'ECOFILM FESTIVAL...'
        });
        var _url = $scope.Host + 'App';
        AppService.Service(_url, null, $scope.App).then(_msgSuccess, _msgFail);        
      };
      // ----------------------------
      // ----------------------------
      // ----------------------------
      $scope.openDetail = function(url) {
        window.open(url, '_system');
      };
      // ----------------------------
      // ----------------------------
      // ----------------------------
      // ----------------------------
      // ----------------------------
      // ----------------------------
      $scope.isLoadRighFeed = false;
      $scope.isInitialiceLoadRighFeed = false;
      // ----------------------------
      $scope.listRighFeed = [];
      $scope.righFeedFilter = {};
      // ----------------------------
      $scope.LoadRighFeed = function() {
        if (!$scope.isLoadRighFeed) {
          var _msgSuccess = function(data) {
            var _response = data.response;
            $scope.righFeedFilter = _response.Filter;
            angular.forEach(_response.Feed, function(v) {
              $scope.listRighFeed.push(v);
            });
            $scope.isLoadRighFeed = false;
            $scope.isInitialiceLoadRighFeed = true;
            $scope.IsOnline = true;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          };
          var _msgFail = function(data) {
            $scope.isLoadRighFeed = false;
            $scope.IsOnline = false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          };

          $scope.isLoadRighFeed = true;
          var _url = $scope.Host + 'Feed';
          AppService.ServicePost(_url, null, $scope.righFeedFilter, null).then(_msgSuccess, _msgFail);
        }
      };
      $scope.$watch(function() {
        return $ionicSideMenuDelegate.isOpenRight();
      }, function(isOpen) {
        if (isOpen && !$scope.isInitialiceLoadRighFeed) $scope.LoadRighFeed();
      });
      // ----------------------------
      // ----------------------------
      // ----------------------------
      // ----------------------------
      // ----------------------------
      // ----------------------------
      $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        // ----------------------------
        // console.info('toState' , toState);
        // ----------------------------
        switch (toState.name) {
          case 'app.home':
            if (!$scope.IsInitialize) {
              $scope.Initialize(false);
            } else {
              var _msgSuccess = function(data) {
                $scope.loadingReloadHomeFeed = false;
              };
              var _msgFail = function(data) {
                $scope.loadingReloadHomeFeed = false;
              };
              $scope.loadingReloadHomeFeed = true;
              var _url = $scope.Host + 'Feed';
              AppService.Service(_url, null, $scope.App.Feed).then(_msgSuccess, _msgFail);
            }
            break;

          case 'app.schedule':
            if (!$scope.IsInitialize) $scope.Initialize(true);
            break;

          case 'app.event':
            if (!$scope.IsInitialize) $scope.Initialize(false);
            var _msgSuccess = function(data) {
              $ionicLoading.hide();
              $state.go('app.event');
            };
            var _msgFail = function(data) {
              $ionicLoading.hide();
              $state.go('app.home');
            };
            $filter('filter')($scope.ListEventFilter, function(event) {
              if (event.Id == toParams.Id && event.TypeFilter == toParams.TypeFilter) {
                $ionicLoading.show({
                  template: 'ECOFILM 2015 Evento ...'
                });
                var _url = $scope.Host + event.DetailUrl;
                AppService.Service(_url, event.Id, $scope.EventDetail).then(_msgSuccess, _msgFail);
              }
            });

            break;

          case 'app.places':
            if (!$scope.IsInitialize) $scope.Initialize(true);
            break;

          case 'app.sponsor':
            if (!$scope.IsInitialize) $scope.Initialize(true);
            break;

          case 'app.official':
            if (!$scope.IsInitialize) $scope.Initialize(false);
            var _msgSuccess = function(data) {
           	  $scope.loadingOfficialSelection = true;
              $scope.IsOnline = true;
              $scope.GetListOfficialSelectionShortFilmFilter();
              $ionicLoading.hide();
            };
            var _msgFail = function(data) {
              $ionicLoading.hide();
              $scope.IsOnline = false;
              $scope.loadingOfficialSelection = false;
              $state.go('app.home');
            };
            
            if(!$scope.loadingOfficialSelection)
            {
            	$ionicLoading.show({
	              template: 'ECOFILM FESTIVAL...'
	            });
	            var _url = $scope.Host + 'OfficialSelection';
	            AppService.Service(_url, null, $scope.OfficialSelection).then(_msgSuccess, _msgFail);
            }
            break;

          case 'app.winners':
            var _msgSuccess = function(data) {
              $ionicLoading.hide();
              $scope.loadingWinners = true;
            };
            var _msgFail = function(data) {
              $ionicLoading.hide();
              $scope.loadingWinners = false;
              $scope.IsOnline = false;
              $state.go('app.home');
            };
            if(!$scope.loadingWinners)
            {
            	$ionicLoading.show({
	              template: 'ECOFILM FESTIVAL...'
	            });
	            var _url = $scope.Host + 'Winners';
	            AppService.Service(_url, null, $scope.Winners).then(_msgSuccess, _msgFail);
            }
            break;

          case 'app.shortfilm':
            var _msgSuccess = function(data) {
              $ionicLoading.hide();
            };
            var _msgFail = function(data) {
              $ionicLoading.hide();
              $scope.IsOnline = false;
              $state.go('app.home');
            };
            $ionicLoading.show({
              template: 'ECOFILM FESTIVAL...'
            });
            var _url = $scope.Host + 'ShortFilm';
            AppService.Service(_url, toParams.id, $scope.activeShortFilm).then(_msgSuccess, _msgFail);
            break;

        }
      });
      // ----------------------------
      // ----------------------------
      // ----------------------------
    }
  ])
  .filter('unique', function() {
    return function(arr, field) {
      var o = {},
        i, l = arr.length,
        r = [];
      for (i = 0; i < l; i += 1) {
        o[arr[i][field]] = arr[i];
      }
      for (i in o) {
        r.push(o[i]);
      }
      return r;
    };
  })
  
  .directive('clickLink', ['$location', function($location) {
    return {
      link: function(scope, element, attrs) {
        element.on('click', function() {
          scope.$apply(function() {
            $location.path(attrs.clickLink);
          });
        });
      }
    }
  }])
  ;
