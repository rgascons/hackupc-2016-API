'use strict';

angular.module('myApp', ['ngRoute', 'ngAnimate', 'ngNotify', 'controllers', 'directives', 'services'])
.constant("PATHS", {
	"login": "/login",
	"judgement": "/judgement",
	"last": "/judgement/last",
	"people": "/people"
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
			/*
			"lastRated":['API', function(API){
				return API.getLastRated("veteran");
			}],*/
			"current":['API', function(API){
				return API.getPending("veteran");
			}]
		}
	})
	.when(PATHS.last, {
		templateUrl: 'partials/reminder.html',
		controller: 'LastRatedCtrl',
		name: 'Last rated',
		resolve:{
			"lastRated":['API', function(API){
				return API.getLastRated("veteran");
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
		redirectTo: PATHS.judgement
	});
	
}])
.run(['$rootScope', '$route', 'Storage', 'Auth', function($rootScope, $route, Storage, Auth) {
	$rootScope.appTitle = "Hackers Judge";
	$rootScope.version = "0.3a";
	$rootScope.$route = $route;

	var user = Storage.get("user");
	if(user !== undefined)
	{
		Auth.login(user);
	}
}]);