

angular.module('controllers', [])
//TODO
.controller('LoginCtrl', ['$scope', 'API', 'Auth', 'Storage', '$location', 'PATHS',
	function ($scope, API, Auth, Storage, $location, PATHS) {
	$scope.validUser = false;
	$scope.answered = false;

	$scope.submit = function(user){
		API.login(user).then(function(token){
			//Success
			$scope.answered = true;
			$scope.validUser = true;
			$location.path(PATHS.judgement);
			var userObj = {
				name: user.name,
				token: token
			};
			Auth.login(userObj);
			if(user.remember)
				Storage.set("user", userObj);

		}, function(error){
			//Rejected
			$scope.answered = true;
			$scope.error = error.msg;
		});
	};

	//If is already logged in, get out
	if(Auth.isLoggedIn())
	{
		$location.path(PATHS.judgement);
	}

}])
.controller('JudgementCtrl', ['$scope', 'API', 'current', '$location', 'PATHS',
	function ($scope, API, current, $location, PATHS) {

	$scope.current = current;

	$scope.goToLastRated = function(){
		$location.path(PATHS.last);
	};

	function rate(rating){
		API.rate(type, rating);
		$scope.lastRated = $scope.current;
		API.getPending(type).then(function(person){
			$scope.current = person;
		});
	}
	$scope.better = function(){
		rate(1);
	};

	$scope.worse = function(){
		rate(0);
	};

}])
.controller('LastRatedCtrl', ['$scope', 'lastRated', '$window',
	function($scope, lastRated, $window){
	$scope.back = function(){
		$window.history.back();
	};
	$scope.lastRated = lastRated.person;
	$scope.rating = lastRated.rated;
}])
.controller('PeopleCtrl', ['$scope', 'API', 'people', 'PATHS', '$location',
	function ($scope, API, people, PATHS, $location) {
		$scope.people = people;

		$scope.viewPerson = function(id){
			$location.path(PATHS.people+"/"+id);
		};

		$scope.changeStatus = function(person, status){
			person.status = status;
			API.changeStatus(person.id, status).then(function(){
				$window.console.info(person.id + "changed status to "+ status);
			});
		};
}])
.controller('PersonCtrl', ['$scope', 'person', 'API', '$window',
	function($scope, person, API, $window){
		$scope.person = person;

		$scope.back = function(){
			$window.history.back();
		};

		$scope.changeStatus = function(status){
			API.changeStatus(person.id, status).then(function(){
				$window.console.info(person.id + "changed status to "+ status);				
			});
		};
}]);