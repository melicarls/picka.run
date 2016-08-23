angular
  .module('pickarun')
  .controller('RoutesIndexController', RoutesIndexController);

RoutesIndexController.$inject = ['$http'];

function RoutesIndexController($http) {
  var vm = this;

  // toggles navbar selector
  $('.nav-tab').removeClass('deep-orange');
  $('#routes').addClass('deep-orange');

  // set default attributes for maps
  vm.start = {latitude: 37.8199, longitude: -122.4783};
  vm.path = [{latitude: 45,longitude: -74}];
  vm.stroke = {color: '#FF5722',weight: 2};
  vm.options = {
    disableDefaultUI: true,
    draggable: false,
    styles: mapStyles
  };

  // fetch all of the user's routes
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

  // give each route a start point formatted for Google Maps
  function addMapInfo(routeArr) {
    routeArr.forEach(function(route) {
      route.start = {latitude: route.start_location[0], longitude: route.start_location[1]};
      route.path = formatPolyline(route.map);
    });
  }

  // give each route a polyline formatted for Google Maps
  function formatPolyline(arr) {
    results_arr = [];
    arr.forEach(function(el) {
      results_arr.push({latitude: el[0], longitude: el[1]});
      return el;
    });
    return results_arr;
  }

// render 3 routes matching the user's search at a time
  var routesArray;
  var count = 3;
  vm.range = function(routes, targetDistance){
    // reset the rendered count when input is erased so only 3 routes matching the new distance will show
    if (targetDistance === null) {
      count = 3;
    }
    routesArray = [];
    angular.forEach(routes, function(route, key) {
      // if a route is within 1/2 mile of the target distance, it's an option
      if ((route.distance < targetDistance + 0.5) && (route.distance > targetDistance - 0.5)) {
        routesArray.push(route);
      }
    });
    // check if there are more routes that can be rendered. if not, hide the more button
    if (routesArray.length > count) {
       vm.moreAvailable = true;
     } else {
       vm.moreAvailable = false;
     }
    // return the necessary number of matching records
    return routesArray.splice(0, count);
  };

  // render 3 more routes on button click
  vm.moreResults = function() {
    count = count + 3;
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
