(function () {
	'use strict';

	angular
		.module('feedback')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('feedback', {
				url: '/feedback'
			});
	}
})();