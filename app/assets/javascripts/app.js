angular.module('pickarun', ['ngRoute', 'templates', 'uiGmapgoogle-maps', 'ui.materialize'])
       .config(config);

  config.$inject = ['$routeProvider', '$locationProvider', 'uiGmapGoogleMapApiProvider'];

  function config (  $routeProvider,   $locationProvider ,  uiGmapGoogleMapApiProvider )  {
  $routeProvider
    .when('/', {
      templateUrl: 'home.html',
      controller: 'HomeIndexController',
      controllerAs: 'homeIndexCtrl'
    })
    .when('/routes', {
      templateUrl: 'routes/index.html',
      controller: 'RoutesIndexController',
      controllerAs: 'routesIndexCtrl'
    })
    .when('/explore', {
      templateUrl: 'routes/explore.html',
      controller: 'RoutesExploreController',
      controllerAs: 'routesExploreCtrl'
    })
    .when('/routes/:id', {
      templateUrl: 'routes/show.html',
      controller: 'RoutesShowController',
      controllerAs: 'routesShowCtrl'
    })
    .when('/users/:id', {
      templateUrl: 'users/show.html',
      controller: 'UsersShowController',
      controllerAs: 'usersShowCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });

  $locationProvider
    .html5Mode({
      enabled: true,
      requireBase: false
    });

  uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyCvTq_frx21FtTCouMtSGIDKAHButhQd6k',
    libraries: 'weather,geometry,visualization'
  });
  }
