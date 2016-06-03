HomeIndexController.$inject=['$http', '$window'];

function HomeIndexController($http, $window) {
  $('.nav-tab').removeClass('deep-orange');
  $('#about').addClass('deep-orange');
  var vm = this;
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
