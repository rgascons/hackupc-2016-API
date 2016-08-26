'use strict';

angular.module('myApp', ['ngRoute', 'ngAnimate', 'ngNotify', 'controllers', 'directives', 'services'])
.constant("PATHS", {
	"login": "/login",
	"judgement": "/judgement",
	"last": "/judgement/last",
	"people": "/people",
	"error": "/error"
})
.config(['$routeProvider', "PATHS", function($routeProvider, PATHS) {

	$routeProvider
	.when(PATHS.login, {
		templateUrl: 'partials/login.html',
		controller: 'LoginCtrl',
		name: 'Login'
	})
	.when(PATHS.judgement, {
		templateUrl: 'partials/judgement.html',
		controller: 'JudgementCtrl',
		name: 'Judgement',
		resolve:{
			"current":['API', function(API){
				return API.getPending();
			}]
		}
	})
	.when(PATHS.last, {
		templateUrl: 'partials/reminder.html',
		controller: 'LastRatedCtrl',
		name: 'Last rated',
		resolve:{
			"lastRated":['API', function(API){
				return API.getLastRated();
			}]
		}
	})
	.when(PATHS.people, {
		templateUrl: 'partials/people.html',
		controller: 'PeopleCtrl',
		name: 'People',
		resolve:{
			"people":['API', function(API){
				return API.getEveryone();
			}]
		}
	})
	.when(PATHS.people+'/:personId', {
		templateUrl: 'partials/person.html',
		controller: 'PersonCtrl',
		name: 'Person',
		resolve:{
			"person":['API', '$route', function(API, $route){
				return API.getPerson($route.current.params.personId);
			}]
		}
	})
	.when(PATHS.error, {
		templateUrl: 'partials/error.html',
		name: 'Error',
	})
	.otherwise({
		redirectTo: PATHS.judgement
	});
	
}])
.run(['$rootScope', '$route', 'Storage', 'Auth', function($rootScope, $route, Storage, Auth) {
	$rootScope.appTitle = "Hackers Judge";
	$rootScope.version = "1.0b";
	$rootScope.$route = $route;

	var user = Storage.get("user");
	if(user !== undefined)
	{
		Auth.login(user);
	}
}]);