angular.module('pickarun', ['ngRoute', 'templates', 'uiGmapgoogle-maps', 'ui.materialize'])
       .controller('HomeIndexController', HomeIndexController)
       .controller('RoutesIndexController', RoutesIndexController)
       .controller('RoutesExploreController', RoutesExploreController)
       .controller('RoutesShowController', RoutesShowController)
       .controller('UsersShowController', UsersShowController)
       .config(config);
