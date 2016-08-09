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

	service.isAdmin = function(){
		return user.admin;
	};

	return service;
}])
.factory('API',['$http', '$q', 'Auth', 'Storage', 'ngNotify',
	function($http, $q, Auth, Storage, ngNotify){
	var API_URL = "testAPI";
	var service = {};

	/*
	* Rejects a promise with an object containing a msg with the reason of the reject
	* PRE:
	* -response is a response object (see angular's $http)
	* -deferred is a deferred object (see angular's $q)
	* POST:
	* -on status 401, logs out (token is not valid)
	* -rejects the promise with an object {status: (Int), msg: (String)}
	* -Shows a notification	
	*/
	function _handleError(response, deferred){
		var rejectObj = {
			status: response.status,
			msg: 'Unknown error'
		};

		if(response.status == 400)
		{
			rejectObj.msg = "An error has occurred (400)";
		}
		else if(response.status == 401)
		{
			rejectObj.msg = "Session timed out. Please, log in again. (401)";
			if(Auth.isLoggedIn())
			{
				Auth.logout();
				Storage.clear();
			}
		}
		else if(response.status == 404)
		{
			rejectObj.msg = "Not found (404)";
		}
		else if(response.status == 500)
		{
			rejectObj.msg = "An error has occurred. Please, try again later. (500)";
		}

		ngNotify.set(rejectObj.msg, 'error');
		deferred.reject(rejectObj);
	}

	/*
	* PRE: 
	* -user{name: (String), password: (String)}
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
			deferred.resolve(response.data);
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
		//TODO: user id in url
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
			deferred.resolve(response.data);
		}, function(response){
			_handleError(response, deferred);
		});

		return deferred.promise;
	};

	return service;

}]);