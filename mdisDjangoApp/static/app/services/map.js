(function () {

	'use strict';

	angular.module('landcoverportal')
	.service('MapService', function ($http, $q) {
		var service = this;

		service.get_mekong_data = function (options) {
			var config = {
				params: {
					action: 'get-data',
					dataset: options.dataset,
					type: options.type,
					date: options.date,
					areaid0: options.areaid0,
					areaid1: options.areaid1,
					areaid2: options.areaid2,
					periodicity: options.periodicity
				}
			};
			var promise = $http.get('/api/mapclient/', config)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};

		service.get_date_list = function (options) {
			var config = {
				params: {
					action: 'get-date',
					dataset: options.dataset,
				}
			};
			var promise = $http.get('/api/mapclient/', config)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};

		service.get_current_date = function (options) {
			var config = {
				params: {
					action: 'get-current-date',
					date: options.date,
				}
			};
			var promise = $http.get('/api/mapclient/', config)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};

		service.get_map_id = function (options) {
			var config = {
				params: {
					action: 'get-map-id',
					dataset: options.dataset,
					date: options.date,
				}
			};
			var promise = $http.get('/api/mapclient/', config)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};

		service.get_map_current_id = function (options) {
			var config = {
				params: {
					action: 'get-map-current-id',
					date: options.date,
				}
			};
			var promise = $http.get('/api/mapclient/', config)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};



	});

})();