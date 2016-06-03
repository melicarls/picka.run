angular
  .module('pickarun')
  .controller('HomeIndexController', HomeIndexController);

HomeIndexController.$inject=['$http', '$window'];

function HomeIndexController($http, $window) {
  var vm = this;

  // toggles navbar selector
  $('.nav-tab').removeClass('deep-orange');
  $('#about').addClass('deep-orange');

  // logs visitor in as Melissa Carlson
  vm.demoUser = function() {
    $http({
      method: 'GET',
      url: '/demo',
    }).then(onDemoSuccess, onDemoError);

    function onDemoSuccess(response) {
      $window.location.href = '/routes';
    }
    function onDemoError(error) {
      console.log("There was an error logging in to the demo account: ", error);
    }
  };

}
