'use strict';

module.exports = {
	client: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.min.css',
				'public/lib/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css',
				'public/lib/nouislider/distribute/nouislider.min.css',
				'public/lib/leaflet/dist/leaflet.css',
				'public/lib/leaflet-draw/dist/leaflet.draw.css',
				'public/libs/leaflet-geosearch/geosearch.style.css',
				'public/lib/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css',
				'public/lib/leaflet.markercluster/dist/MarkerCluster.css',
				'public/lib/leaflet.markercluster/dist/MarkerCluster.Default.css',
				'public/lib/normalize-css/normalize.css',
				'public/lib/components-font-awesome/css/font-awesome.min.css'
			],
			js: [
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/bootstrap/dist/js/bootstrap.min.js',
				'public/lib/bootstrap-datepicker/dist/js/boostrap-datepicker.min.js',
				'public/lib/angular/angular.min.js',
				'public/lib/angular-sanitize/angular-sanitize.min.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-translate/angular-translate.min.js',
				'public/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
				'public/lib/togeojson/togeojson.js',
				'public/lib/terraformer/terraformer.min.js',
				'public/lib/terraformer-wkt-parser/terraformer-wkt-parser.min.js',
				'public/lib/nouislider/distribute/nouislider.min.js',
				'public/lib/highcharts/highstock.js',
				'public/lib/highcharts/modules/exporting.js',
				'public/lib/highcharts/modules/export-data.js',
				'public/lib/leaflet/dist/leaflet.js',
				'public/lib/leaflet-draw/dist/leaflet.draw.js',
				'public/lib/leaflet-filelayer/src/leaflet.filelayer.js',
				'public/libs/leaflet-geosearch/geosearch.js',
				'public/libs/leaflet-geosearch/geosearch.provider.openstreetmap.js',
				'public/lib/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',
				'public/lib/leaflet.markercluster/dist/leaflet.markercluster-src.js'
			]
		},
		css: [
			'modules/*/client/css/*.css',
		],
		less: [
			'modules/*/client/less/*.less'
		],
		sass: [
			'modules/*/client/scss/*.scss'
		],
		js: [
			'modules/core/client/app/config.js',
			'modules/core/client/app/init.js',
			'modules/*/client/*.js',
			'modules/*/client/**/*.js'
		],
		img: [
			'modules/**/*/img/*.jpg',
			'modules/**/*/img/*.png',
			'modules/**/*/img/*.gif',
			'modules/**/*/img/*.svg'
		],
		views: ['modules/*/client/views/**/*.html'],
		templates: ['build/templates.js']
	},
	server: {
		gruntConfig: ['gruntfile.js'],
		gulpConfig: ['gulpfile.js'],
		allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
		routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
		views: ['modules/*/server/views/*.html']
	}
};
