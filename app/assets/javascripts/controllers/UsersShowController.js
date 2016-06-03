UsersShowController.$inject = ['$http', '$routeParams'];

function UsersShowController($http, $routeParams) {
  $('.nav-tab').removeClass('deep-orange');
  $('#profile').addClass('deep-orange');
  var vm = this;
  vm.noRoutes = true;
  vm.start = {latitude: 37.8199, longitude: -122.4783};
  vm.path = [{latitude: 45,longitude: -74}];
  vm.stroke = {color: '#FF5722',weight: 2};
  vm.options = {
     styles: mapStyles
  };

  $http({
    method: 'GET',
    url: '/api/users/'+$routeParams.id
  }).then(onUsersShowSuccess, onUsersShowError);
  function onUsersShowSuccess(response) {
    vm.user = response.data;
    console.log(vm.user.routes);
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
      vm.routeCount = response.data.length;
      vm.routes = response.data.filter(function(route) {
        return route.favorite;
      });
      if (vm.routes.length !== 0) {
        vm.noRoutes = false;
      }
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
