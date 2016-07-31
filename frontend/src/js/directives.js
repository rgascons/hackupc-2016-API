//'use strict';

angular.module('directives', [])
.directive('checkRouteError',['$location', 'ngNotify', function($location, ngNotify){
	return {
		restrict: 'A',
		link: function(scope, elem, attrs){
			scope.$on('$routeChangeError', function(){
				ngNotify.set('Error 404: Where\'s my pizza?', 'error');
				$location.path("/");
			});
		}
	};

}])
/*
//Sets class .active; attr: querySelector
.directive('toggleElement',[function(){
	return {
		restrict: 'A',
		link: function(scope, elem, attrs){
			elem.bind('click', function(){
				var query = attrs.toggleElement;
				var target;
				if(query == "this")
					target = elem;
				else
					target = angular.element( document.querySelector(query) );

				target.toggleClass("active");
			});
		}
	};
}])
*/
.directive('userInfo', ['API', '$location', function(API, $location){
	return{
		restrict: 'AE',
		template: "<div class='user-info'>"+
					"<div>Logged in as</div>"+
					"<div class='username'>{{username}}</div>"+
					"<div class='logoutBtn' ng-click='logout()'>Logout</div>"+
					"</div>",
		link: function(scope, elem, attrs){
			scope.logout = function(){
				API.logout().then(function(){
					$location.path("/");
				});
			};
			scope.$on('loginEvent', function(ev, user){
				scope.username=user.name;
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
.directive('forceLogin', ['$location', 'Auth', function($location, Auth){
	return{
		restrict: 'A',
		link: function(scope, elem, attrs){
			scope.$on('$routeChangeStart', function(event){
				if(!Auth.isLoggedIn() && $location.path() != "/login")
				{

					event.preventDefault();
					$location.path('/login');
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