'use strict';

angular.module('services', [])
//Handles user sessions
.factory('Auth',['$rootScope', function($rootScope){
	var user = {};
	var service = {};
	var loggedIn = false;
	service.login = function(newUser){
		user = newUser;
		loggedIn = true;
		$rootScope.$broadcast('loginEvent', user);
	};

	service.isLoggedIn = function(){
		return loggedIn;
	};

	service.logout = function(){
		user = {};
		loggedIn = false;
		$rootScope.$broadcast('logoutEvent');
	};

	service.getToken = function(){
		return user.token;
	};

	service.getUsername = function(){
		return user.name;
	};

	return service;
}])

//TODO: real API / remove mock
//TODO: send token
//TODO: check user session status in api response: logout if token is invalid
.factory('API',['$q', 'Auth', '$window', function($q, Auth, $window){
	function _simulateThrottle(min, max)
	{
	    return Math.floor(Math.random()*(max-min+1)+min);
	}
	var service = {};
	var mockData = 
	{
		veterans:
		[
			{
				id:"gerard@gerard.ger",
				name: "Gerard",
				age: 23,
				desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas molestie nibh non ornare sagittis. Quisque dignissim fermentum felis in luctus. Cras vitae malesuada tellus, ac pellentesque neque. Morbi venenatis turpis ac eros ultrices, non convallis tellus lobortis. Cras varius dolor non justo vulputate, nec tincidunt turpis facilisis. Praesent vestibulum at odio ac molestie. Duis non congue felis."
			},
			{
				id:"heyya@heyya.ger",
				name: "Heyya",
				age: 109,
				desc: "Super guay"
			},
			{
				id:"super@super.pro",
				name: "Supepro",
				age: 98,
				desc: "asdvasdvasdv asdv asd vasd vasdv asdv asdv asd vasd vasd v."
			}
		],
		newcomers:
		[
			{
				id:"noob@noob.no",
				name: "Noob",
				age: 5,
				desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas molestie nibh non ornare sagittis. Quisque dignissim fermentum felis in luctus. Cras vitae malesuada tellus, ac pellentesque neque. Morbi venenatis turpis ac eros ultrices, non convallis tellus lobortis. Cras varius dolor non justo vulputate, nec tincidunt turpis facilisis. Praesent vestibulum at odio ac molestie. Duis non congue felis."
			},
			{
				id:"lele@lele.lel",
				name: "lelel",
				age: 15,
				desc: "Super guay"
			},
			{
				id:"whatis@sanic.wtf",
				name: "Whatisasanic",
				age: 16,
				desc: "asdvasdvasdv asdv asd vasd vasdv asdv asdv asd vasd vasd v."
			}
		],
		newcomerRatings:[],
		veteranRatings:[],
		everyone:
		[
			{
				id:"noob@noob.no",
				name: "Noob",
				age: 5,
				desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas molestie nibh non ornare sagittis. Quisque dignissim fermentum felis in luctus. Cras vitae malesuada tellus, ac pellentesque neque. Morbi venenatis turpis ac eros ultrices, non convallis tellus lobortis. Cras varius dolor non justo vulputate, nec tincidunt turpis facilisis. Praesent vestibulum at odio ac molestie. Duis non congue felis.",
				status:"blocked"
			},
			{
				id:"lele@lele.lel",
				name: "lelel",
				age: 15,
				desc: "Super guay",
				status:"accepted"
			},
			{
				id:"whatis@sanic.wtf",
				name: "Whatisasanic",
				age: 16,
				desc: "asdvasdvasdv asdv asd vasd vasdv asdv asdv asd vasd vasd v.",
				status:"algorithm"
			},
			{
				id:"gerard@gerard.ger",
				name: "Gerard",
				age: 23,
				desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas molestie nibh non ornare sagittis. Quisque dignissim fermentum felis in luctus. Cras vitae malesuada tellus, ac pellentesque neque. Morbi venenatis turpis ac eros ultrices, non convallis tellus lobortis. Cras varius dolor non justo vulputate, nec tincidunt turpis facilisis. Praesent vestibulum at odio ac molestie. Duis non congue felis.",
				status:"algorithm"
			},
			{
				id:"heyya@heyya.ger",
				name: "Heyya",
				age: 109,
				desc: "Super guay",
				status:"algorithm"

			},
			{
				id:"super@super.pro",
				name: "Supepro",
				age: 98,
				desc: "asdvasdvasdv asdv asd vasd vasdv asdv asdv asd vasd vasd v.",
				status:"algorithm"
			}
		]
	};

	service.getLastRated = function(type){
		var deferred = $q.defer();

		//Fake latency
		$window.setTimeout(function(){
			var currentPerson = null;
			if(type == "veteran")
				currentPerson = mockData.veteranRatings.length ? mockData.veteranRatings.slice(mockData.veteranRatings.length-1, mockData.veteranRatings.length)[0] : null;
			else
				currentPerson = mockData.newcomerRatings.length ? mockData.newcomerRatings.slice(mockData.newcomerRatings.length-1, mockData.newcomerRatings.length)[0] : null;

			deferred.resolve(currentPerson);
		}, _simulateThrottle(500, 1500));

		return deferred.promise;
	};

	service.getPending = function(type){
		var deferred = $q.defer();

		//Fake latency
		$window.setTimeout(function(){
			var currentPerson = null;
			if(type == "veteran")
				currentPerson = mockData.veterans.length ? mockData.veterans.slice(0, 1)[0] : null;
			else
				currentPerson = mockData.newcomers.length ? mockData.newcomers.slice(0, 1)[0] : null;

			deferred.resolve(currentPerson);
		}, _simulateThrottle(500, 1500));

		return deferred.promise;
	};

	service.getEveryone = function(){
		var deferred = $q.defer();

		$window.setTimeout(function(){
			deferred.resolve(mockData.everyone);
		}, _simulateThrottle(500, 1500));

		return deferred.promise;
	};


	service.rate = function(type, rating){
		var deferred = $q.defer();
		$window.setTimeout(function(){
			if(type == "veteran")
				mockData.veteranRatings.push({person: mockData.veterans.shift(), rating: rating});
			else
				mockData.newcomerRatings.push({person: mockData.newcomers.shift(), rating: rating});

			deferred.resolve();
		}, _simulateThrottle(500, 1500));

		return deferred.promise;
	};

	service.changeStatus = function(id, status){
		var deferred = $q.defer();
		$window.setTimeout(function(){
			deferred.resolve();
		}, _simulateThrottle(100, 300));
		return deferred.promise;
	};

	service.login = function(user){
		var deferred = $q.defer();
		$window.setTimeout(function(){
			if(user.name == "test" && user.password == "test")
			{
				Auth.login(user);
				deferred.resolve(true);
			}

			deferred.resolve(false);
		}, _simulateThrottle(500, 1000));

		return deferred.promise;
	};

	service.logout = function(){
		var deferred = $q.defer();
		$window.setTimeout(function(){

			Auth.logout();
			deferred.resolve();
		}, _simulateThrottle(500, 1000));

		return deferred.promise;
	};

	return service;
}]);