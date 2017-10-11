(function () {

	'use strict';
	angular.module('rheas')
	.controller('settingsCtrl', function ($scope, settings) {
	
		$scope.menus = settings.menus;
		$scope.applicationName = settings.applicationName;
		$scope.footerLinks = settings.footerLinks;
		$scope.partnersHeader = settings.partnersHeader;
		$scope.partnersFooter = settings.partnersFooter;
	
	});

})();