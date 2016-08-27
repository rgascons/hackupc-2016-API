//'use strict';

angular.module('directives', [])
.directive('checkRouteError',['$location', 'ngNotify', function($location, ngNotify){
	return {
		restrict: 'A',
		link: function(scope, elem, attrs){
			scope.$on('$routeChangeError', function(){
				ngNotify.set('Error 404: Where\'s my pizza?', 'error');
				$location.path("/error");
			});
		}
	};

}])
.directive('userInfo', ['Auth', 'Storage', '$location', 'ngNotify', 'PATHS', 
	function(Auth, Storage, $location, ngNotify, PATHS){
	return{
		restrict: 'AE',
		template: "<div class='user-info'>"+
					"<div>Logged in as</div>"+
					"<div class='username'>{{username}}</div>"+
					"<div class='logoutBtn' ng-click='logout()'>Logout</div>"+
					"<div ng-if='admin' class='admin' ng-click='moo()'>SUPERcow powers</div>"+
					"</div>",
		link: function(scope, elem, attrs){
			scope.username = Auth.getUsername();
			scope.admin = Auth.isAdmin();
			scope.logout = function(){
				Auth.logout();
				Storage.clear();
				$location.path(PATHS.login);
			};
			scope.moo = function(){
				ngNotify.set("🐄 MooOoOoOooOoOoO 🐮", {
					position:'top',
					type: 'grimace',
					duration: 1000
				});
			};
			scope.$on('loginEvent', function(ev, user){
				scope.username=user.name;
				scope.admin = Auth.isAdmin();
			});
		}
	};
}])
.directive('asideMenuToggle', ['$document', function($document){
	return {
		restrict: 'A',
		link: function(scope, elem, attrs){
			elem.bind('click', function(){
				var menu = $document[0].querySelector("#"+attrs.asideMenuToggle);
				menu.classList.toggle("open");
			});
		}
	};
}])
.directive('closeOnSuccess', [function(){
	return{
		restrict: 'A',
		link: function(scope, elem, attrs){
			scope.$on('$routeChangeSuccess', function(){
				elem.removeClass('open');
			});
		}
	};
}])
.directive('showWhileResolving', ['$window', function(window){
	return {
		restrict: 'A',
		link: function(scope, elem, attrs){
			elem.addClass('ng-hide');

			scope.$on('$routeChangeStart', function(){
				elem.removeClass('ng-hide');
			});

			scope.$on('$routeChangeSuccess', function(){
				elem.addClass('ng-hide');
			});

		}
	};
}])
.directive('forceLogin', ['$location', 'Auth', 'PATHS',
	function($location, Auth, PATHS){
	return{
		restrict: 'A',
		link: function(scope, elem, attrs){
			scope.$on('$routeChangeStart', function(event){
				if(!Auth.isLoggedIn() && $location.path() != PATHS.login)
				{

					event.preventDefault();
					$location.path(PATHS.login);
				}
			});
		}
	};
}])
.directive('linkRoute',['$location', function($location){
	return {
		restrict: 'A',
		link: function(scope, elem, attrs){
			scope.$on('$routeChangeSuccess', function(){
				if($location.path() == attrs.linkRoute)
					elem.addClass('active');
				else
					elem.removeClass('active');
			});

			elem.bind('click', function(){
				$location.path( attrs.linkRoute );
				scope.$apply();
			});
		}
	};

}]);