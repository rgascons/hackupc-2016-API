

angular.module('controllers', [])
//TODO
.controller('LoginCtrl', ['$scope', 'API', '$location',
	function ($scope, API, $location) {
	$scope.validUser = false;
	$scope.answered = false;
	$scope.submit = function(user){
		API.login(user).then(function(response){
			$scope.answered = true;
			$scope.validUser = response;
			if(response)
			{
				//Default page
				$location.path('/');
			}
		});
	};

}])
//TODO veteran and newcommer shared controller
.controller('VeteransCtrl', ['$scope', 'API', 'lastRated', 'current', '$location',
	function ($scope, API, lastRated, current, $location) {
	var type = "veteran";

	$scope.lastRated = lastRated;
	$scope.current = current;

	$scope.goToLastRated = function(){
		$location.path("/veterans/last");
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
//TODO
.controller('LastRatedCtrl', ['$scope', 'lastRated', '$window',
	function($scope, lastRated, $window){
	$scope.back = function(){
		$window.history.back();
	};
	$scope.lastRated = lastRated;
}])
.controller('NewcomersCtrl', ['$scope', 'API','lastRated', 'current', '$location',
	function ($scope, API, lastRated, current, $location) {
	var type = "newcomer";

	$scope.lastRated = lastRated;
	$scope.current = current;

	$scope.goToLastRated = function(){
		$location.path("/newcomers/last");
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
.controller('PeopleCtrl', ['$scope', 'API', 'people',
	function ($scope, API, people) {
		$scope.people = people;

		$scope.changeStatus = function(person, status){
			person.status = status;
			API.changeStatus(person.id, status).then(function(){
				//TODO
				$window.console.log(person);
				$window.console.log(person.id + "changed status to "+ status);
			});
		};
}]);