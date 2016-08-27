

angular.module('controllers', [])

.controller('LoginCtrl', ['$scope', 'API', 'Auth', 'Storage', 'ngNotify', '$location', 'PATHS',
	function ($scope, API, Auth, Storage, ngNotify, $location, PATHS) {
	$scope.validUser = false;
	$scope.answered = false;

	$scope.submit = function(user){
		$scope.answered = false;
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
		});
	};

	//If is already logged in, get out
	if(Auth.isLoggedIn())
	{
		$location.path(PATHS.judgement);
	}

}])
.controller('JudgementCtrl', ['$scope', 'API', 'current', '$location', 'ngNotify', '$window', 'PATHS',
	function ($scope, API, current, $location, ngNotify, $window, PATHS) {

	$scope.current = current;

	$scope.goToLastRated = function(){
		$location.path(PATHS.last);
	};

	function isValidLink(link){
		return link !== "" && link != "http://";
	}

	function rate(rating){
		API.rate(rating).then(function(response){
			if(response.data.status)
			{
				if(response.data.status == "ok")
				{
					ngNotify.set("Rated!", {
						type: 'success',
						position:'top',
						duration:500
					});
					$window.document.querySelector('.application').scrollTop = 0;
				}
				else
				{
					ngNotify.set("Error! Try again", {
						type:'error',
						position:'top',
						duration:1000
					});
				}

			}
		});
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

	/* Redundant code, this could be a directive (see LastRatedCtrl, PersonCtrl)*/
	$scope.web = function(obj, name){
		if(obj[name] !== undefined)
		{
			return isValidLink(obj[name]);
		}
	};

	$scope.openLink = function(link){
		if(isValidLink(link))
			$window.open(link);
	};

}])
.controller('LastRatedCtrl', ['$scope', 'lastRated', '$window',
	function($scope, lastRated, $window){
	$scope.back = function(){
		$window.history.back();
	};

	function isValidLink(link){
		return link !== "" && link != "http://";
	}

	$scope.web = function(obj, name){
		if(obj[name] !== undefined)
		{
			return isValidLink(obj[name]);
		}
	};

	$scope.openLink = function(link){
		if(isValidLink(link))
			$window.open(link);
	};

	$scope.lastRated = lastRated;
}])
.controller('PeopleCtrl', ['$scope', 'API', 'people', 'PATHS', '$location',
	function ($scope, API, people, PATHS, $location) {
		$scope.people = people;
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
					(element.email.match(reg) !== null);
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
				if(element.state == "tba")
				{
					return true;
				}
			}
			if($scope.f.accepted)
			{
				if(element.state == "accepted")
				{
					return true;
				}
			}
			if($scope.f.rejected)
			{
				if(element.state == "rejected")
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

		$scope.changeStatus = function(person, state){
			var old = person.state;
			person.state = state;
			API.changeStatus(person.id, state).then(function(){
				//Success
			}, function(){
				person.state = old;
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

			
		function isValidLink(link){
			return link !== "" && link != "http://";
		}

		$scope.web = function(obj, name){
			if(obj[name] !== undefined)
			{
				return isValidLink(obj[name]);
			}
		};

		$scope.openLink = function(link){
			if(isValidLink(link))
				$window.open(link);
		};

		$scope.back = function(){
			$window.history.back();
		};

		$scope.changeStatus = function(person, state){
			var old = person.state;
			person.state = state;
			API.changeStatus(person.id, state).then(function(){
				//success
			}, function(){
				person.state = old;
			});
		};
}]);