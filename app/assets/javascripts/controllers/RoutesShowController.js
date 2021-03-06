angular
  .module('pickarun')
  .controller('RoutesShowController', RoutesShowController);

RoutesShowController.$inject = ['$http', '$routeParams', '$window'];

function RoutesShowController($http, $routeParams, $window) {
  var vm = this;
  // Don't show selected on this tab since it's not in the nav
  $('.nav-tab').removeClass('deep-orange');

  // set default attributes for map
  vm.start = {latitude: 37.8199, longitude: -122.4783};
  vm.path = [{latitude: 45,longitude: -74}];
  vm.stroke = {color: '#FF5722',weight: 3};
  vm.options = {
     styles: mapStyles
  };

  // fetch the route that was clicked
  $http({
    method: 'GET',
    url: '/api/routes/'+$routeParams.id
  }).then(onRoutesShowSuccess, onRoutesShowError);
  function onRoutesShowSuccess(response) {
    // fetch the route and render it on the map with formatted attributes
    vm.route = response.data;
    vm.start = {latitude:vm.route.start_location[0], longitude:vm.route.start_location[1]};
    vm.path = formatPolyline(vm.route.map);
  }
  function onRoutesShowError(error) {
    // redirect to the routes search page if the route isn't found
    $window.location.href = '/routes';
    console.log("There was an error: ", error);
  }

  // format the array of points for Google maps
  function formatPolyline(arr) {
    results_arr = [];
    arr.forEach(function(el) {
      results_arr.push({latitude: el[0], longitude: el[1]});
      return el;
    });
    return results_arr;
  }

  // get all activities matching the route
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

  // delete route on 'x' click
  vm.destroy = function(route) {
    if (confirm("Are you sure you want to delete this route? You won't be able to get it back.")) {
      $http({
        method: 'DELETE',
        url: '/api/routes/'+$routeParams.id
      }).then(onDestroySuccess, onDestroyError);
    }
    function onDestroySuccess(response) {
      $window.location.href = '/routes';
    }
    function onDestroyError(response) {
      console.log("Something went wrong deleting that route");
    }
  };

  // add route to current user's favorites
  vm.favorite = function(route) {
    vm.route.favorite=true;
    starSpin();
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

  // remove route from user's favorites
  vm.unfavorite = function(route) {
    vm.route.favorite=false;
    starSpin();
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

  // animation for favoriting and unfavoriting
  function starSpin() {
    $('.favorite-star').addClass('fa-spin');
    setTimeout(function() {
      $('.favorite-star').removeClass('fa-spin');
    }, 840);
  }

  // toggle edit form and send new name to API
  vm.rename = function(route) {
    vm.editing = false;
    $http({
      method: 'PATCH',
      url: '/api/routes/'+$routeParams.id,
      data: vm.route
    }).then(onRenameSuccess, onRenameError);
    function onRenameSuccess(response) {
      vm.editing = false;
    }
    function onRenameError(error) {
      console.log("Something went wrong renaming that route");
    }
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
