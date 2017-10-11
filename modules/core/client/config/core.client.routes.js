'use strict';

// Setting up route
angular.module('rheas').config(['$stateProvider', '$urlRouterProvider',
	function ($stateProvider, $urlRouterProvider) {

		// Redirect to 404 when route not found
		$urlRouterProvider.otherwise(function ($injector, $location) {
			$injector.get('$state').transitionTo('home', null, {
				location: false
			});
		});

		// Home state routing
		$stateProvider
			.state('not-found', {
				url: '/not-found',
				templateUrl: 'modules/core/client/views/404.client.view.html',
				data: {
					ignoreState: true
				}
			})
			.state('bad-request', {
				url: '/bad-request',
				templateUrl: 'modules/core/client/views/400.client.view.html',
				data: {
					ignoreState: true
				}
			})
			.state('forbidden', {
				url: '/forbidden',
				templateUrl: 'modules/core/client/views/403.client.view.html',
				data: {
					ignoreState: true
				}
			});
	}
]);
