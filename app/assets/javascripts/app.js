angular.module('pickarun', ['ngRoute', 'templates', 'uiGmapgoogle-maps'])
       .config(config)
       .controller('HomeIndexController', HomeIndexController)
       .controller('RoutesIndexController', RoutesIndexController)
       .controller('RoutesShowController', RoutesShowController)
       .controller('UsersShowController', UsersShowController);

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
   key: 'AIzaSyBHLett8djBo62dDXj0EjCimF8Rd6E8cxg',
   libraries: 'weather,geometry,visualization'
 });
}

RoutesIndexController.$inject = ['$http'];

function RoutesIndexController($http) {
  console.log("Routes index controller is connected");
  var vm = this;
  vm.start = {latitude: 37.8199, longitude: -122.4783};
  vm.path = [{latitude: 45,longitude: -74}];
  vm.stroke = {color: '#D94343',weight: 3};
  vm.options = {
     styles: mapStyles
  };

  $http({
    method: 'GET',
    url: '/api/routes'
  }).then(onRoutesIndexSuccess, onRoutesIndexError);

  function onRoutesIndexSuccess(response) {
    vm.routes = response.data;
    addMapInfo(vm.routes);
  }

  function onRoutesIndexError(error) {
    console.log("There was an error: ", error);
  }

    function addMapInfo(routeArr) {
      routeArr.forEach(function(route) {
        route.start = {latitude: route.start_location[0], longitude: route.start_location[1]};
        route.path = formatPolyline(route.map);
      });
    }

    function formatPolyline(arr) {
      results_arr = [];
      arr.forEach(function(el) {
        results_arr.push({latitude: el[0], longitude: el[1]});
        return el;
      });
      return results_arr;
    }

    vm.searchFilter = function(itemDistance, targetDistance) {
      return ((itemDistance < targetDistance + 0.5) && (itemDistance > targetDistance - 0.5));
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
  vm.start = {latitude: 37.8199, longitude: -122.4783};
  vm.path = [{latitude: 45,longitude: -74}];
  vm.stroke = {color: '#D94343',weight: 4};
  vm.options = {
     styles: mapStyles
  };
  $http({
    method: 'GET',
    url: '/api/routes/'+$routeParams.id
  }).then(onRoutesShowSuccess, onRoutesShowError);
  function onRoutesShowSuccess(response) {
    vm.route = response.data;
    vm.start = {latitude:vm.route.start_location[0], longitude:vm.route.start_location[1]};
    vm.path = formatPolyline(vm.route.map);
  }
  function onRoutesShowError(error) {
    console.log("There was an error: ", error);
  }

  function formatPolyline(arr) {
    results_arr = [];
    arr.forEach(function(el) {
      results_arr.push({latitude: el[0], longitude: el[1]});
      return el;
    });
    return results_arr;
  }

  $http({
    method: 'GET',
    url: '/api/activities/'+$routeParams.id
  }).then(onActivitiesSuccess, onActivitiesError);
  function onActivitiesSuccess(response) {
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
        vm.route.favorite=false;
      }
    };

    vm.unfavorite = function(route) {
      vm.route.favorite=false;
      $http({
        method: 'PATCH',
        url: '/api/routes/'+$routeParams.id,
        data: vm.route
      }).then(onUnfavoriteSuccess, onUnfavoriteError);
      function onUnfavoriteSuccess(response) {
        console.log("The route has been unfavorited!");
      }
      function onUnfavoriteError(error) {
        console.log("Something went wrong unfavoriting that route");
        vm.route.favorite=true;
      }
    };

    vm.rename = function(route) {
      vm.editing = false;
      $http({
        method: 'PATCH',
        url: '/api/routes/'+$routeParams.id,
        data: vm.route
      }).then(onRenameSuccess, onRenameError);
      function onRenameSuccess(response) {
        console.log("The route has been renamed!");
        vm.editing = false;
      }
      function onRenameError(error) {
        console.log("Something went wrong renaming that route");
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

UsersShowController.$inject = ['$http', '$routeParams'];

function UsersShowController($http, $routeParams) {
  console.log("Users show controller is connected");
  var vm = this;

  $http({
    method: 'GET',
    url: '/api/users/'+$routeParams.id
  }).then(onUsersShowSuccess, onUsersShowError);
  function onUsersShowSuccess(response) {
    vm.user = response.data;
  }
  function onUsersShowError(error) {
    console.log("There was an error: ", error);
  }

    vm.formatDate = function(date) {
      var d = new Date(date);
      var year = d.getFullYear();
      var month = d.getMonth() + 1;
      var day = d.getDate();
      return (month + "/" + day + "/" + year);
    };

    $http({
      method: 'GET',
      url: '/api/routes'
    }).then(onRoutesIndexSuccess, onRoutesIndexError);

    function onRoutesIndexSuccess(response) {
      vm.routes = response.data.filter(function(route) {
        return route.favorite;
      });
      addMapInfo(vm.routes);
    }

    function onRoutesIndexError(error) {
      console.log("There was an error: ", error);
    }

      function addMapInfo(routeArr) {
        routeArr.forEach(function(route) {
          route.start = {latitude: route.start_location[0], longitude: route.start_location[1]};
          route.path = formatPolyline(route.map);
        });
      }

      function formatPolyline(arr) {
        results_arr = [];
        arr.forEach(function(el) {
          results_arr.push({latitude: el[0], longitude: el[1]});
          return el;
        });
        return results_arr;
      }

}

HomeIndexController.$inject=[];
function HomeIndexController() {
}

var mapStyles=[
  {
        "featureType": "all",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            },
            {
                "color": "#efebe2"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#efebe2"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "color": "#efebe2"
            }
        ]
    },
    {
        "featureType": "poi.attraction",
        "elementType": "all",
        "stylers": [
            {
                "color": "#efebe2"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "all",
        "stylers": [
            {
                "color": "#efebe2"
            }
        ]
    },
    {
        "featureType": "poi.government",
        "elementType": "all",
        "stylers": [
            {
                "color": "#dfdcd5"
            }
        ]
    },
    {
        "featureType": "poi.medical",
        "elementType": "all",
        "stylers": [
            {
                "color": "#dfdcd5"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "all",
        "stylers": [
            {
                "color": "#bad294"
            }
        ]
    },
    {
        "featureType": "poi.place_of_worship",
        "elementType": "all",
        "stylers": [
            {
                "color": "#efebe2"
            }
        ]
    },
    {
        "featureType": "poi.school",
        "elementType": "all",
        "stylers": [
            {
                "color": "#efebe2"
            }
        ]
    },
    {
        "featureType": "poi.sports_complex",
        "elementType": "all",
        "stylers": [
            {
                "color": "#efebe2"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fbfbfb"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#a5d7e0"
            }
        ]
    }
];
