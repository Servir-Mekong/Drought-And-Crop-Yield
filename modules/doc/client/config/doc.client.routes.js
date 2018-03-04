(function () {
	'use strict';

	angular
		.module('doc')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('doc', {
				url: '/doc'
			});
	}
})();