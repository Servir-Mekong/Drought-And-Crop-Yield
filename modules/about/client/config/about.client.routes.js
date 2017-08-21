(function () {
	'use strict';

	angular
		.module('about')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('about', {
				url: '/about',
				templateUrl: 'modules/about/client/views/about.client.view.html'
			});
	}
})();