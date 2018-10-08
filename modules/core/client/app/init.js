'use strict';

// Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$interpolateProvider', '$translateProvider',
	function ($locationProvider, $interpolateProvider, $translateProvider) {
		$interpolateProvider.startSymbol('[[');
		$interpolateProvider.endSymbol(']]');
		$locationProvider.html5Mode(true).hashPrefix('!');

		$translateProvider.useStaticFilesLoader({
			prefix: 'languages/',
			suffix: '.json'
		});
		$translateProvider
		.preferredLanguage('en')
		.fallbackLanguage('en')
		.usePostCompiling(true)
		.useSanitizeValueStrategy('sanitizeParameters');
		//.useSanitizeValueStrategy('sanitize');

	}
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(function ($rootScope, $state) {

	// Record previous state
	$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
		storePreviousState(fromState, fromParams);
	});

	// Store previous state
	function storePreviousState(state, params) {
		// only store this state if it shouldn't be ignored 
		if (!state.data || !state.data.ignoreState) {
			$state.previous = {
				state: state,
				params: params,
				href: $state.href(state, params)
			};
		}
	}
});

// Then define the init function for starting up the application
angular.element(document).ready(function () {
	// Fixing facebook bug with redirect
	if (window.location.hash && window.location.hash === '#_=_') {
		if (window.history && history.pushState) {
			window.history.pushState('', document.title, window.location.pathname);
		} else {
			// Prevent scrolling by storing the page's current scroll offset
			var scroll = {
				top: document.body.scrollTop,
				left: document.body.scrollLeft
			};
			window.location.hash = '';
			// Restore the scroll offset, should be flicker free
			document.body.scrollTop = scroll.top;
			document.body.scrollLeft = scroll.left;
		}
	}

	// Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
