angular.module('pickarun', ['ngRoute', 'templates'])
       .config(config)
       .controller('HomeIndexController', HomeIndexController);

config.$inject = ['$routeProvider', '$locationProvider'];
function config (  $routeProvider,   $locationProvider  )  {
 $routeProvider
   .when('/', {
     templateUrl: 'home.html',
     controller: 'HomeIndexController',
     controllerAs: 'homeIndexCtrl'
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

HomeIndexController.$inject=[];
function HomeIndexController() {
  var vm = this;
  vm.greeting = "what's up?";
}
