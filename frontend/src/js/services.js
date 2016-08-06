'use strict';

angular.module('services', [])
//Handles persistent data
.factory('Storage', ['$window',function($window){
	var service = {};
	var ns = "_storage";
	var data = ($window.localStorage.getItem(ns) === null) ? "{}" : $window.localStorage.getItem(ns);
	data = $window.JSON.parse(data);
	service.set = function(key, value){
		data[key] = value;
		$window.localStorage.setItem(ns, $window.JSON.stringify(data));
	};

	service.get = function(key){
		return data[key];
	};

	service.clear = function(){
		$window.localStorage.clear();	
	};

	return service;
}])
//Handles user sessions
//-Events: 'logoutEvent'
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
.factory('API',['$http', '$q', 'Auth', 'Storage',
	function($http, $q, Auth, Storage){
	var API_URL = "http://www.hackupc.com";
	var service = {};

	/*
	* Rejects a promise with an object containing a msg with the reason of the reject
	* PRE:
	* -response is a response object (see angular's $http)
	* -deferred is a deferred object (see angular's $q)
	* POST:
	* -on status 401, logs out (token is not valid)
	* -rejects the promise with an object {status: (Int), msg: (String)}
	*/
	function _handleError(response, deferred){
		var rejectObj = {
			status: response.status,
			msg: ''
		};

		if(response.status == 400)
		{
			rejectObj.msg = "An error has occurred. Please, contact the admins if you see this.";
		}
		else if(response.status == 401)
		{
			rejectObj.msg = response.data.msg;
			if(Auth.isLoggedIn())
			{
				Auth.logout();
				Storage.clear();
			}
		}
		else if(response.status == 404)
		{
			rejectObj.msg = "Not found";
		}
		else if(response.status == 500)
		{
			rejectObj.msg = "An error has occurred. Please, try again later.";
		}

		deferred.reject(rejectObj);
	}

	/*
	* PRE: 
	* -user{name: (String), password: (String)}
	* POST: 
	* -If user match is found, Auth.login()
	*
	* @returns promise
	*/
	service.login = function(user){
		var deferred = $q.defer();
		$http.get(API_URL+'/login', {
			params: {
				"user": user.name,
				"password": user.password
			}
		}).then(function(response){
			deferred.resolve(response.data.token);
		}, function(response){
			_handleError(response, deferred);
		});

		return deferred.promise;
	};

	/*
	* Gets all applicants
	* @returns promise
	*/
	service.getEveryone = function(){
		var deferred = $q.defer();
		$http.get(API_URL+'/applicants', {
			params: {
				"token": Auth.getToken()
			}
		}).then(function(response){
			deferred.resolve(response.data);
		}, function(response){
			_handleError(response, deferred);
		});

		return deferred.promise;	
	};

	/*
	* Gets last application rated
	* @returns promise
	*/
	service.getLastRated = function(){
		var deferred = $q.defer();
		$http.get(API_URL+'/application/last', {
			params: {
				"token": Auth.getToken()
			}
		}).then(function(response){
			deferred.resolve(response.data);
		}, function(response){
			_handleError(response, deferred);
		});

		return deferred.promise;	
	};

	/*
	* Gets an application to be rated
	* @returns promise
	*/
	service.getPending = function(){
		var deferred = $q.defer();
		$http.get(API_URL+'/application/next', {
			params: {
				"token": Auth.getToken()
			}
		}).then(function(response){
			deferred.resolve(response.data);
		}, function(response){
			_handleError(response, deferred);
		});

		return deferred.promise;	
	};

	/*
	* Rates the next application
	* PRE:
	* -rating is ('better'|'worse')
	*
	* @returns promise
	*/
	service.rate = function(rating){
		var deferred = $q.defer();
		$http.get(API_URL+'/rate/'+rating, {
			params: {
				"token": Auth.getToken()
			}
		}).then(function(response){
			deferred.resolve();
		}, function(response){
			_handleError(response, deferred);
		});

		return deferred.promise;	
	};

	/*
	* Changes the status of an application
	* PRE:
	* -id is the id of an applicant
	* -status is ('tba'|'accepted'|'rejected')
	*
	* @returns promise
	*/
	service.changeStatus = function(id, status){
		var deferred = $q.defer();
		$http.get(API_URL+'/status/'+status, {
			params: {
				"token": Auth.getToken()
			}
		}).then(function(response){
			deferred.resolve();
		}, function(response){
			_handleError(response, deferred);
		});

		return deferred.promise;
	};

	/*
	* Gets the detail of an application
	* PRE:
	* -id is the id of an applicant
	*
	* @returns promise
	*/
	service.getPerson = function(id){
		var deferred = $q.defer();
		$http.get(API_URL+'/application/'+id, {
			params: {
				"token": Auth.getToken()
			}
		}).then(function(response){
			deferred.resolve();
		}, function(response){
			_handleError(response, deferred);
		});

		return deferred.promise;
	};

	return service;

}]);