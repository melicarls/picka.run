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
    vm.routes = response.data;
  }

  function onRoutesIndexError(error) {
    console.log("There was an error: ", error);
  }

    vm.formatDistance = function(distance) {
      return +(distance * 0.000621371).toFixed(2);
    };

    vm.formatDate = function(date) {
      var d = new Date(date);
      var year = d.getFullYear();
      var month = d.getMonth() + 1;
      var day = d.getDate();
      return (month + "/" + day + "/" + year);
    };

    vm.formatTime = function(time) {
      var hours = parseInt(time / 3600) % 24;
      var minutes = parseInt(time / 60) % 60;
      var seconds = parseInt(time % 60);
      return ((hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds));
    };

    vm.formatPace = function(pace) {
      var minutePerMile = 26.8224 / pace;
      var minutes = (minutePerMile / 1).toFixed(0);
      var seconds = (((minutePerMile % 1) * 60).toFixed(0));
      return (minutes + ":" + (seconds  < 10 ? "0" + seconds : seconds));
    };

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

RoutesShowController.$inject = ['$http', '$routeParams'];

function RoutesShowController($http, $routeParams) {
  console.log("Routes show controller is connected");
  var vm = this;

  $http({
    method: 'GET',
    url: '/api/routes/'+$routeParams.id
  }).then(onRoutesShowSuccess, onRoutesShowError);
  function onRoutesShowSuccess(response) {
    console.log("Here's the response data:", response.data);
    vm.route = response.data;
  }
  function onRoutesShowError(error) {
    console.log("There was an error: ", error);
  }

  $http({
    method: 'GET',
    url: '/api/activities/'+$routeParams.id
  }).then(onActivitiesSuccess, onActivitiesError);
  function onActivitiesSuccess(response) {
    console.log("Here's the activity data:", response.data);
    vm.activities = response.data;
  }
  function onActivitiesError(error) {
    console.log("There was an error: ", error);
  }

    vm.favorite = function(route) {
      vm.route.favorite=true;
      $http({
        method: 'PATCH',
        url: '/api/routes/'+$routeParams.id,
        data: vm.route
      }).then(onFavoriteSuccess, onFavoriteError);
      function onFavoriteSuccess(response) {
        console.log("The route has been favorited!");
      }
      function onFavoriteError(error) {
        console.log("Something went wrong favoriting that route");
      }
    };

    vm.unfavorite = function(route) {
      vm.route.favorite=false;
      $http({
        method: 'PATCH',
        url: '/api/routes/'+$routeParams.id,
        data: vm.route
      }).then(onFavoriteSuccess, onFavoriteError);
      function onUnfavoriteSuccess(response) {
        console.log("The route has been unfavorited!");
      }
      function onUnfavoriteError(error) {
        console.log("Something went wrong unfavoriting that route");
      }
    };

    vm.formatDistance = function(distance) {
      return +(distance * 0.000621371).toFixed(2);
    };

    vm.formatDate = function(date) {
      var d = new Date(date);
      var year = d.getFullYear();
      var month = d.getMonth() + 1;
      var day = d.getDate();
      return (month + "/" + day + "/" + year);
    };

    vm.formatTime = function(time) {
      var hours = parseInt(time / 3600) % 24;
      var minutes = parseInt(time / 60) % 60;
      var seconds = parseInt(time % 60);
      return ((hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds));
    };

    vm.formatPace = function(pace) {
      var minutePerMile = 26.8224 / pace;
      var minutes = (minutePerMile / 1).toFixed(0);
      var seconds = (((minutePerMile % 1) * 60).toFixed(0));
      return (minutes + ":" + (seconds  < 10 ? "0" + seconds : seconds));
    };

}

HomeIndexController.$inject=[];
function HomeIndexController() {
}
