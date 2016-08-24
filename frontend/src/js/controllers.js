

angular.module('controllers', [])
//TODO
.controller('LoginCtrl', ['$scope', 'API', 'Auth', 'Storage', 'ngNotify', '$location', 'PATHS',
	function ($scope, API, Auth, Storage, ngNotify, $location, PATHS) {
	$scope.validUser = false;
	$scope.answered = false;

	$scope.submit = function(user){
		API.login(user).then(function(response){
			//Success
			$scope.answered = true;
			$scope.validUser = true;
			$location.path(PATHS.judgement);
			var userObj = {
				name: user.name,
				token: response.token,
				admin: response.admin
			};
			Auth.login(userObj);
			ngNotify.set("Welcome, "+user.name+"!", 'success');
			if(user.remember)
				Storage.set("user", userObj);

		}, function(error){
			//Rejected
			$scope.answered = true;
			$scope.error = error.msg;
			ngNotify.set(error.msg, 'error');
		});
	};

	//If is already logged in, get out
	if(Auth.isLoggedIn())
	{
		$location.path(PATHS.judgement);
	}

}])
.controller('JudgementCtrl', ['$scope', 'API', 'current', '$location', 'ngNotify', 'PATHS',
	function ($scope, API, current, $location, ngNotify, PATHS) {

	$scope.loading = false;
	$scope.current = current;

	$scope.goToLastRated = function(){
		$location.path(PATHS.last);
	};

	function rate(rating){
		//TODO: handle errors
		API.rate(rating);
		$scope.lastRated = $scope.current;
		API.getPending().then(function(person){
			$scope.current = person;
		});
	}
	$scope.better = function(){
		rate('better');
	};

	$scope.worse = function(){
		rate('worse');
	};

}])
.controller('LastRatedCtrl', ['$scope', 'lastRated', '$window',
	function($scope, lastRated, $window){
	$scope.back = function(){
		$window.history.back();
	};
	$scope.lastRated = lastRated;
}])
.controller('PeopleCtrl', ['$scope', 'API', 'people', 'PATHS', '$location',
	function ($scope, API, people, PATHS, $location) {
		$scope.people = people.users;
		$scope.f ={
			query: '',
			accepted: false,
			tba: false,
			onlyNewcomers: false,
			rejected: false
		};
		$scope.optClosed = true;

		function searchMatch(element)
		{
			var reg = new RegExp($scope.f.query, "gi");
			return (element.name.match(reg) !== null) ||
					(element.mail.match(reg) !== null);
		}

		function noSelector()
		{
			return $scope.f.accepted === false && 
					$scope.f.tba === false  &&
					$scope.f.rejected === false;
		}

		function selectorMatch(element)
		{

			if($scope.f.tba)
			{
				if(element.status == "tba")
				{
					return true;
				}
			}
			if($scope.f.accepted)
			{
				if(element.status == "accepted")
				{
					return true;
				}
			}
			if($scope.f.rejected)
			{
				if(element.status == "rejected")
				{
					return true;
				}
			}

			return false;
		}
		function filterMatch(element){
			if($scope.f.onlyNewcomers)
				return element.newbie;

			return true;
		}
		$scope.viewPerson = function(id){
			$location.path(PATHS.people+"/"+id);
		};

		$scope.changeStatus = function(person, status){
			var old = person.status;
			person.status = status;
			API.changeStatus(person.id, status).then(function(){
				//Success
			}, function(){
				person.status = old;
			});
		};

		$scope.aeople = function(element){
			return searchMatch(element) && filterMatch(element) && (noSelector() || selectorMatch(element));
		};

		$scope.toggleOptions = function(){
			$scope.optClosed = !$scope.optClosed;
		};

}])
.controller('PersonCtrl', ['$scope', 'person', 'API', '$window',
	function($scope, person, API, $window){
		$scope.person = person;

		$scope.back = function(){
			$window.history.back();
		};

		$scope.changeStatus = function(person, status){
			var old = person.status;
			person.status = status;
			API.changeStatus(person.id, status).then(function(){
				//success
			}, function(){
				person.status = old;
			});
		};
}]);