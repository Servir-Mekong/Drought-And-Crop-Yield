'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
	// Init module configuration options
	var applicationModuleName = 'rheas';
	var applicationModuleVendorDependencies = ['ui.router', 'pascalprecht.translate', 'ngSanitize'];

	// Add a new vertical module
	var registerModule = function (moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []).constant('_', window._);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
