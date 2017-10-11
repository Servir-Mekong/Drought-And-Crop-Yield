(function () {

	'use strict';

	angular.module('rheas').constant('settings', {
		menus: [
			{
				'name': 'Home',
				'url': '/home',
				'show': true
			},
			{
				'name': 'About',
				'url': '/about',
				'show': false
			},
			{
				'name': 'Map',
				'url': '/map',
				'show': true
			},
			{
				'name': 'How To Use',
				'url': '#',
				'show': true
			},
			{
				'name': 'Document',
				'url': '#',
				'show': true
			},
			{
				'name': 'Feedback',
				'url': '#',
				'show': true
			}
		],
		applicationName: 'Regional Drought and Crop Yield Information System',
		footerLinks: [
			{
				'name': 'About',
				'url': 'https://servir.adpc.net/about/about-servir-mekong',
				'show': true
			},
			{
				'name': 'Tools',
				'url': 'https://servir.adpc.net/tools',
				'show': true
			},
			{
				'name': 'Geospatial Datasets',
				'url': 'https://servir.adpc.net/geospatial-datasets',
				'show': true
			},
			{
				'name': 'Resources and Publications',
				'url': 'https://servir.adpc.net/publications',
				'show': true
			},
			{
				'name': 'News',
				'url': 'https://servir.adpc.net/news',
				'show': true
			},
			{
				'name': 'Events',
				'url': 'https://servir.adpc.net/events',
				'show': true
			},
			{
				'name': 'Contact Us',
				'url': 'https://servir.adpc.net/about/contact-servir-mekong',
				'show': true
			},
			{
				'name': 'Privacy and Usage Policy',
				'url': 'https://servir.adpc.net/policy',
				'show': true
			}
		],
		partnersHeader: [
			{
				'alt': 'The United States Agency for International Development',
				'url': 'https://www.usaid.gov/',
				'src': 'https://servir.adpc.net/themes/svmk/images/optimized/USAID_Logo_Color.png',
				'className': 'usaid'
			},
			{
				'alt': 'The National Aeronautics and Space Administration',
				'url': 'https://www.nasa.gov/',
				'src': 'https://servir.adpc.net/themes/svmk/images/optimized/NASA_Logo_Color.png',
				'className': 'nasa'
			},
			{
				'alt': 'Asian Disaster Preparedness Center',
				'url': 'http://www.adpc.net/',
				'src': 'https://servir.adpc.net/themes/svmk/images/optimized/partner-adbc.png',
				'className': 'adpc'
			},
			{
				'alt': 'SERVIR',
				'url': 'https://www.servirglobal.net/',
				'src': 'https://servir.adpc.net/themes/svmk/images/optimized/Servir_Logo_Color.png',
				'className': 'servir'
			}
		],
		partnersFooter: [
			{
				'alt': 'Spatial Infomatics Group',
				'url': 'https://sig-gis.com/',
				'src': 'https://servir.adpc.net/themes/svmk/images/optimized/partner-sig.png',
				'className': 'partner-sig'
			},
			{
				'alt': 'Stockholm Environment Institute',
				'url': 'https://www.sei-international.org/',
				'src': 'https://servir.adpc.net/themes/svmk/images/optimized/partner-sei.png',
				'className': 'partner-sei'
			},
			{
				'alt': 'Deltares',
				'url': 'https://www.deltares.nl/en/',
				'src': 'https://servir.adpc.net/themes/svmk/images/optimized/partner-deltares.png',
				'className': 'partner-deltares'
			}
		],
		grades : {
			'extermely_wet': {
				'value': 2,
				'color': '#0c367a',
				'name': 'Extremely Wet'
			},
			'very_wet': {
				'min_value': 1.5,
				'max_value': 1.99,
				'color': '#5490f2',
				'name': 'Very Wet'
			},
			'moderately_wet': {
				'min_value': 1.0,
				'max_value': 1.49,
				'color': '#53f1ea',
				'name': 'Moderately Wet'
			},
			'near_normal': {
				'min_value': -0.99,
				'max_value': 0.99,
				'color': '#c1c5cc',
				'name': 'Near Normal'
			},
			'moderately_dry': {
				'min_value': -1.49,
				'max_value': -1.0,
				'color': '#e9fc16',
				'name': 'Moderately Dry'
			},
			'severly_dry': {
				'min_value': -1.99,
				'max_value': -1.5,
				'color': '#f7911d',
				'name': 'Severely Dry'
			},
			'extermely_dry': {
				'value': -2,
				'color': '#f41707',
				'name': 'Extermely Dry'
			}
		},
		months : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
		mapLayer: 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
		areaFilterOptions: [
			{
				'value': 'country',
				'name': 'Country Layer'
			},
			{
				'value': 'admin1',
				'name': 'Administrative Layer 1'
			},
			{
				'value': 'admin2',
				'name': 'Administrative Layer 2'
			},
			{
				'value': 'clearLayer',
				'name': 'Close All Admin Layers'
			},
		],
		indexSelectors: [
			{
				'value': 'drought',
				'name': 'Drought Index' 
			},
			{
				'value': 'soil',
				'name': 'Soil Index'
			},
			{
				'value': 'energyBalance',
				'name': 'Energy Balance Index'
			},
			{
				'value': 'waterBalance',
				'name': 'Water Balance Index'
			}
		],
		indexOptions: {
			drought: [
				{
					'value': 'severity',
					'name': 'Drought Severity'
				},
				{
					'value': 'spi1',
					'name': 'SPI 1 month'
				},
				{
					'value': 'spi3',
					'name': 'SPI 3 months'
				},
				{
					'value': 'spi6',
					'name': 'SPI 6 months'
				},
				{
					'value': 'spi12',
					'name': 'SPI 12 months'
				},
				{
					'value': 'sri1',
					'name': 'SRI 1 month'
				},
				{
					'value': 'sri3',
					'name': 'SRI 3 months'
				},
				{
					'value': 'sri6',
					'name': 'SRI 6 months'
				},
				{
					'value': 'sri12',
					'name': 'SRI 12 months'
				},
				{
					'value': 'smdi',
					'name': 'SMDI'
				},
				{
					'value': 'dryspells',
					'name': 'Dry Spell Events'
				}

			],
			soil: [
				{
					'value': 'rootmoist',
					'name': 'Root Zone Soil Moisture'
				},
				{
					'value': 'soil_moist_layer_1',
					'name': 'Soil Moisture (Layer 0-10 cm)'
				},
				{
					'value': 'soil_moist_layer_2',
					'name': 'Soil Moisture (Layer 10-40 cm)'
				},
				{
					'value': 'soil_moist_layer_3',
					'name': 'Soil Moisture (Layer 40-100 cm)'
				},
				{
					'value': 'soil_temp_layer_1',
					'name': 'Soil Temperature (Layer 0-10 cm)'
				},
				{
					'value': 'soil_temp_layer_2',
					'name': 'Soil Temperature (Layer 10-40 cm)'
				},
				{
					'value': 'soil_temp_layer_3',
					'name': 'Soil Temperature (Layer 40-100 cm)'
				}
			],
			energyBalance: [
				{
					'value': 'net_short',
					'name': 'Net Downward Shortwave Flux'
				},
				{
					'value': 'net_long',
					'name': 'Net Downward Longwave Flux'
				},
				{
					'value': 'latent',
					'name': 'Net Upward Latent Heat Flux'
				},
				{
					'value': 'sensible',
					'name': 'Net Upward Sensible Heat Flux'
				},
				{
					'value': 'grnd_flux',
					'name': 'Net Heat Flux into Ground'
				}
			],
			waterBalance: [
				{
					'value': 'baseflow',
					'name': 'Base Flow'
				},
				{
					'value': 'rainf',
					'name': 'Rainfall'
				},
				{
					'value': 'evap',
					'name': 'Total Net Evaporation'
				},
				{
					'value': 'runoff',
					'name': 'Surface Runoff'
				}
			]
		}

	});
})();