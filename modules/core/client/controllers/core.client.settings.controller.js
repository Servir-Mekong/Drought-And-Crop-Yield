(function () {

	'use strict';
	angular.module('rheas')
	.controller('settingsCtrl', function ($http, $translate, $scope, settings) {

		$scope.changeLanguage = function (langKey) {
			$translate.use(langKey);
		};

		$scope.menus = settings.menus;
		$scope.footerLinks = settings.footerLinks;
		$scope.partnersHeader = settings.partnersHeader;
		$scope.partnersFooter = settings.partnersFooter;
		$scope.rssFeeds = [];

		$scope.trimDescription = function (description) {
			return String(description).substring(0, 500);
		};

		/**
		 * RSS Feed
		 */
		var apiCall = function (url, method) {
			//console.log(method, url);
			return $http({
				method: method,
				url: url,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			});
		};

		$scope.fetchRSSFeeds = function () {
			var rssFeedURL = '/' + $.param({action: 'rss-feeds'});
			// Make a request
			apiCall(rssFeedURL, 'POST').then(
				function (response) {
					// Success Callback
					$scope.rssFeeds = response.data;
					//console.log(response.data);
				},
				function (error) {
					// Error Callback
					console.log('ERROR: ' + error);
				}
			);
		};
	
	});

})();