angular
  .module('pickarun')
  .controller('RoutesExploreController', RoutesExploreController);

RoutesExploreController.$inject = ['$http'];

function RoutesExploreController($http) {
  var vm = this;

  // toggles navbar selector
  $('.nav-tab').removeClass('deep-orange');
  $('#explore').addClass('deep-orange');

  // set default attributes for map and prevent render of info fields until a map is loaded
  vm.show = false;
  vm.start = {latitude: 37.8199, longitude: -122.4783};
  vm.path = [{latitude: 45,longitude: -74}];
  vm.stroke = {color: '#FF5722',weight: 2};
  vm.options = {
     styles: mapStyles
  };

  // get all routes belonging to other users (#TODO: not restful, needs refactor)
  $http({
    method: 'GET',
    url: '/api/routes/all'
  }).then(onRoutesExploreSuccess, onRoutesExploreError);
  function onRoutesExploreSuccess(response) {
    vm.options = [];
    vm.routes = response.data;
    // get user's location
    navigator.geolocation.getCurrentPosition(function(position) {
      // filter routes to find only those within ~1 mile of user's location
      vm.routes = vm.routes.filter(function(el) {
        return (el.start_location[0] == position.coords.latitude.toFixed(2)) && (el.start_location[1] == position.coords.longitude.toFixed(2));
      });
      // randomly select a route to render
      vm.displayRoute = getRandomRoute(vm.routes);
      // set map attributes according to selected route
      vm.start = {latitude:vm.displayRoute.start_location[0], longitude:vm.displayRoute.start_location[1]};
      vm.path = formatPolyline(vm.displayRoute.map);
    });
  }

  // on button click, fetch a different random route near the user
  vm.refreshRandom = function(routes) {
    vm.show = true;
    vm.displayRoute = getRandomRoute(routes);
    vm.start = {latitude:vm.displayRoute.start_location[0], longitude:vm.displayRoute.start_location[1]};
    vm.path = formatPolyline(vm.displayRoute.map);
  };

  // randomly select a route from an array of routes
  function getRandomRoute(routesArr) {
    return routesArr[Math.floor(Math.random() * (routesArr.length - 1))];
  }

  function onRoutesExploreError(error) {
    console.log("There was an error: ", error);
  }

  // turn array of points into Google maps format
  function formatPolyline(arr) {
    results_arr = [];
    arr.forEach(function(el) {
      results_arr.push({latitude: el[0], longitude: el[1]});
      return el;
    });
    return results_arr;
  }

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
      // convert to mi/hr
      pace = pace * 2.2369;
      // convert to min/mi
      pace = 60/pace;
      // format
      var min = Math.floor(pace);
      var sec = (pace - min) * 60;
      sec = Math.floor(sec);
      return(min+":"+(sec  < 10 ? "0" + sec : sec));
    };
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
