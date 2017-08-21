(function () {
	'use strict';

	angular
		.module('doc')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('doc', {
				url: '/doc',
				templateUrl: 'modules/doc/client/views/doc.client.view.html'
			});
	}
})();