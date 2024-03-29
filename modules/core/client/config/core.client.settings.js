﻿(function () {

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
			'max_value': 2.0,
			'color': '#5490f2',
			'name': 'Very Wet'
		},
		{
			'min_value': 1.0,
			'max_value': 1.5,
			'color': '#53f1ea',
			'name': 'Moderately Wet'
		},
		{
			'min_value': -1.0,
			'max_value': 1.0,
			'color': '#c1c5cc',
			'name': 'Near Normal'
		},
		{
			'min_value': -1.5,
			'max_value': -1.0,
			'color': '#e9fc16',
			'name': 'Moderately Dry'
		},
		{
			'min_value': -2.0,
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

	var soil_moist_legend = [
		{
			'name': '<15',
			'color': '#ca0020',
			'value': 15,
			'nature': 'lesser'
		},
		{
			'name': '15 - 25',
			'color': '#d93c43',
			'min_value': 15,
			'max_value': 25
		},
		{
			'name': '25 - 35',
			'color': '#e87867',
			'min_value': 25,
			'max_value': 35
		},
		{
			'name': '35 - 50',
			'color': '#f4ac8c',
			'min_value': 35,
			'max_value': 50
		},
		{
			'name': '50 - 100',
			'color': '#f5cab7',
			'min_value': 50,
			'max_value': 100
		},
		{
			'name': '100 - 200',
			'color': '#f6e8e1',
			'min_value': 100,
			'max_value': 200
		},
		{
			'name': '200 - 300',
			'color': '#e4edf2',
			'min_value': 200,
			'max_value': 300
		},
		{
			'name': '300 - 400',
			'color': '#bfdbe9',
			'min_value': 300,
			'max_value': 400
		},
		{
			'name': '400 - 500',
			'color': '#9bc9e0',
			'min_value': 400,
			'max_value': 500
		},
		{
			'name': '500 - 600',
			'color': '#6baed1',
			'min_value': 500,
			'max_value': 600
		},
		{
			'name': '600 - 700',
			'color': '#388fc0',
			'min_value': 600,
			'max_value': 700
		},
		{
			'name': '700+',
			'color': '#0571b0',
			'value': 700,
			'nature': 'greater',
		}
	];

	var soil_temp_legend = [
		{
			'name': '<-45',
			'color': '#2c7bb6',
			'value': -45,
			'nature': 'lesser'
		},
		{
			'name': '-45 - (-40)',
			'color': '#569ac7',
			'min_value': -45,
			'max_value': -40
		},
		{
			'name': '-40 - (-35)',
			'color': '#80b9d8',
			'min_value': -40,
			'max_value': -35
		},
		{
			'name': '-40 - (-30)',
			'color': '#abd9e9',
			'min_value': -35,
			'max_value': -30
		},
		{
			'name': '-30 - (-25)',
			'color': '#c7e5db',
			'min_value': -30,
			'max_value': -25
		},
		{
			'name': '-25 - (-20)',
			'color': '#e3f2cd',
			'min_value': -25,
			'max_value': -20
		},
		{
			'name': '-20 - (-15)',
			'color': '#ffffbf',
			'min_value': -20,
			'max_value': -15
		},
		{
			'name': '-15 - (-10)',
			'color': '#fee49f',
			'min_value': -15,
			'max_value': -10
		},
		{
			'name': '-10 - (-5)',
			'color': '#fdc980',
			'min_value': -10,
			'max_value': -5
		},
		{
			'name': '-5 - 0',
			'color': '#fdae61',
			'min_value': -5,
			'max_value': 0
		},
		{
			'name': '0 - 5',
			'color': '#f07c4a',
			'min_value': 0,
			'max_value': 5
		},
		{
			'name': '5 - 10',
			'color': '#e34a33',
			'min_value': 5,
			'max_value': 10
		},
		{
			'name': '10+',
			'color': '#d7191c',
			'value': 10,
			'nature': 'greater',
		}
	];

	var pet_legend = [
		{
			'name': '<1',
			'color': '#f0f9e8',
			'value': 1,
			'nature': 'lesser',
		},
		{
			'name': '1 - 2',
			'color': '#d8f0d5',
			'min_value': 1,
			'max_value': 2
		},
		{
			'name': '2 - 3',
			'color': '#c0e7c1',
			'min_value': 2,
			'max_value': 3
		},
		{
			'name': '3 - 4',
			'color': '#a5dcbf',
			'min_value': 3,
			'max_value': 4
		},
		{
			'name': '4 - 5',
			'color': '#89d2c2',
			'min_value': 4,
			'max_value': 5
		},
		{
			'name': '5 - 6',
			'color': '#6ec3c6',
			'min_value': 5,
			'max_value': 6
		},
		{
			'name': '6 - 7',
			'color': '#56b0c8',
			'min_value': 6,
			'max_value': 7
		},
		{
			'name': '7 - 8',
			'color': '#3c9cc7',
			'min_value': 7,
			'max_value': 8
		},
		{
			'name': '8 - 9',
			'color': '#2282ba',
			'min_value': 8,
			'max_value': 9
		},
		{
			'name': '9+',
			'color': '#0868ac',
			'value': 9,
			'nature': 'greater'
		}
	];

	angular.module('rheas').constant('settings', {
		downloadServerURL: 'http://203.170.246.170/',
		menus: [
			{
				'name': 'MAP',
				'url': '/map',
				'show': true
			},
			{
				'name': 'HOW_TO_USE',
				'url': 'https://goo.gl/rxeaKN',
				'show': false,
				'target': '_blank'
			},
			{
				'name': 'DOCUMENT',
				'url': 'http://bit.ly/RDCYIS-Technical-Docs',
				'show': true,
				'target': '_blank'
			},
			{
				'name': 'FEEDBACK',
				'url': 'https://goo.gl/forms/P2Lc5yBOOshT5uem1',
				'show': true,
				'target': '_blank'
			}
		],
		footerLinks: [
			{
				'name': 'ABOUT',
				'url': 'https://servir.adpc.net/about/about-servir-mekong',
				'show': true
			},
			{
				'name': 'TOOLS',
				'url': 'https://servir.adpc.net/tools',
				'show': true
			},
			{
				'name': 'GEOSPATIAL_DATASETS',
				'url': 'https://servir.adpc.net/geospatial-datasets',
				'show': true
			},
			{
				'name': 'RESOURCES_PUB',
				'url': 'https://servir.adpc.net/publications',
				'show': true
			},
			{
				'name': 'NEWS',
				'url': 'https://servir.adpc.net/news',
				'show': true
			},
			{
				'name': 'EVENTS',
				'url': 'https://servir.adpc.net/events',
				'show': true
			},
			{
				'name': 'CONTACT_US',
				'url': 'https://servir.adpc.net/about/contact-servir-mekong',
				'show': true
			},
			{
				'name': 'PRIVACY_USAGE_POLICY',
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
				'src': 'https://servir.adpc.net/themes/svmk/images/optimized/partner-sei-2.png',
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
				'value': 'basin',
				'name': 'LMR_BASIN'
			},
			{
				'value': 'country',
				'name': 'COUNTRY_LAYER'
			},
			{
				'value': 'admin1',
				'name': 'ADMIN_1'
			},
			{
				'value': 'admin2',
				'name': 'ADMIN_2'
			},
			{
				'value': '',
				'name': 'CLEAR_AREA_FILTER'
			}
		],
		timeOptions: [
			{
				'value': 'daily',
				'name': 'Daily',
				'checked': 'checked'
			},
			{
				'value': '5day',
				'name': '5 Day'
			},
			{
				'value': '10day',
				'name': '10 Day'
			}
		],
		indexSelectors: [
			{
				'value': 'drought',
				'name': 'DROUGHT'
			},
			{
				'value': 'soil',
				'name': 'SOIL'
			},
			{
				'value': 'energyBalance',
				'name': 'ENERGY_BALANCE'
			},
			{
				'value': 'waterBalance',
				'name': 'WATER_BALANCE'
			}
		],
		indexOptions: {
			drought: [
				{
					'value': 'cdi',
					'name': 'CDI',
					'title': 'This index is calculated using SPI3, the anomalies of the fraction of Absorbed Photosynthetically Active Radiation (fAPAR) andsoil suction (pF) .  Four warning categories are available as Watch: Precipitation deficit, Warning: Soil moisture deficit, Alert 1: Vegetation stress following precipitation deficit, Alert 2: Vegetation stress following precipitation/soil moisture deficit.'
				},
				{
					'value': 'severity',
					'name': 'DROUGHT_SEVERITY',
					'title': 'Agricultural drought severity is derived from the root zone soil moisture expressed as a percentile of the 1981-2010 climatology. Low percentile values show high drought severity'
				},
				{
					'value': 'spi1',
					'name': 'SPI_1',
					'title': 'Reflects short-term wet and dry conditions \n Application: Short-term soil moisture and crop stress (especially during the growing season)'
				},
				{
					'value': 'spi3',
					'name': 'SPI_3',
					'title': 'Reflects short- and medium-term moisture conditions \n Application: A seasonal estimation of precipitation'
				},
				{
					'value': 'spi6',
					'name': 'SPI_6',
					'title': 'Reflects medium-term trends in precipitation \n Application: Potential for effectively showing the precipitation over distinct seasons'
				},
				{
					'value': 'spi12',
					'name': 'SPI_12',
					'title': 'Reflects Long-term precipitation patterns \n Application: Possibly tied to streamflows, reservoir levels, and also groundwater levels'
				},
				{
					'value': 'sri1',
					'name': 'SRI_1',
					'title': 'Shows short-term potential to complement existing climate indices and local hydro-climatological information'
				},
				{
					'value': 'sri3',
					'name': 'SRI_3',
					'title': 'Shows short- and medium-term potential to complement existing climate indices and local hydro-climatological information'
				},
				{
					'value': 'sri6',
					'name': 'SRI_6',
					'title': 'Shows medium-term potential to complement existing climate indices and local hydro-climatological information'
				},
				{
					'value': 'sri12',
					'name': 'SRI_12',
					'title': 'Shows Long-term potential to complement existing climate indices and local hydro-climatological information'
				},
				{
					'value': 'smdi',
					'name': 'SMDI',
					'title': 'Can be used as in indicator of short-term drought. Useful for identifying and monitoring drought affecting agriculture'
				},
				{
					'value': 'dryspells',
					'name': 'DRY_SPELL',
					'title': 'Dry Spell Events show dry days during last at least 14 days'
				},
				/*{
					'value': 'vci',
					'name': 'Vegetation Condition Index (VCI)',
					'title': 'Vegetation Condition Index (VCI)'
				},*/
				{
					'value': 'ndvi',
					'name': 'Normalized Difference Vegetation Index (NDVI)',
					'title': 'NDVI measures the greeness of the plant. More greeness means more NDVI in a scale of zero (0) to one (1)'
				},
				/*{
					'value': 'lai',
					'name': 'Leaf Area Index (LAI)',
					'title': 'Leaf Area Index (LAI)'
				}*/
			],
			soil: [
				{
					'value': 'rootmoist',
					'name': 'SOIL_MOIST_ROOT',
					'title': 'Shows soil moisture content [mm] at surface and root zone level'
				},
				{
					'value': 'soil_moist_layer_1',
					'name': 'SOIL_MOIST_0_10',
					'title': 'Shows soil total moisture content [mm] in 0-10 cm soil layer'
				},
				{
					'value': 'soil_moist_layer_2',
					'name': 'SOIL_MOIST_10_40',
					'title': 'Shows soil total moisture content [mm] in 10-40 cm soil layer'
				},
				{
					'value': 'soil_moist_layer_3',
					'name': 'SOIL_MOIST_40_100',
					'title': 'Shows soil total moisture content [mm] in 40-100 cm soil layer'
				},
				{
					'value': 'soil_temp_layer_1',
					'name': 'SOIL_TEMP_0_10',
					'title': 'Shows soil temperature [C] in 0-10 cm soil layer'
				},
				{
					'value': 'soil_temp_layer_2',
					'name': 'SOIL_TEMP_10_40',
					'title': 'Shows soil temperature [C] in 10-40 cm soil layer'
				},
				{
					'value': 'soil_temp_layer_3',
					'name': 'SOIL_TEMP_40_100',
					'title': 'Shows soil temperature [C] in 40-100 cm soil layer'
				}
			],
			energyBalance: [
				{
					'value': 'net_short',
					'name': 'SHORTWAVE_FLUX',
					'title': 'This is calculated using the VIC land surface model'
				},
				{
					'value': 'net_long',
					'name': 'LONGWAVE_FLUX',
					'title': 'This is calculated using the VIC land surface model'
				},
				{
					'value': 'latent',
					'name': 'HEAT_FLUX_UPWARD_LATENT',
					'title': 'This is calculated using the VIC land surface model'
				},
				{
					'value': 'grnd_flux',
					'name': 'HEAT_FLUX_GROUND',
					'title': 'This is the total of downward longwave and shortwave fluxes calculated using the VIC land surface model'
				},
				{
					'value': 'surf_temp',
					'name': 'AST',
					'title': 'AST'
				},
				{
					'value': 'tmax',
					'name': 'MAX_TEMP',
					'title': 'Daily Maximum Temperature [C] measured at 2m above the surface'
				},
				{
					'value': 'tmin',
					'name': 'MIN_TEMP',
					'title': 'Daily Minimum Temperature [C] measured at 2m above the surface'
				}
			],
			waterBalance: [
				{
					'value': 'baseflow',
					'name': 'BASEFLOW',
					'title': 'This shows the portion of streamflow that comes from the sum of deep subsurface flow and delayed shallow subsurface flow'
				},
				{
					'value': 'rainf',
					'name': 'RAINFALL',
					'title': 'Daily total rainfall in millimeter'
				},
				{
					'value': 'evap',
					'name': 'NET_EVAPORATION',
					'title': 'This show the sum of evaporation from bare soil, canopy interception and plant transpiration calculated from the VIC land surface model'
				},
				{
					'value': 'runoff',
					'name': 'SURFACE_RUNOFF',
					'title': 'Excess water from rain, snow melt or other sources that does not infiltrate due to soil saturation or high intensity but instead flows overland'
				},
				{
					'value': 'rel_humid',
					'name': 'REL_HUMIDITY',
					'title': 'Relative Humidity [%]'
				},
				{
					'value': 'pet_short',
					'name': 'PET_SHORT_GREEN',
					'title': 'Potential evapotranspiration [mm] show the amount of evapotranspiration by a large vegetation of short green crops calculated from the VIC land surface model'
				},
				{
					'value': 'pet_tall',
					'name': 'PET_TALL_GREEN',
					'title': 'Potential evapotranspiration [mm] show the amount of evapotranspiration by a large vegetation of tall green crops calculated from the VIC land surface model'
				},
				{
					'value': 'pet_natveg',
					'name': 'PET_NATURAL_VEG',
					'title': 'Potential evapotranspiration [mm] show the amount of evapotranspiration by a large vegetation of natural green crops calculated from the VIC land surface model'
				}
			]
		},
		legend: {
			baseflow: [
				{
					'name': '<0',
					'color': '#ffffcc',
					'value': 0.0,
					'nature': 'lesser'			
				},
				{
					'name': '0.0 - 0.2',
					'color': '#dff2c4',
					'min_value': 0.0,
					'max_value': 0.2
				},
				{
					'name': '0.2 - 0.4',
					'color': '#c0e6bc',
					'min_value': 0.2,
					'max_value': 0.4
				},
				{
					'name': '0.4 - 0.6',
					'color': '#a1dab4',
					'min_value': 0.4,
					'max_value': 0.6
				},
				{
					'name': '0.6 - 0.8',
					'color': '#81ceb9',
					'min_value': 0.6,
					'max_value': 0.8
				},
				{
					'name': '0.8 - 1.0',
					'color': '#61c2be',
					'min_value': 0.8,
					'max_value': 1.0
				},
				{
					'name': '1.0 - 1.4',
					'color': '#41b6c4',
					'min_value': 1.0,
					'max_value': 1.4
				},
				{
					'name': '1.4 - 1.8',
					'color': '#3aa3c0',
					'min_value': 1.4,
					'max_value': 1.8
				},
				{
					'name': '1.8 - 2.0',
					'color': '#3391bc',
					'min_value': 1.8,
					'max_value': 2.0
				},
				{
					'name': '2.0 - 3.0',
					'color': '#2c7fb8',
					'min_value': 2.0,
					'max_value': 3.0
				},
				{
					'name': '3.0 - 4.0',
					'color': '#2965ac',
					'min_value': 3.0,
					'max_value': 4.0
				},
				{
					'name': '4.0 - 5.0',
					'color': '#274da0',
					'min_value': 4.0,
					'max_value': 5.0
				},
				{
					'name': '5.0+',
					'color': '#253494',
					'value': 5.0,
					'nature': 'greater'			
				}
			],
			dryspells: [
				{
					'name': '0 - 2',
					'color': '#ffffd4',
					'min_value': 0,
					'max_value': 2
				},
				{
					'name': '2 - 4',
					'color': '#fee5a5',
					'min_value': 2,
					'max_value': 4
				},
				{
					'name': '4 - 6',
					'color': '#fec36c',
					'min_value': 4,
					'max_value': 6
				},
				{
					'name': '6 - 8',
					'color': '#fe9929',
					'min_value': 6,
					'max_value': 8
				},
				{
					'name': '8 - 10',
					'color': '#e57217',
					'min_value': 8,
					'max_value': 10
				},
				{
					'name': '10 - 12',
					'color': '#c3500a',
					'min_value': 10,
					'max_value': 12
				},
				{
					'name': '12 - 14',
					'color': '#993404',
					'min_value': 12,
					'max_value': 14
				}//,
				/*{
					'name': '14+',
					'color': '#f28c10',
					'value': 14,
					'nature': 'greater',
				}*/
			],
			evap: [
				{
					'name': '<0.0',
					'color': '#440154',
					'value': 0.0,
					'nature': 'lesser'			
				},
				{
					'name': '0.0 - 0.3',
					'color': '#482172',
					'min_value': 0.0,
					'max_value': 0.3
				},
				{
					'name': '0.3 - 0.6',
					'color': '#423e84',
					'min_value': 0.3,
					'max_value': 0.6
				},
				{
					'name': '0.6 - 0.9',
					'color': '#38588b',
					'min_value': 0.6,
					'max_value': 0.9
				},
				{
					'name': '0.9 - 1.2',
					'color': '#2c6f8e',
					'min_value': 0.9,
					'max_value': 1.2
				},
				{
					'name': '1.2 - 1.6',
					'color': '#24848e',
					'min_value': 1.2,
					'max_value': 1.6
				},
				{
					'name': '1.6 - 2.0',
					'color': '#1e9b89',
					'min_value': 1.6,
					'max_value': 2.0
				},
				{
					'name': '2.0 - 2.5',
					'color': '#2ab07e',
					'min_value': 2.0,
					'max_value': 2.5
				},
				{
					'name': '2.5 - 3.0',
					'color': '#50c469',
					'min_value': 2.5,
					'max_value': 3.0
				},
				{
					'name': '3.0 - 3.5',
					'color': '#85d44a',
					'min_value': 3.0,
					'max_value': 3.5
				},
				{
					'name': '3.5 - 4.0',
					'color': '#c1df23',
					'min_value': 3.5,
					'max_value': 4.0
				},
				{
					'name': '4.0+',
					'color': '#fde725',
					'value': 4.0,
					'nature': 'greater'
				}
			],
			grnd_flux: [
				{
					'name': '<0',
					'color': '#0d0887',
					'value': 0,
					'nature': 'lesser'			
				},
				{
					'name': '0 - 5',
					'color': '#3d049b',
					'min_value': 0,
					'max_value': 5
				},
				{
					'name': '5 - 10',
					'color': '#6300a7',
					'min_value': 5,
					'max_value': 10
				},
				{
					'name': '10 - 15',
					'color': '#8606a6',
					'min_value': 10,
					'max_value': 15
				},
				{
					'name': '15 - 20',
					'color': '#a51f97',
					'min_value': 15,
					'max_value': 20
				},
				{
					'name': '20 - 25',
					'color': '#bf3983',
					'min_value': 20,
					'max_value': 25
				},
				{
					'name': '25 - 30',
					'color': '#d5536d',
					'min_value': 25,
					'max_value': 30
				},
				{
					'name': '30 - 35',
					'color': '#e76e59',
					'min_value': 30,
					'max_value': 35
				},
				{
					'name': '35 - 40',
					'color': '#f58c45',
					'min_value': 35,
					'max_value': 40
				},
				{
					'name': '40 - 45',
					'color': '#fcad32',
					'min_value': 40,
					'max_value': 45
				},
				{
					'name': '45 - 50',
					'color': '#fbd124',
					'min_value': 45,
					'max_value': 50
				},
				{
					'name': '50+',
					'color': '#f0f921',
					'value': 50,
					'nature': 'greater'
				}
			],
			latent : [
				{
					'name': '<0',
					'color': '#5e3c99',
					'value': 0,
					'nature': 'lesser'
				},
				{
					'name': '0 - 4',
					'color': '#7a61ac',
					'min_value': 0,
					'max_value': 4
				},
				{
					'name': '4 - 8',
					'color': '#9686bf',
					'min_value': 4,
					'max_value': 8
				},
				{
					'name': '8 - 12',
					'color': '#b2abd2',
					'min_value': 8,
					'max_value': 12
				},
				{
					'name': '12 - 16',
					'color': '#c9c4de',
					'min_value': 12,
					'max_value': 16
				},
				{
					'name': '16 - 20',
					'color': '#e0ddea',
					'min_value': 16,
					'max_value': 20
				},
				{
					'name': '20 - 25',
					'color': '#f7f7f7',
					'min_value': 20,
					'max_value': 25
				},
				{
					'name': '25 - 35',
					'color': '#f9e2c5',
					'min_value': 25,
					'max_value': 35
				},
				{
					'name': '35 - 45',
					'color': '#fbcd94',
					'min_value': 35,
					'max_value': 45
				},
				{
					'name': '45 - 55',
					'color': '#fdb863',
					'min_value': 45,
					'max_value': 55
				},
				{
					'name': '55 - 75',
					'color': '#f59b42',
					'min_value': 55,
					'max_value': 75
				},
				{
					'name': '75 - 95',
					'color': '#ed7e21',
					'min_value': 75,
					'max_value': 95
				},
				{
					'name': '95+',
					'color': '#e66101',
					'value': 95,
					'nature': 'greater'
				}
			],
			net_long: [
				{
					'name': '0 - 1',
					'color': '#0571b0',
					'min_value': 0,
					'max_value': '1'
				},
				{
					'name': '1 - 2',
					'color': '#3d92c2',
					'min_value': 1,
					'max_value': 2
				},
				{
					'name': '2 - 3',
					'color': '#75b4d4',
					'min_value': 2,
					'max_value': 3
				},
				{
					'name': '3 - 4',
					'color': '#a6cfe3',
					'min_value': 3,
					'max_value': 4
				},
				{
					'name': '4 - 5',
					'color': '#cee3ed',
					'min_value': 4,
					'max_value': 5
				},
				{
					'name': '5 - 6',
					'color': '#f7f7f7',
					'min_value': 5,
					'max_value': 6
				},
				{
					'name': '6 - 7',
					'color': '#f5d6c8',
					'min_value': 6,
					'max_value': 7
				},
				{
					'name': '7 - 8',
					'color': '#f4b599',
					'min_value': 7,
					'max_value': 8
				},
				{
					'name': '8 - 9',
					'color': '#eb846e',
					'min_value': 8,
					'max_value': 9
				},
				{
					'name': '9 - 10',
					'color': '#da4247',
					'min_value': 9,
					'max_value': 10
				},
				{
					'name': '10+',
					'color': '#da4247',
					'value': 10,
					'nature': 'greater'
				}
			],
			net_short: [
				{
					'name': '<0.010',
					'color': '#0571b0',
					'value': 0.010,
					'nature': 'lesser'
				},
				{
					'name': '0.010 - 0.013',
					'color': '#3d92c2',
					'min_value': 0.010,
					'max_value': 0.013
				},
				{
					'name': '0.013 - 0.016',
					'color': '#75b4d4',
					'min_value': 0.013,
					'max_value': 0.016
				},
				{
					'name': '0.016 - 0.019',
					'color': '#a6cfe3',
					'min_value': 0.016,
					'max_value': 0.019
				},
				{
					'name': '0.019 - 0.021',
					'color': '#cee3ed',
					'min_value': 0.019,
					'max_value': 0.021
				},
				{
					'name': '0.021 - 0.024',
					'color': '#f7f7f7',
					'min_value': 0.021,
					'max_value': 0.024
				},
				{
					'name': '0.024 - 0.027',
					'color': '#f5d6c8',
					'min_value': 0.024,
					'max_value': 0.027
				},
				{
					'name': '0.027 - 0.030',
					'color': '#f4b599',
					'min_value': 0.027,
					'max_value': 0.030
				},
				{
					'name': '0.030 - 0.033',
					'color': '#eb846e',
					'min_value': 0.030,
					'max_value': 0.033
				},
				{
					'name': '0.033 - 0.035',
					'color': '#da4247',
					'min_value': 0.033,
					'max_value': 0.035
				},
				{
					'name': '0.035+',
					'color': '#da4247',
					'min_value': 0.035,
					'max_value': 1.0
				}
			],
			rainf: [
				{
					'name': '0 - 1',
					'min_value': 0,
					'max_value': 1
				},
				{
					'name': '1 - 2',
					'color': '#e5b42c',
					'min_value': 1,
					'max_value': 2
				},
				{
					'name': '2 - 3',
					'color': '#e5b42c',
					'min_value': 2,
					'max_value': 3
				},
				{
					'name': '3 - 4',
					'color': '#f2b464',
					'min_value': 3,
					'max_value': 4
				},
				{
					'name': '4 - 5',
					'color': '#f2b464',
					'min_value': 4,
					'max_value': 5
				},
				{
					'name': '5 - 10',
					'color': '#f3e977',
					'min_value': 5,
					'max_value': 10
				},
				{
					'name': '10 - 20',
					'color': '#91ce7e',
					'min_value': 10,
					'max_value': 20
				},
				{
					'name': '20 - 30',
					'color': '#91ce7e',
					'min_value': 20,
					'max_value': 30
				},
				{
					'name': '30 - 40',
					'color': '#43be87',
					'min_value': 30,
					'max_value': 40
				},
				{
					'name': '40 - 50',
					'color': '#34b485',
					'min_value': 40,
					'max_value': 50
				},
				{
					'name': '50 - 60',
					'color': '#34b485',
					'min_value': 50,
					'max_value': 60
				},
				{
					'name': '60 - 70',
					'color': '#069b42',
					'min_value': 60,
					'max_value': 70
				},
				{
					'name': '70+',
					'color': '#069b42',
					'value': 70,
					'nature': 'greater'
				}
			],
			rootmoist: [
				{
					'name': '<100',
					'color': '#ca0020',
					'value': 100,
					'nature': 'lesser',
				},
				{
					'name': '100 - 200',
					'color': '#dc494b',
					'min_value': 100,
					'max_value': 200
				},
				{
					'name': '200 - 300',
					'color': '#ef9277',
					'min_value': 200,
					'max_value': 300
				},
				{
					'name': '300 - 400',
					'color': '#f5c0a9',
					'min_value': 300,
					'max_value': 400
				},
				{
					'name': '400 - 500',
					'color': '#f6e4dd',
					'min_value': 400,
					'max_value': 500
				},
				{
					'name': '500 - 600',
					'color': '#e0ebf1',
					'min_value': 500,
					'max_value': 600
				},
				{
					'name': '600 - 700',
					'color': '#b3d5e6',
					'min_value': 600,
					'max_value': 700
				},
				{
					'name': '700 - 800',
					'color': '#82bbd8',
					'min_value': 700,
					'max_value': 800
				},
				{
					'name': '800 - 900',
					'color': '#4396c4',
					'min_value': 800,
					'max_value': 900
				},
				{
					'name': '900 - 1000',
					'color': '#0571b0',
					'min_value': 900,
					'max_value': 10000
				}
			],
			runoff: [
				{
					'name': '<0.0',
					'color': '#a6611a',
					'value': 0,
					'nature': 'lesser',
				},
				{
					'name': '0.0 - 0.1',
					'color': '#ba843e',
					'min_value': 0.0,
					'max_value': 0.1
				},
				{
					'name': '0.1 - 0.2',
					'color': '#cfa762',
					'min_value': 0.1,
					'max_value': 0.2
				},
				{
					'name': '0.2 - 0.3',
					'color': '#e1c687',
					'min_value': 0.2,
					'max_value': 0.3
				},
				{
					'name': '0.3 - 0.4',
					'color': '#e9d9b3',
					'min_value': 0.3,
					'max_value': 0.4
				},
				{
					'name': '0.4 - 0.5',
					'color': '#f1ebdf',
					'min_value': 0.4,
					'max_value': 0.5
				},
				{
					'name': '0.5 - 0.6',
					'color': '#dfedeb',
					'min_value': 0.5,
					'max_value': 0.6
				},
				{
					'name': '0.6 - 0.7',
					'color': '#b5dfd8',
					'min_value': 0.6,
					'max_value': 0.7
				},
				{
					'name': '0.7 - 0.8',
					'color': '#8ad0c5',
					'min_value': 0.7,
					'max_value': 0.8
				},
				{
					'name': '0.8 - 0.9',
					'color': '#5db9ab',
					'min_value': 0.8,
					'max_value': 0.9
				},
				{
					'name': '0.9 - 1.0',
					'color': '#2f9f8e',
					'min_value': 0.9,
					'max_value': 1.0
				},
				{
					'name': '1.0+',
					'color': '#018571',
					'value': 1.0,
					'nature': 'greater'
				}
			],
			rel_humid: [
				{
					'name': '<10',
					'color': '#7b3294',
					'value': 10,
					'nature': 'lesser',
				},
				{
					'name': '10 - 20',
					'color': '#9b65ae',
					'min_value': 10,
					'max_value': 20
				},
				{
					'name': '20 - 30',
					'color': '#ba98c9',
					'min_value': 20,
					'max_value': 30
				},
				{
					'name': '30 - 40',
					'color': '#d4c1dd',
					'min_value': 30,
					'max_value': 40
				},
				{
					'name': '40 - 50',
					'color': '#ece5ef',
					'min_value': 40,
					'max_value': 50
				},
				{
					'name': '50 - 60',
					'color': '#e5f1e4',
					'min_value': 50,
					'max_value': 60
				},
				{
					'name': '60 - 70',
					'color': '#c1e5bd',
					'min_value': 60,
					'max_value': 70
				},
				{
					'name': '70 - 80',
					'color': '#94d294',
					'min_value': 70,
					'max_value': 80
				},
				{
					'name': '80 - 90',
					'color': '#4aad66',
					'min_value': 80,
					'max_value': 90
				},
				{
					'name': '90+',
					'color': '#008837',
					'value': 90,
					'nature': 'greater'
				}
			],
			pet_short: pet_legend,
			pet_tall: pet_legend,
			pet_natveg: pet_legend,
			severity: [
				{
					'name': '0 - 10',
					'color': '#ffffb2',
					'min_value': 0,
					'max_value': 10
				},
				{
					'name': '10 - 20',
					'color': '#fee88b',
					'min_value': 10,
					'max_value': 20
				},
				{
					'name': '20 - 30',
					'color': '#fed165',
					'min_value': 20,
					'max_value': 30
				},
				{
					'name': '30 - 40',
					'color': '#fdb751',
					'min_value': 30,
					'max_value': 40
				},
				{
					'name': '40 - 50',
					'color': '#fd9b43',
					'min_value': 40,
					'max_value': 50
				},
				{
					'name': '50 - 60',
					'color': '#fa7a35',
					'min_value': 50,
					'max_value': 60
				},
				{
					'name': '60 - 70',
					'color': '#f45629',
					'min_value': 60,
					'max_value': 70
				},
				{
					'name': '70 - 80',
					'color': '#ea3420',
					'min_value': 70,
					'max_value': 80
				},
				{
					'name': '80 - 90',
					'color': '#d31a23',
					'min_value': 80,
					'max_value': 90
				},
				{
					'name': '90 - 100',
					'color': '#bd0026',
					'min_value': 90,
					'max_value': 100
				}
			],
			smdi: spi_sri_legend,
			soil_moist_layer_1: [
				{
					'name': '<9',
					'color': '#ca0020',
					'value': 9,
					'nature': 'lesser'
				},
				{
					'name': '9 - 12',
					'color': '#d93c43',
					'min_value': 9,
					'max_value': 12
				},
				{
					'name': '12 - 15',
					'color': '#e87867',
					'min_value': 12,
					'max_value': 15
				},
				{
					'name': '15 - 18',
					'color': '#f4ac8c',
					'min_value': 15,
					'max_value': 18
				},
				{
					'name': '18 - 21',
					'color': '#f5cab7',
					'min_value': 18,
					'max_value': 21
				},
				{
					'name': '21 - 24',
					'color': '#f6e8e1',
					'min_value': 21,
					'max_value': 24
				},
				{
					'name': '24 - 27',
					'color': '#e4edf2',
					'min_value': 24,
					'max_value': 27
				},
				{
					'name': '27 - 30',
					'color': '#bfdbe9',
					'min_value': 27,
					'max_value': 30
				},
				{
					'name': '30 - 33',
					'color': '#9bc9e0',
					'min_value': 30,
					'max_value': 33
				},
				{
					'name': '33 - 36',
					'color': '#6baed1',
					'min_value': 33,
					'max_value': 36
				},
				{
					'name': '36 - 39',
					'color': '#388fc0',
					'min_value': 36,
					'max_value': 39
				},
				{
					'name': '39+',
					'color': '#0571b0',
					'value': 39,
					'nature': 'greater'
				}
			],
			soil_moist_layer_2: soil_moist_legend,
			soil_moist_layer_3: soil_moist_legend,
			soil_temp_layer_1: [
				{
					'name': '<8',
					'color': '#2c7bb6',
					'value': 8,
					'nature': 'lesser'
				},
				{
					'name': '8 - 10',
					'color': '#569ac7',
					'min_value': 8,
					'max_value': 10
				},
				{
					'name': '10 - 12',
					'color': '#80b9d8',
					'min_value': 10,
					'max_value': 12
				},
				{
					'name': '12 - 14',
					'color': '#abd9e9',
					'min_value': 12,
					'max_value': 14
				},
				{
					'name': '14 - 16',
					'color': '#c7e5db',
					'min_value': 14,
					'max_value': 16
				},
				{
					'name': '16 - 18',
					'color': '#e3f2cd',
					'min_value': 16,
					'max_value': 18
				},
				{
					'name': '18 - 20',
					'color': '#ffffbf',
					'min_value': 18,
					'max_value': 20
				},
				{
					'name': '20 - 22',
					'color': '#fee49f',
					'min_value': 20,
					'max_value': 22
				},
				{
					'name': '22 - 24',
					'color': '#fdc980',
					'min_value': 22,
					'max_value': 24
				},
				{
					'name': '24 - 26',
					'color': '#fdae61',
					'min_value': 24,
					'max_value': 26
				},
				{
					'name': '26 - 28',
					'color': '#f07c4a',
					'min_value': 26,
					'max_value': 28
				},
				{
					'name': '28 - 30',
					'color': '#e34a33',
					'min_value': 28,
					'max_value': 30
				},
				{
					'name': '30+',
					'color': '#d7191c',
					'value': 30,
					'nature': 'greater'
				}
			],
			soil_temp_layer_2: soil_temp_legend,
			soil_temp_layer_3: soil_temp_legend,
			spi1: spi_sri_legend,
			spi3: spi_sri_legend,
			spi6: spi_sri_legend,
			spi12: spi_sri_legend,
			sri1: spi_sri_legend,
			sri3: spi_sri_legend,
			sri6: spi_sri_legend,
			sri12: spi_sri_legend,
			cdi: [
				{
					'min_value': 0,
					'max_value': 1,
					'color': '#abdda4',
					'name': 'Normal'
				},
				{
					'min_value': 1,
					'max_value': 2,
					'color': '#ffffbf',
					'name': 'Watch'
				},
				{
					'min_value': 2,
					'max_value': 3,
					'color': '#fdae61',
					'name': 'Warning'
				},
				{
					'min_value': 3,
					'max_value': 4,
					'color': '#d7191c',
					'name': 'Alert-1'
				},
				{
					'min_value': 4,
					'max_value': 5,
					'color': '#6b0002',
					'name': 'Alert-2'
				}
			],
			surf_temp: [
				{
					'name': '0 - 10',
					'color': '#0571b0',
					'min_value': 0,
					'max_value': 10
				},
				{
					'name': '10 - 13',
					'color': '#3d92c2',
					'min_value': 10,
					'max_value': 13
				},
				{
					'name': '13 - 16',
					'color': '#75b4d4',
					'min_value': 13,
					'max_value': 16
				},
				{
					'name': '16 - 19',
					'color': '#a6cfe3',
					'min_value': 16,
					'max_value': 19
				},
				{
					'name': '19 - 22',
					'color': '#cee3ed',
					'min_value': 19,
					'max_value': 22
				},
				{
					'name': '22 - 25',
					'color': '#f7f7f7',
					'min_value': 22,
					'max_value': 25
				},
				{
					'name': '25 - 28',
					'color': '#f5d6c8',
					'min_value': 25,
					'max_value': 28
				},
				{
					'name': '28 - 31',
					'color': '#f4b599',
					'min_value': 28,
					'max_value': 31
				},
				{
					'name': '31 - 34',
					'color': '#eb846e',
					'min_value': 31,
					'max_value': 34
				},
				{
					'name': '34 - 36',
					'color': '#da4247',
					'min_value': 34,
					'max_value': 36
				},
				{
					'name': '36+',
					'color': '#ca0020',
					'value': 36,
					'nature': 'greater'
				}
			],
			tmax: [
				{
					'name': '<16',
					'color': '#0571b0',
					'value': 16,
					'nature': 'lesser'
				},
				{
					'name': '16 - 19',
					'color': '#4b9bc7',
					'min_value': 16,
					'max_value': 19
				},
				{
					'name': '19 - 21',
					'color': '#92c5de',
					'min_value': 19,
					'max_value': 21
				},
				{
					'name': '21 - 24',
					'color': '#c5deeb',
					'min_value': 21,
					'max_value': 24
				},
				{
					'name': '24 - 27',
					'color': '#f7f7f7',
					'min_value': 24,
					'max_value': 27
				},
				{
					'name': '27 - 30',
					'color': '#f6cebd',
					'min_value': 27,
					'max_value': 30
				},
				{
					'name': '30 - 33',
					'color': '#f4a582',
					'min_value': 30,
					'max_value': 33
				},
				{
					'name': '33 - 36',
					'color': '#df5251',
					'min_value': 33,
					'max_value': 36
				},
				{
					'name': '36+',
					'color': '#ca0020',
					'value': 36,
					'nature': 'greater'
				}
			],
			tmin: [
				{
					'name': '<9',
					'color': '#1a9641',
					'value': 9,
					'nature': 'lesser'
				},
				{
					'name': '9 - 12',
					'color': '#77c35c',
					'min_value': 9,
					'max_value': 12
				},
				{
					'name': '12 - 15',
					'color': '#c4e687',
					'min_value': 12,
					'max_value': 15
				},
				{
					'name': '15 - 18',
					'color': '#ffffc0',
					'min_value': 15,
					'max_value': 18
				},
				{
					'name': '18 - 21',
					'color': '#fec981',
					'min_value': 18,
					'max_value': 21
				},
				{
					'name': '21 - 25',
					'color': '#f17c4a',
					'min_value': 21,
					'max_value': 25
				},
				{
					'name': '25+',
					'color': '#d7191c',
					'value': 25,
					'nature': 'greater'
				}
			],
			ndvi: [
				{
					'name': 'Extermely Dry',//'<0',
					'color': '#f41707',
					'value': 0,
					'nature': 'lesser'
				},
				{
					'name': 'Dry', //'0 - 0.2',
					'color': '#e9fc16',
					'min_value': 0,
					'max_value': 0.2
				},
				{
					'name': 'Moderate Wet', //'0.2 - 0.4',
					'color': '#53f1ea',
					'min_value': 0.2,
					'max_value': 0.4
				},
				{
					'name': 'Wet', //'0.4 - 0.6',
					'color': '#5490f2',
					'min_value': 0.4,
					'max_value': 0.6
				},
				{
					'name': 'Extremely Wet', //'0.6+',
					'color': '#0c367a',
					'value': 0.6,
					'nature': 'greater'
				}
			],
			/*vci: [
				{
					'name': '<0.15',
					'color': '#9a0000',
					'value': 0.15,
					'nature': 'lesser'
				},
				{
					'name': '0.15 - 0.25',
					'color': '#ff0000',
					'min_value': 0.15,
					'max_value': 0.25
				},
				{
					'name': '0.25 - 0.35',
					'color': '#ff8700',
					'min_value': 0.25,
					'max_value': 0.35
				},
				{
					'name': '0.35 - 0.45',
					'color': '#ffcd66',
					'min_value': 0.35,
					'max_value': 0.45
				},
				{
					'name': '0.45 - 0.55',
					'color': '#ffff00',
					'min_value': 0.45,
					'max_value': 0.55
				},
				{
					'name': '0.55 - 0.65',
					'color': '#66ff00',
					'min_value': 0.55,
					'max_value': 0.65
				},
				{
					'name': '0.65 - 0.75',
					'color': '#2fcd00',
					'min_value': 0.65,
					'max_value': 0.75
				},
				{
					'name': '0.75 - 0.85',
					'color': '#009a00',
					'min_value': 0.75,
					'max_value': 0.85
				},
				{
					'name': '0.85+',
					'color': '#217400',
					'value': 0.85,
					'nature': 'greater'
				}
			],
			lai: [
				{
					'name': '0.0 - 0.5',
					'color': '#cfcf78',
					'min_value': 0.0,
					'max_value': 0.5
				},
				{
					'name': '0.5 - 1.0',
					'color': '#99ffee',
					'min_value': 0.5,
					'max_value': 1.0
				},
				{
					'name': '1.0 - 1.5',
					'color': '#67ffac',
					'min_value': 1.0,
					'max_value': 1.5
				},
				{
					'name': '1.5 - 2.0',
					'color': '#66ccee',
					'min_value': 1.5,
					'max_value': 2.0
				},
				{
					'name': '2.0 - 2.5',
					'color': '#66ff00',
					'min_value': 2.0,
					'max_value': 2.5
				},
				{
					'name': '2.5 - 3.0',
					'color': '#009988',
					'min_value': 2.5,
					'max_value': 3.0
				},
				{
					'name': '3.0 - 4.0',
					'color': '#9aff22',
					'min_value': 3.0,
					'max_value': 4.0
				},
				{
					'name': '4.0 - 5.0',
					'color': '#00f178',
					'min_value': 4.0,
					'max_value': 5.0
				},
				{
					'name': '5.0 - 6.0',
					'color': '#00ab22',
					'min_value': 5.0,
					'max_value': 6.0
				},
				{
					'name': '6.0 - 7.0',
					'color': '#008844',
					'min_value': 6.0,
					'max_value': 7.0
				},
			]*/
		}
	});
})();
