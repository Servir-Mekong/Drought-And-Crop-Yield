(function () {

	'use strict';

	var	spi_sri_legend = [
		{
			'value': 2,
			'nature': 'greater',
			'color': '#0c367a',
			'name': 'Extremely Wet'
		},
		{
			'min_value': 1.5,
			'max_value': 1.99,
			'color': '#5490f2',
			'name': 'Very Wet'
		},
		{
			'min_value': 1.0,
			'max_value': 1.49,
			'color': '#53f1ea',
			'name': 'Moderately Wet'
		},
		{
			'min_value': -0.99,
			'max_value': 0.99,
			'color': '#c1c5cc',
			'name': 'Near Normal'
		},
		{
			'min_value': -1.49,
			'max_value': -1.0,
			'color': '#e9fc16',
			'name': 'Moderately Dry'
		},
		{
			'min_value': -1.99,
			'max_value': -1.5,
			'color': '#f7911d',
			'name': 'Severely Dry'
		},
		{
			'value': -2,
			'nature': 'lesser',
			'color': '#f41707',
			'name': 'Extermely Dry'
		}
	];

	angular.module('rheas').constant('settings', {
		menus: [
			{
				'name': 'Home',
				'url': '/home',
				'show': false
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
		},
		legend: {
			severity: [
				{
					'name': '10',
					'color': '#ffffb2',
					'min_value': 0,
					'max_value': 9.99
				},
				{
					'name': '20',
					'color': '#fee88b',
					'min_value': 10,
					'max_value': 19.99
				},
				{
					'name': '30',
					'color': '#fed165',
					'min_value': 20,
					'max_value': 29.99
				},
				{
					'name': '40',
					'color': '#fdb751',
					'min_value': 30,
					'max_value': 39.99
				},
				{
					'name': '50',
					'color': '#fd9b43',
					'min_value': 40,
					'max_value': 49.99
				},
				{
					'name': '60',
					'color': '#fa7a35',
					'min_value': 50,
					'max_value': 59.99
				},
				{
					'name': '70',
					'color': '#f45629',
					'min_value': 60,
					'max_value': 69.99
				},
				{
					'name': '80',
					'color': '#ea3420',
					'min_value': 70,
					'max_value': 79.99
				},
				{
					'name': '90',
					'color': '#d31a23',
					'min_value': 80,
					'max_value': 89.99
				},
				{
					'name': '100',
					'color': '#bd0026',
					'min_value': 90,
					'max_value': 100.01
				}
			],
			spi1: spi_sri_legend,
			spi3: spi_sri_legend,
			spi6: spi_sri_legend,
			spi12: spi_sri_legend,
			sri1: spi_sri_legend,
			sri3: spi_sri_legend,
			sri6: spi_sri_legend,
			sri12: spi_sri_legend,
			dryspells: [
				{
					'name': '-10',
					'color': '#1f78b4',
					'value': -10,
					'nature': 'lesser',
				},
				{
					'name': '-8',
					'color': '#2e77a4',
					'min_value': -10,
					'max_value': -8
				},
				{
					'name': '-6',
					'color': '#3e7795',
					'min_value': -8,
					'max_value': -6
				},
				{
					'name': '-4',
					'color': '#4e7785',
					'min_value': -6,
					'max_value': -4
				},
				{
					'name': '-2',
					'color': '#5d7676',
					'min_value': -4,
					'max_value': -2
				},
				{
					'name': '0',
					'color': '#6d7666',
					'min_value': -2,
					'max_value': 0
				},
				{
					'name': '2',
					'color': '#6d7666',
					'min_value': 0,
					'max_value': 2
				},
				{
					'name': '4',
					'color': '#8d7647',
					'min_value': 2,
					'max_value': 4
				},
				{
					'name': '6',
					'color': '#9c7538',
					'min_value': 4,
					'max_value': 6
				},
				{
					'name': '8',
					'color': '#ac7528',
					'min_value': 6,
					'max_value': 8
				},
				{
					'name': '10',
					'color': '#bc7519',
					'min_value': 8,
					'max_value': 10
				},
				{
					'name': '10+',
					'color': '#cc750a',
					'value': 10,
					'nature': 'greater',
				}

			]
		}

	});
})();