'use strict';

angular.module('myApp', ['ngRoute', 'ngAnimate', 'ngNotify', 'controllers', 'directives', 'services'])
.config(['$routeProvider', function($routeProvider) {

	$routeProvider
	.when('/login', {
		templateUrl: 'partials/login.html',
		controller: 'LoginCtrl',
		name: 'Login'
	})
	.when('/veterans', {
		templateUrl: 'partials/judgement.html',
		controller: 'VeteransCtrl',
		name: 'Veterans',
		resolve:{
			"lastRated":['API', function(API){
				return API.getLastRated("veteran");
			}],
			"current":['API', function(API){
				return API.getPending("veteran");
			}]
		}
	})
	.when('/veterans/last', {
		templateUrl: 'partials/reminder.html',
		controller: 'LastRatedCtrl',
		name: 'Last veteran rated',
		resolve:{
			"lastRated":['API', function(API){
				return API.getLastRated("veteran");
			}]
		}
	})
	.when('/newcomers', {
		templateUrl: 'partials/judgement.html',
		controller: 'NewcomersCtrl',
		name: 'Newcomers',
		resolve:{
			"lastRated":['API', function(API){
				return API.getLastRated("newcomer");
			}],
			"current":['API', function(API){
				return API.getPending("newcomer");
			}]
		}
	})
	.when('/newcomers/last', {
		templateUrl: 'partials/reminder.html',
		controller: 'LastRatedCtrl',
		name: 'Last newcomer rated',
		resolve:{
			"lastRated":['API', function(API){
				return API.getLastRated("newcomer");
			}]
		}
	})
	.when('/people', {
		templateUrl: 'partials/people.html',
		controller: 'PeopleCtrl',
		name: 'People',
		resolve:{
			"people":['API', function(API){
				return API.getEveryone();
			}]
		}
	})
	/*
	.when('/route2', {
		templateUrl: 'partials/first.html',
		name:'route2',
		controller: 'FirstCtrl',
		resolve: {
			dependency:['$route', '$window', 'FirstService', function($route, window, FirstService)
			{
				var obj = FirstService.mockData();
				window.console.log("Resolved:"+obj.title);
				return obj;
			}]
		},
		animations:{
			index: ['slidedown','slideup'],
			route1: ['slidedown','slideup']
		}
	})
	*/
	.otherwise({
		redirectTo: '/veterans'
	});
	
}])
.run(['$rootScope', '$route',function($rootScope, $route) {
  $rootScope.appTitle = "Hackers Judge";
  $rootScope.version = "0.1a";
  $rootScope.$route = $route;
}]);