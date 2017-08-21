(function () {
	'use strict';

	angular
		.module('how-to-use')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('how-to-use', {
				url: '/how-to-use',
				templateUrl: 'modules/how-to-use/client/views/how-to-use.client.view.html'
			});
	}
})();