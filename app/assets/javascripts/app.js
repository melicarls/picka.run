angular.module('pickarun', ['ngRoute', 'templates'])
       .config(config)
       .controller('HomeIndexController', HomeIndexController)
       .controller('RoutesIndexController', RoutesIndexController)
       .controller('RoutesShowController', RoutesShowController);

config.$inject = ['$routeProvider', '$locationProvider'];
function config (  $routeProvider,   $locationProvider  )  {
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
   .when('/routes/:id', {
     templateUrl: 'routes/show.html',
     controller: 'RoutesShowController',
     controllerAs: 'routesShowCtrl'
   })
   .otherwise({
     redirectTo: '/'
   });

 $locationProvider
   .html5Mode({
     enabled: true,
     requireBase: false
   });
}

RoutesIndexController.$inject = ['$http'];

function RoutesIndexController($http) {
  console.log("Routes index controller is connected");
  var vm = this;

  $http({
    method: 'GET',
    url: '/api/routes'
  }).then(onRoutesIndexSuccess, onRoutesIndexError);

  function onRoutesIndexSuccess(response) {
    console.log("Here's the response data: ", response.data);
    vm.routes = response.data;
  }

  function onRoutesIndexError(error) {
    console.log("There was an error: ", error);
  }

    vm.updateRoute = function(route) {
      $http({
        method: 'PATCH',
        url: '/api/routes/' + route.id,
        data: route
      }).then(onRoutesUpdateSuccess, onRoutesUpdateError);
      function onRoutesUpdateSuccess(response) {
        console.log("Here's the response data: ", response.data);
      }
      function onRoutesUpdateError(error) {
        console.log("There was an error: ", error);
      }
    };

}

HomeIndexController.$inject=[];
function HomeIndexController() {
}
