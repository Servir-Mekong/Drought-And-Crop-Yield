(function () {

	'use strict';

	angular.module('rheas').controller('mapCtrl', function ($filter, $http, $scope, $timeout, $window, settings) {

		// Settings
		var legend = settings.legend;
		$scope.areaFilter = {};
		$scope.areaFilter.options = settings.areaFilterOptions;
		var getAreaFilterDefault = function () {
			for (var i in $scope.areaFilter.options) {
				var option = $scope.areaFilter.options[i];
				if (option.value === 'clearAreaFilter') {
					return option;
				}
			}
		};

		$scope.areaFilter.value = getAreaFilterDefault();
		$scope.indexSelectors = settings.indexSelectors;
		$scope.indexOptions = null;
		$scope.timeOptions = settings.timeOptions;
		for (var index in $scope.timeOptions) {
			var option = $scope.timeOptions[index];
			if (option.checked) {
				$scope.timeOptionSelector = option.value;
				break;
			}
		}
		$scope.downloadServerURL = settings.downloadServerURL;

		// Map variables
		$scope.areaFilterLayer = null;
		$scope.shownGeojson = null;
		$scope.selectedLayerData = {};
		//$scope.selectedLayerBounds = null;
		$scope.basinGeojson = null;
		$scope.countryGeojson = null;
		$scope.adminOneGeojson = null;
		$scope.adminTwoGeojson = null;
		//$scope.layerControl = L.control.layers();
		$scope.editableLayers = new L.FeatureGroup();
		//$scope.fileLayers = null;
		$scope.drawOptions = {
			position: 'bottomright',
			draw: {
				polyline: false,
				polygon: {
					allowIntersection: false, // Restricts shapes to simple polygons
					drawError: {
						color: '#e1e100', // Color the shape will turn when intersects
						message: "<strong>Oh snap!<strong> you can\'t draw that!" // Message that will show when intersect
					},
					shapeOptions: {
						color: '#ff0000'
					}
				},
				circle: false, // Turns off this drawing tool
				rectangle: {
					shapeOptions: {
						clickable: false,
						color: '#ff0000'
					}
				},
				marker: false,
				circlemarker: false
			},
			edit: {
				featureGroup: $scope.editableLayers, //REQUIRED!!
				//remove: false
			}
		};
		$scope.drawControl = new L.Control.Draw($scope.drawOptions);

		// Other variables
		$scope.disableCalendar = true;
		$scope.showLoader = false;
		$scope.showBanner = true;
		$scope.defaultHandle = 'default';
		$scope.toggleButtonClass = 'toggle-sidebar-button is-closed';
		$scope.sidebarClass = 'display-none';
		$scope.mapClass = 'col-md-12 col-sm-12 col-lg-12';
		$scope.alertClass = 'custom-alert-full';
		$scope.alertContent = '';
		$scope.showVariableSelect = false;
		$scope.indexOption = {};
		$scope.showLegend = false;
		$scope.legendParameter = '';
		$scope.legendDate = '';
		$scope.chartModalTitle = '';
		$scope.showDownloadButton = false;
		$scope.displayedGeoJSON = null;
		$scope.showOpacitySlider = false;
		$scope.opacitySliderIcon = 'fa fa-eye-slash fa-2x';
		$scope.opacityValue = null;
		$scope.areaFilterOpacityValue = null;
		$scope.showTimeSlider = true;
		$scope.showAreaFilterSlider = false;

		// Hide collapse for disclaimer
		$timeout(function () {
			$('#disclaimer-collapse').collapse('show');
			$('#disclaimer-collapse').collapse({
				toggle: false
			});
		}, 2000);

		// change function for time selector
		$scope.changeTimeOptionSelector = function (value) {
			$scope.timeOptionSelector = value;
		};

		// Modal Close Function
		$scope.closeModal = function () {
			$('.modal-body').html('');
			$('#chartModal').addClass('display-none-imp');
		};

		// Modal Open Function
		$scope.showModal = function () {
			$('#chartModal').removeClass('display-none-imp');
		};

		// Close the Modal
		$('.modal-close').click(function () {
			$scope.closeModal();
		});

		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function (event) {
			if (event.target === $('#chartModal')[0]) {
				$scope.closeModal();
			}
		};

		// System upgrade notice
		//$scope.chartModalTitle = 'Important: Information System is under Maintenance';
		//$('.modal-body').html('<h3>Dear user, our information system is currently undergoing some updates. It will be back soon!<br/> Sorry for the inconvenience!</h3>');
		//$scope.showModal();

		/*
		 * Alert
		 **/
		$scope.closeAlert = function () {
			$('.' + $scope.alertClass).addClass('display-none');
			$scope.alertContent = '';
		};

		var showErrorAlert = function (alertContent) {
			$scope.alertContent = alertContent;
			$('.' + $scope.alertClass).removeClass('display-none').removeClass('alert-info').removeClass('alert-success').addClass('alert-danger');
		};

		var showSuccessAlert = function (alertContent) {
			$scope.alertContent = alertContent;
			$('.' + $scope.alertClass).removeClass('display-none').removeClass('alert-info').removeClass('alert-danger').addClass('alert-success');
		};

		var showInfoAlert = function (alertContent) {
			$scope.alertContent = alertContent;
			$('.' + $scope.alertClass).removeClass('display-none').removeClass('alert-success').removeClass('alert-danger').addClass('alert-info');
		};

		// Formatted date
		var formattedDate = function (date) {
			var dateArray = date.split('-');
			var monthObject = {
				'01': 'January',
				'02': 'February',
				'03': 'March',
				'04': 'April',
				'05': 'May',
				'06': 'June',
				'07': 'July',
				'08': 'August',
				'09': 'September',
				'10': 'October',
				'11': 'November',
				'12': 'December'
			};

			return dateArray[0] + ', ' + monthObject[dateArray[1]] + ' ' + dateArray[2];
		};

		var apiCall = function (url, method, data) {
			//console.log(method, url);
			if (data) {
				return $http({
					method: method,
					url: url,
					data: $.param(data),
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
				});
			} else {
				return $http({
					method: method,
					url: url,
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
				});
			}
		};

		var prepareUrlForAPI = function (action, apply) {
			if (!$scope.indexOption.option) {
				showErrorAlert('No parameter specified!');
				if (apply) {
					$scope.$apply();
				}
				return false;
			}

			$scope.showLoader = true;

			var data = {
				'action': action,
				'index': $scope.indexOption.option.value
			};

			if (action === 'map-data') {
				data.timeFrequency = $scope.timeOptionSelector;
			}

			if (action !== 'graph-data') {
				var start = $scope.selectedDate || new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
				data.date = start;
			}
			return '/' + $.param(data);
		};

		// Modal Close Function
		$scope.closeModal = function () {
			$('.modal-body').html('');
			$('#chartModal').addClass('display-none-imp');
		};

		// Modal Open Function
		$scope.showModal = function () {
			$('#chartModal').removeClass('display-none-imp');
		};

		// Close the Modal
		$('.modal-close').click(function () {
			$scope.closeModal();
		});

		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function (event) {
			if (event.target === $('#chartModal')[0]) {
				$scope.closeModal();
			}
		};

		// System upgrade notice
		//$scope.chartModalTitle = 'Important: System Upgrade Notice';
		//$('.modal-body').html('<h3>Dear valued user, <br/><br/> We are currently upgrading our Regional Drought and Crop Yield Information Service with much more robust and accurate information. As a result, the current information database is not updated regularly. Sorry for the inconvenience is being caused during this period.<br/><br/> Thank you for your understanding and being with us!</h3>');
		//$scope.showModal();

		$scope.activateToolTip = function () {
			$('.js-tooltip').tooltip();
		};

		// Sidebar Menu controller
		$scope.openSidebar = function () {

			if ($scope.toggleButtonClass === 'toggle-sidebar-button is-closed') {
				$scope.mapClass = 'col-sm-7 col-md-9 col-lg-9';
				$scope.sidebarClass = 'col-sm-5 col-md-3 col-lg-3 sidebar';
				$scope.toggleButtonClass = 'toggle-sidebar-button is-open';
				$scope.alertClass = 'custom-alert';
				$scope.activateToolTip();
				//$scope.broadcastTimeSlider();
			} else {
				$scope.mapClass = 'col-md-12 col-sm-12 col-lg-12';
				$scope.sidebarClass = 'display-none';
				$scope.toggleButtonClass = 'toggle-sidebar-button is-closed';
				$scope.alertClass = 'custom-alert-full';
			}

		};

		// Date Range Slider
		$scope.broadcastTimeSlider = function () {
			$timeout(function () {
				$scope.$broadcast('rzSliderForceRender');
			});
		};

		/**
		 * Time Slider
		 **/
		var timeSlider = document.getElementById('datePickerSlider');

		// Create a string representation of the date.
		$scope.toFormat = function (v, handle) {
			// where is this string representation
			// values = "uipipes" ; default is "default"
			var date = new Date(v);
			handle = handle || $scope.defaultHandle;
			if (handle === 'uipipes') {
				return settings.months[date.getMonth()] + ' ' + date.getFullYear();
			} else if (handle === $scope.defaultHandle) {

				var mm = date.getMonth() + 1; // getMonth() is zero-based
				var dd = date.getDate();
			  
				return [date.getFullYear(),
						(mm > 9 ? '' : '0') + mm,
						(dd > 9 ? '' : '0') + dd
				].join('-');
			}
		};

		noUiSlider.create(timeSlider, {
			// Create two timestamps to define a range.
			range: {
				min: new Date('1981').getTime(),
				max: new Date().setMonth(new Date().getMonth() + 3)
			},

			// Steps of one day
			step: 1 * 24 * 60 * 60 * 1000,

			// Handle starting positions.
			start: new Date().getTime(),

			//tooltips: true,

			format: { to: $scope.toFormat, from: Number },

			connect: 'lower',

			// Show a scale with the slider
			pips: {
				mode: 'count',
				density: 2,
				values: 10,
				stepped: true,
				format: {
					to: function (value) {
						return $scope.toFormat(value, 'uipipes');
					},
					from: function (value) {
						return $scope.toFormat(value, 'uipipes');
					}
				}
			}
		});

		var stopPropagation = function (event) {
			event.stopPropagation();
		};

		var makeSliderToolTip = function (i, slider) {
			var tooltip = document.createElement('div'),
				input = document.createElement('input');

			// Add the input to the tooltip
			input.className = 'uitooltip-input';
			tooltip.className = 'noUi-tooltip';
			tooltip.appendChild(input);

			// On change, set the slider
			input.addEventListener('change', function () {
				if (this.value !== $scope.selectedDate) {
					$scope.selectedDate = this.value;
					slider.noUiSlider.set(new Date(this.value).getTime());
					$timeout(function () {
						$scope.changeTimeSlider();
					}, 500);
				}

			});

			// Catch all selections and make sure they don't reach the handle
			input.addEventListener('mousedown', stopPropagation);
			input.addEventListener('touchstart', stopPropagation);
			input.addEventListener('pointerdown', stopPropagation);
			input.addEventListener('MSPointerDown', stopPropagation);

			// Find the lower slider handle and insert the tooltip
			document.getElementById('datePickerSlider').querySelector('.noUi-handle-lower').appendChild(tooltip);
			
			return input;
		};

		// An 0 indexed array of input elements
		var tooltipInput = makeSliderToolTip(0, timeSlider);
		$scope.selectedDate = [
			new Date().getFullYear(),
			((new Date().getMonth() + 1) > 9 ? '' : '0') + (new Date().getMonth() + 1) ,
			(new Date().getDate() > 9 ? '' : '0') + new Date().getDate()
		].join('-');
		tooltipInput.value = $scope.selectedDate;

		// When the slider changes, update the tooltip
		timeSlider.noUiSlider.on('update', function (values, handle) {
   			tooltipInput.value = values[handle];
		});

		// Event Handler for slider
		timeSlider.noUiSlider.on('set', function (values, handle) {
			if (values[handle] !== $scope.selectedDate) {
				$scope.selectedDate = values[handle];
				tooltipInput.value = values[handle];
				// trigger ajax only if it is coming from the default handle, not from input tooltip
				if (event.target.className.startsWith('noUi')) {
					$timeout(function () {
						$scope.changeTimeSlider();
					}, 500);
				}
			}
		});

		$scope.changeTimeSlider = function () {
			$scope.updateMap(true);
		};

		// Forward Slider
		$scope.slideForward = function () {
			var date = new Date($scope.selectedDate);
			date.setDate(date.getDate() + 1);
			$scope.selectedDate = [
				date.getFullYear(), ((date.getMonth() + 1) > 9 ? '' : '0') + (date.getMonth() + 1) , ((date.getDate()) > 9 ? '' : '0') + (date.getDate())
			].join('-');
			tooltipInput.value = $scope.selectedDate;
			timeSlider.noUiSlider.set(new Date($scope.selectedDate).getTime());
			$timeout(function () {
				$scope.changeTimeSlider();
			}, 500);
		};

		// Backward Slider
		$scope.slideBackward = function () {
			var date = new Date($scope.selectedDate);
			date.setDate(date.getDate() - 1);
			$scope.selectedDate = [
				date.getFullYear(), ((date.getMonth() + 1) > 9 ? '' : '0') + (date.getMonth() + 1) , ((date.getDate()) > 9 ? '' : '0') + (date.getDate())
			].join('-');
			tooltipInput.value = $scope.selectedDate;
			timeSlider.noUiSlider.set(new Date($scope.selectedDate).getTime());
			$timeout(function () {
				$scope.changeTimeSlider();
			}, 500);
		};

		// Toogle TimeSlider control
		L.Control.ToogleTimeSlider = L.Control.extend({
			options: {
				position: 'bottomright',
				title: 'Toggle the Time Slider'
			},
			onAdd: function (map) {
				// happens after added to map
				var className = 'leaflet-control-toogle-time-slider',
					container = L.DomUtil.create('div', className + ' leaflet-bar'),
					options = this.options;

				this.button = L.DomUtil.create('button', 'btn btn-default', container);
				this.button.title = options.title;
				this.button.style.width = '30px';
				this.button.style.height = '30px';
				this.span = L.DomUtil.create('span', 'glyphicon glyphicon-ok-circle toogle-time-slider-icon', this.button);
				L.DomEvent.addListener(this.button, 'click', this.click, this);
				return container;
			},
			onRemove: function (map) {
			  	// nothing to do here
			},
			click: function(e) {
				$timeout(function () {	
					$scope.showTimeSlider = !$scope.showTimeSlider;
				}, 200);
				$(this.span).hasClass('glyphicon-ok-circle') ? $(this.span).removeClass('glyphicon-ok-circle').addClass('glyphicon-ban-circle') : $(this.span).removeClass('glyphicon-ban-circle').addClass('glyphicon-ok-circle'); // jshint ignore:line
			}
		});
		  
		L.control.toogleTimeSlider = function(options) {
			return new L.Control.ToogleTimeSlider(options);
		};

		/*
		 * Select Options for Variables
		 **/
		$scope.populateVariableOptions = function (option) {
			$scope.indexOptions = settings.indexOptions[option.value];
			$scope.showVariableSelect = true;
			$timeout(function () {
				$('#indexOptions > select option').each(function() {
					for (var i = 0; i < $scope.indexOptions.length; i++) {
						// translatedText
						// console.log($filter('translate')($scope.indexOptions[i].name));
						if ($filter('translate')($scope.indexOptions[i].name) === this.text) {
							$(this).attr('title', $scope.indexOptions[i].title);
						}
					}
				});
			});
		};

		// Adds area filter slider to the sidebar
		var areaFilterSlider = null;

		var addAreaFilter = function (layer) {

			if ($scope.areaFilterLayer) {
				areaFilterSlider.slider('destroy');
				areaFilterSlider = null;
			}

			areaFilterSlider = $('#areaFilterSlider').slider({
				formatter: function(value) {
					return 'Opacity: ' + value;
				},
				tooltip_position: 'top'
			}).on('slideStart', function (event) {
				$scope.areaFilterOpacityValue = event.value;
			}).on('slideStop', function (event) {
				var _value = event.value;
				if (_value !== $scope.areaFilterOpacityValue) {
					layer.setStyle({fillOpacity: _value});
				}
			});
			$scope.areaFilterLayer = layer;
			$scope.showAreaFilterSlider = true;

		};

		/**
		 * Web Mapping
		 **/

		var basemap_mapbox = L.tileLayer(settings.mapLayer,
			{
				minZoom: 4,
				attribution: "Map data &copy; <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors, " +
				"<a href='http://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, " +
				"Imagery � <a href='http://mapbox.com'>Mapbox</a>", // jshint ignore:line
				id: 'mapbox.light'
			}
		);

		// Base Layers
        var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, ' +
            'Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
        });

		// Base Map
        var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
		});

		// Initialize the Map
		var map = L.map('map', {
			center: [18.041, 98.218],
			layers: [Esri_WorldImagery],
			minZoom: 4,
			zoom: 5,
			zoomControl: false
		});

        var baseLayers = {
			//'Grayscale': basemap_mapbox,
            'Satellite Imagery': Esri_WorldImagery,
            'Topo Map': Esri_WorldTopoMap
        };

        // Control
        L.control.layers(baseLayers, null, { position: 'bottomright' }).addTo(map);

		// Marker Clusters
		var markerCluster = L.markerClusterGroup();
		markerCluster.on('layeradd', function (e) {
			console.log('new layer added to the cluster');
		});

		var selectBasin = function (layer) {
			if ($scope.areaFilterLayer) {
				layer.resetStyle($scope.areaFilterLayer);
			}
			$scope.selectedLayerData = { 'from': 'basin', 'gid': 1 };
			//layer.bringToFront();
			layer.setStyle({
				'color': 'black'
			});
			$timeout(function () { addAreaFilter(layer); });
		};

		// Set the max bounds for the map
		//map.setMaxBounds(map.getBounds());

		$scope.loadBasinGeoJSON = function (load) {
			$scope.showLoader = true;
			if (typeof(load) === 'undefined') load = false;
			// Load Basin Geojson
			$.getJSON('data/basin.geo.json')
				.done(function (data, status) {

					if (status === 'success') {
						$scope.showLoader = false;
						$scope.$apply();
					}
					// Adding default filter for this single polygon geojson
					//$scope.selectedLayerData = { 'table': 'basin', 'gid': 1 };
					//$timeout(function () { addAreaFilter(L.GeoJSON.geometryToLayer(data.features[0])); });
					$scope.basinGeojson = L.geoJson(data);
					selectBasin($scope.basinGeojson);
					map.fitBounds($scope.basinGeojson.getBounds());
					if (load) {
						markerCluster.addLayer($scope.basinGeojson);
					}
				});
		};

		$scope.loadCountryGeoJSON = function (load) {
			$scope.showLoader = true;
			if (typeof(load) === 'undefined') load = false;
			// Load Country Level Geojson
			$.getJSON('data/country.geo.json')
				.done(function (data, status) {

					if (status === 'success') {
						$scope.showLoader = false;
						$scope.$apply();
					}

					$scope.countryGeojson = L.geoJson(data, {
						onEachFeature: function (feature, layer) {
							layer.bindPopup(feature.properties.NAME);
						}
					}).on('click', function (e) {
						var layer = e.layer;
						if ($scope.areaFilterLayer) {
							e.target.resetStyle($scope.areaFilterLayer);
						}
						
						$scope.selectedLayerData = { 'from': 'country', 'name': layer.feature.properties.NAME, 'gid': layer.feature.properties.gid };
						layer.bringToFront();
						layer.setStyle({
							'color': 'black'
						});
						$timeout(function () { addAreaFilter(layer); });
					});
					map.fitBounds($scope.countryGeojson.getBounds());
					if (load) {
						markerCluster.addLayer($scope.countryGeojson);
					}
				});
		};

		$scope.loadAdminOneGeoJSON = function (load) {
			$scope.showLoader = true;
			if (typeof(load) === 'undefined') load = false;
			// Load Admin Level 1 Geojson
			$.getJSON('data/admin1.geo.json')
				.done(function (data, status) {

					if (status === 'success') {
						$scope.showLoader = false;
						$scope.$apply();
					}

					$scope.adminOneGeojson = L.geoJson(data)
					.on('click', function (e) {
						var layer = e.layer;
						if ($scope.areaFilterLayer) {
							e.target.resetStyle($scope.areaFilterLayer);
						}
						$scope.selectedLayerData = { 'from': 'admin1', 'country': layer.feature.properties.country, 'gid': layer.feature.properties.gid };
						layer.bringToFront();
						layer.setStyle({
							'color': 'black'
						});
						$timeout(function () { addAreaFilter(layer); });
					});
					map.fitBounds($scope.adminOneGeojson.getBounds());
					if (load) {
						markerCluster.addLayer($scope.adminOneGeojson);
					}
				});
		};

		$scope.loadAdminTwoGeoJSON = function (load) {
			$scope.showLoader = true;
			if (typeof(load) === 'undefined') load = false;
			// Load Admin Level 2 Geojson
			$.getJSON('data/admin2.geo.json')
				.done(function (data, status) {

					if (status === 'success') {
						$scope.showLoader = false;
						$scope.$apply();
					}

					$scope.adminTwoGeojson = L.geoJson(data)
					.on('click', function (e) {
						var layer = e.layer;
						if ($scope.areaFilterLayer) {
							e.target.resetStyle($scope.areaFilterLayer);
						}
						$scope.selectedLayerData = { 'from': 'admin2', 'country': layer.feature.properties.country, 'gid': layer.feature.properties.gid };
						layer.bringToFront();
						layer.setStyle({
							'color': 'black'
						});
						$timeout(function () { addAreaFilter(layer); });
					});
					map.fitBounds($scope.adminTwoGeojson.getBounds());
					if (load) {
						markerCluster.addLayer($scope.adminTwoGeojson);
					}
				});
		};

		$scope.updateMap = function (apply) {

			console.log($scope.timeOptionSelector);

			if (typeof(apply) === 'undefined') apply = false;

			var url = prepareUrlForAPI('map-data', apply);

			//$scope.$apply();
			if (url) {

				// Make a request
				apiCall(url, 'POST', $scope.selectedLayerData).then(
					function (response) {
						// Success Callback
						$scope.showLoader = false;
						// Clear Admin Layers if they are present
						//adminAreaChange('clearAreaFilter');
						markerCluster.clearLayers();
						// Clear the drawn Layer
						map.removeLayer($scope.editableLayers);
						if ($scope.areaFilterLayer) {
							map.addLayer($scope.areaFilterLayer);
						}
						var features = response.data.data.features;
						var date = $scope.selectedDate || new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
						if (features) {
							$scope.displayedGeoJSON = response.data.data;
							var index = $scope.indexOption.option.value,
								legendTitle = $scope.indexOption.option.name;

							if (['baseflow'].indexOf(index) > -1) {
								legendTitle += ' out of the Bottom Layer (mm) ';
							} else if (['dryspells'].indexOf(index) > -1) {
								legendTitle += ' during last 14 days duration ';
							}

							$scope.closeAlert();

							if (['dryspells'].indexOf(index) > -1) {
								$scope.drawFromDatabase(features, legendTitle, formattedDate(date), false);
							} else {
								$scope.drawFromDatabase(features, legendTitle, formattedDate(date));
							}

							$scope.showDownloadButton = true;

						} else {
							showInfoAlert('No data is available for ' + date + '! If you think this is error, please contact us!');
						}
					},
					function () {
						// Error Callback
						$scope.showLoader = false;
						showErrorAlert('problem connecting to database. check if database port is open!');
						console.log('problem connecting to database. check if database port is open!');
					}
				);

			}
		};

		// Marker Cluster for loading the geojson
		var adminAreaChange = function (type) {

			markerCluster.clearLayers();
			if ($scope.areaFilterLayer) {
				$scope.editableLayers.removeLayer($scope.areaFilterLayer);
				map.removeLayer($scope.areaFilterLayer);
				areaFilterSlider.slider('destroy');
				areaFilterSlider = null;
				$scope.showAreaFilterSlider = false;
				$scope.areaFilterLayer = null;
				$scope.selectedLayerData = {};
			}

			if (type === 'country') {
				if ($scope.countryGeojson) {
					map.fitBounds($scope.countryGeojson.getBounds());
					$scope.countryGeojson.eachLayer(function (layer) {
						$scope.countryGeojson.resetStyle(layer);
					});
					markerCluster.addLayer($scope.countryGeojson);
				} else {
					$scope.loadCountryGeoJSON(true);
				}
				map.addLayer(markerCluster);
			} else if (type === 'admin1') {
				if ($scope.adminOneGeojson) {
					map.fitBounds($scope.adminOneGeojson.getBounds());
					$scope.adminOneGeojson.eachLayer(function (layer) {
						$scope.adminOneGeojson.resetStyle(layer);
					});
					markerCluster.addLayer($scope.adminOneGeojson);
				} else {
					$scope.loadAdminOneGeoJSON(true);
				}
				map.addLayer(markerCluster);
			} else if (type === 'admin2') {
				if ($scope.adminTwoGeojson) {
					map.fitBounds($scope.adminTwoGeojson.getBounds());
					$scope.adminTwoGeojson.eachLayer(function (layer) {
						$scope.adminTwoGeojson.resetStyle(layer);
					});
					markerCluster.addLayer($scope.adminTwoGeojson);
				} else {
					$scope.loadAdminTwoGeoJSON(true);
				}
				map.addLayer(markerCluster);
			} else if (type === 'basin') {
				if ($scope.basinGeojson) {
					map.fitBounds($scope.basinGeojson.getBounds());
					$scope.basinGeojson.eachLayer(function (layer) {
						$scope.basinGeojson.resetStyle(layer);
					});
					selectBasin($scope.basinGeojson);
					markerCluster.addLayer($scope.basinGeojson);
				} else {
					$scope.loadBasinGeoJSON(true);
				}
				map.addLayer(markerCluster);
			} /*else if (type === 'clearAreaFilter') {
				if ($scope.areaFilterLayer) {
					map.removeLayer($scope.areaFilterLayer);
					$scope.areaFilterLayer = null;
					$scope.showAreaFilterSlider = false;
					$scope.selectedLayerData = {};
				}
			}*/
			return false;
		};

		$scope.adminAreaChange = function (option) {
			adminAreaChange(option.value);
		};

		// Zoom control
		L.control.zoom({
			position: 'bottomright'
		}).addTo(map);

		// Add editable layers
		map.addLayer($scope.editableLayers);

		// When draw is created
		map.on('draw:created', function (e) {
			adminAreaChange();
			var layer = e.layer;
			$scope.selectedLayerData = { 'wkt': Terraformer.WKT.convert(layer.toGeoJSON().geometry) };
			$scope.editableLayers.addLayer(layer);
			map.fitBounds(layer.getBounds());
			$timeout(function () { addAreaFilter(layer); });
		});

		// FileLayer (KML/GeoJSON/GPX)
		var fileLayerStyle = {
			color: 'red',
			opacity: 0.2,
			fillOpacity: 0.2,
			weight: 1,
			clickable: false
		};

		L.Control.FileLayerLoad.LABEL = "<img class='icon' width='20px' src='modules/core/client/img/folder.svg' alt='file icon'/>";

		var fileLayerControl = L.Control.fileLayerLoad({
			fitBounds: true,
			position: 'bottomright',
			fileSizeLimit: 5120, // 5 MB
			layerOptions: {
				style: fileLayerStyle,
				pointToLayer: function (data, latlng) {
					return L.circleMarker(
						latlng,
						{ style: fileLayerStyle }
					);
				}
			}
		}).addTo(map);

		// Event on Error
		fileLayerControl.loader.on('data:error', function (e) {
			console.log(e.error);
		});

		// Event on data load
		fileLayerControl.loader.on('data:loaded', function (e) {

			adminAreaChange();
			var layer = e.layer;
			var geojson = layer.toGeoJSON();
			if (geojson.type === 'FeatureCollection') {
				if (geojson.features.length === 1) {
					if (geojson.features[0].geometry.type === 'GeometryCollection') {
						map.removeLayer(layer);
						return alert('GeometryCollection is not supported!!!');
					} else {
						$scope.selectedLayerData = { 'wkt': Terraformer.WKT.convert(geojson.features[0].geometry) };
					}
				} else {
					map.removeLayer(layer);
					return alert('FeatureCollection not supported!!!');
				}
			} else {
				$scope.selectedLayerData = { 'wkt': Terraformer.WKT.convert(geojson.geometry) };
			}
			// Add area Filter
			$timeout(function () { addAreaFilter(layer); });
		});

		// Add draw control
		map.addControl($scope.drawControl);

		// Geosearch
		/*
		new L.Control.GeoSearch({
			provider: new L.GeoSearch.Provider.OpenStreetMap(),
			position: 'bottomright',
			showMarker: false,
			retainZoomLevel: true,
			autoComplete: true,
			autoCompleteDelay: 10
		}).addTo(map);
		*/

		// Time slider toggle control
		L.control.toogleTimeSlider({
			position: 'bottomright' 
		}).addTo(map);

		$scope.getColor = function (val) {

			var index = $scope.indexOption.option.value,
				grades = legend[index];

			for (var i in grades) {
				var grade = grades[i];
				if (grade.nature) {
					if (grade.nature === 'lesser') {
						if (val <= grade.value) {
							return grade.color;
						}
					} else if (grade.nature === 'greater') {
						if (val >= grade.value) {
							return grade.color;
						}
					}
				} else {
					if (val >= grade.min_value && val < grade.max_value) {
						return grade.color;
					}
				}
			}
		};

		$scope.getLegend = function () {

			//var legend = L.control({
			//	position: "bottomleft"
			//});
			var legendControl = L.control();

			legendControl.onAdd = function () {

				var div = L.DomUtil.create('div', 'info legend-leaflet'),
					labels = [],
					index = $scope.indexOption.option.value,
					grades = legend[index];

				for (var key in grades) { // jshint ignore:line
					labels.push('<p><i style="background:' + grades[key].color + '"></i> ' + grades[key].name + '</p>');
				}

				div.innerHTML = labels.join('<br>');
				return div;
			};

			return legendControl;
		};

		$scope.drawFromDatabase = function (polygonCollection, _legendParameter, _legendDate, showDecimal) {

			if (typeof(showDecimal) === 'undefined') showDecimal = true;

			// Clear Geojson before showing
			if ($scope.shownGeojson) {
				map.removeLayer($scope.shownGeojson);
			}

			$scope.shownGeojson = L.geoJson(polygonCollection, {
				style: function (feature) {

					var value = feature.properties.value,
						index = $scope.indexOption.option.value;

					/*if (['soil_temp_layer_1', 'soil_temp_layer_2', 'soil_temp_layer_3', 'surf_temp'].indexOf(index) > -1) {
						value -= 273.15;
					}*/

					var color = $scope.getColor([Math.round(value * 100) / 100]);

					return {
						weight: 1,
						opacity: color ? 1 : 0,
						color: 'white',
						dashArray: '3',
						fillOpacity: color ? 1 : 0,
						fillColor: color
					};
				},
				onEachFeature: function (feature, layer) {

					var value = feature.properties.value,
						index = $scope.indexOption.option.value;

					/*if (['soil_temp_layer_1', 'soil_temp_layer_2', 'soil_temp_layer_3', 'surf_temp'].indexOf(index) > -1) {
						value -= 273.15;
					}*/

					if (showDecimal) {
						layer.bindPopup('<h5>Value = ' + Math.round(value * 100) / 100 + '</h5>', { closeButton: false, offset: L.point(0, 10) });	
					} else {
						layer.bindPopup('<h5>Value = ' + Math.round(value) + '</h5>', { closeButton: false, offset: L.point(0, -10) });
					}

					layer.on('mouseover', function () { layer.openPopup(); });
					layer.on('mouseout', function () { layer.closePopup(); });
				}
			}).addTo(map);

			// Add Legend
			var legend = $scope.getLegend();
			if ($('.info.legend-leaflet.leaflet-control').length) {
				$('.info.legend-leaflet.leaflet-control').remove();
			}
			legend.addTo(map);
			$('.legend #legend-body .panel-body').append($('.info.legend-leaflet.leaflet-control'));
			$scope.legendParameter = _legendParameter;
			$scope.legendDate = _legendDate;
			$scope.showLegend = true;
		};

		/**
		 * Chart in Modal
		 **/
		// displays chart in the modal
		$scope.showChart = function () {

			var url = prepareUrlForAPI('graph-data');

			//$scope.$apply();
			if (url) {

				// Make a request
				apiCall(url, 'POST', $scope.selectedLayerData).then(
					function (response) {
						// Success Callback

						// Clear Admin Layers if they are present
						//$('#clearLayer').prop('checked', true);
						//markerCluster.clearLayers();

						var mean = [], min = [], max = [], stddev = [];

						for (var i = 0; i < response.data.length; ++i) {
							mean.push([Date.parse(response.data[i].data.date), response.data[i].data.mean]);
							min.push([Date.parse(response.data[i].data.date), response.data[i].data.min]);
							max.push([Date.parse(response.data[i].data.date), response.data[i].data.max]);
							stddev.push([Date.parse(response.data[i].data.date), response.data[i].data.stddev]);
						}
						var seriesOptions = [
							{
								name: 'Average',
								data: mean
							},
							{
								name: 'Minimum',
								data: min
							},
							{
								name: 'Maximum',
								data: max
							},
							{
								name: 'Standard Deviation',
								data: stddev
							}
						];

						// Create graph on it
						var scope = "Regional";
						if ($scope.selectedLayerData.from === "country") {
							scope = $scope.selectedLayerData.name.charAt(0).toUpperCase() + $scope.selectedLayerData.name.slice(1);
						} else if (["admin1", "admin2"].indexOf($scope.selectedLayerData.from) > -1) {
							scope = $scope.selectedLayerData.country.charAt(0).toUpperCase() + $scope.selectedLayerData.country.slice(1);
						}
						$scope.createGraph(seriesOptions, scope);

						// Show Model
						$scope.showModal();

						// Close Loader
						$scope.showLoader = false;

						$scope.closeAlert();
					},
					function () {
						// Error Callback
						$scope.showLoader = false;
						showErrorAlert('problem connecting to database. check if database port is open!');
						console.log('problem connecting to database. check if database port is open!');
					}
				);

			}

		};

		// Creates graph from the given data
		$scope.createGraph = function (seriesOptions, scope) {
			$scope.chartModalTitle = 'Charts and Graphs';

			Highcharts.stockChart('modal-body', {
				title: {
					text: $scope.indexOption.option.name + ' (' + scope + ')'
				},
				rangeSelector: {
					selected: 4
				},
				yAxis: {
					title: {
						text: $scope.indexOption.option.name + ' (' + scope + ')'
					},
					labels: {
						align: 'left'
					},
					plotLines: [
						{
					  		value: 0,
					  		width: 2,
					  		color: 'silver'
						}
					]
				},
				plotOptions: {
					series: {
					  	showInNavigator: true
					}
				},
				tooltip: {
					pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
					valueDecimals: 3
				},
				series: seriesOptions
			});
		};

		var isEmptyObject = function (obj) {
			for(var key in obj) {
				if(obj.hasOwnProperty(key))
					return false;
			}
			return true;
		};

		$scope.downloadRaster = function () {

			var _date = $scope.selectedDate || new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
			_date = _date.split('-');
			var date = _date[0] + '-' + ('0' + _date[1]).slice(-2) + '-' + ('0' + _date[2]).slice(-2);
			date = date.replace(/-/g, '_');

			var DownloadURL = $scope.downloadServerURL + $scope.indexOption.option.value + '/';

			if (!isEmptyObject($scope.selectedLayerData)) {
				if ($scope.selectedLayerData.from === 'country') {
					DownloadURL += $scope.selectedLayerData.name.toLowerCase() + '/' + 
								   $scope.indexOption.option.value + '_' + $scope.selectedLayerData.name.toLowerCase()  + '_' + date + '_';
				} else if ($scope.selectedLayerData.from === 'admin1' || $scope.selectedLayerData.from === 'admin2') {
					DownloadURL += $scope.selectedLayerData.country.toLowerCase() + '/' + 
								   $scope.indexOption.option.value + '_' + $scope.selectedLayerData.country.toLowerCase()  + '_' + date + '_';
				} else {
					DownloadURL += 'mekong/' + $scope.indexOption.option.value + '_mekong_' + date + '_';
				}
			} else {
				DownloadURL += 'mekong/' + $scope.indexOption.option.value + '_mekong_' + date + '_';
			}

			//var DownloadURL = $scope.downloadServerURL + $scope.indexOption.option.value + '/' +
			//                  $scope.indexOption.option.value + '_' + date + '_';

			var url = prepareUrlForAPI('download-data');

			// Make a request
			apiCall(url, 'POST').then(
				function (response) {
					// Success Callback
					$scope.showLoader = false;
					if (response.data) {
						var methodData = response.data[0];
						if (methodData.from_nowcast) {
							DownloadURL += 'nowcast.tif';
						} else {
							DownloadURL += 'forecast_';
							if (methodData.from_nmme) {
								DownloadURL += 'nmme.tif';
							} else {
								DownloadURL += 'esp.tif';
							}
						}
						$window.location.href = DownloadURL;
					}
				},
				function () {
					// Error Callback
					$scope.showLoader = false;
					showErrorAlert('problem connecting to database. check if database port is open!');
					console.log('problem connecting to database. check if database port is open!');
				}
			);
		};

		$scope.downloadVector = function () {

			if ($scope.displayedGeoJSON) {
				var _date = $scope.selectedDate || new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + "-" + new Date().getDate();
				_date = _date.split('-');
				var date = _date[0] + '-' + ('0' + _date[1]).slice(-2) + '-' + ('0' + _date[2]).slice(-2);
				date = date.replace(/-/g, '_');
				var fileName = $scope.indexOption.option.value + '_' + date + '_';

				var url = prepareUrlForAPI('download-data');

				// Make a request
				apiCall(url, 'POST').then(
					function (response) {
						// Success Callback
						$scope.showLoader = false;
						if (response.data) {
							var methodData = response.data[0];
							if (methodData.from_nowcast) {
								fileName += 'nowcast.geojson';
							} else {
								fileName += 'forecast.geojson';
							}
							// extract from https://github.com/mholt/PapaParse/issues/175
							var blob = new Blob([JSON.stringify($scope.displayedGeoJSON)]);
							if (window.navigator.msSaveOrOpenBlob)  // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
							    window.navigator.msSaveBlob(blob, fileName);
							else
							{
							    var a = window.document.createElement('a');
							    a.href = window.URL.createObjectURL(blob, {type: 'text/json'});
							    a.download = fileName;
							    document.body.appendChild(a);
							    a.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
							    document.body.removeChild(a);
							}
						}
					},
					function () {
						// Error Callback
						$scope.showLoader = false;
						showErrorAlert('problem connecting to database. check if database port is open!');
						console.log('problem connecting to database. check if database port is open!');
					}
				);
			}
		};

		// Opacity control
		$('#opacitySlider').slider({
			formatter: function(value) {
				return 'Opacity: ' + value;
			},
			tooltip_position: 'bottom'
		}).on('slideStart', function (event) {
			$scope.opacityValue = event.value;
		}).on('slideStop', function (event) {
			var _value = event.value;
		    if (_value !== $scope.opacityValue) {
		    	$scope.shownGeojson.setStyle({fillOpacity: _value});
		    }
		});

		$scope.opacityIconClick = function () {

			$scope.showOpacitySlider = !$scope.showOpacitySlider;

			if ($scope.opacitySliderIcon === 'fa fa-eye-slash fa-2x') {
				$scope.opacitySliderIcon = 'fa fa-eye fa-2x';
			} else {
				$scope.opacitySliderIcon = 'fa fa-eye-slash fa-2x';
			}
		};

	});

}());
