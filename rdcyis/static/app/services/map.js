(function () {

	'use strict';

	angular.module('mekongDroughtandCropWatch')
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
					action: 'get-current-date'
				}
			};
			var promise = $http.get('/api/mapclient/', config)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};

		service.get_outlook_date = function (options) {
			var config = {
				params: {
					action: 'get-outlook-date'
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

		service.get_outlook_map_id = function (options) {
			var config = {
				params: {
					action: 'get-outlook-map-id',
					date: options.date,
				}
			};
			var promise = $http.get('/api/mapclient/', config)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};

		service.getSummary = function (options) {
			var config = {
				params: {
					action: 'get-summary',
					date: options.date,
				}
			};
			var promise = $http.get('/api/mapclient/', config)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};

		service.getFeatureArticles = function (options) {
			var config = {
				params: {
					action: 'get-feature-articles'
				}
			};
			var promise = $http.get('/api/mapclient/', config)
			.then(function (response) {
				return response.data;
			});
			return promise;
		};

		service.getKnowledgeCenter = function (options) {
			var config = {
				params: {
					action: 'get-knowledge-center'
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
