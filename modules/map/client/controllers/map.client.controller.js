(function () {

	"use strict";

	angular.module("rheas").controller("mapCtrl", function ($http, $scope, $state, $timeout, $window, settings) {

		// Settings
		$scope.areaFilter = {};
		$scope.areaFilter.options = settings.areaFilterOptions;
		$scope.areaFilter.value = $scope.areaFilter.options[3];
		$scope.indexSelectors = settings.indexSelectors;
		$scope.indexOptions = null;
		$scope.downloadServerURL = settings.downloadServerURL;

		// Map variables
		var legend = settings.legend;
		$scope.selectedLayer = null;
		$scope.shownGeojson = null;
		$scope.selectedLayerData = {};
		$scope.selectedLayerBounds = null;
		$scope.countryGeojson = null;
		$scope.adminOneGeojson = null;
		$scope.adminTwoGeojson = null;
		$scope.layerControl = L.control.layers();
		$scope.editableLayers = new L.FeatureGroup();
		$scope.fileLayers = null;
		$scope.drawOptions = {
			position: "bottomright",
			draw: {
				polyline: false,
				polygon: {
					allowIntersection: false, // Restricts shapes to simple polygons
					drawError: {
						color: "#e1e100", // Color the shape will turn when intersects
						message: "<strong>Oh snap!<strong> you can\'t draw that!" // Message that will show when intersect
					},
					shapeOptions: {
						color: "#ff0000"
					}
				},
				circle: false, // Turns off this drawing tool
				rectangle: {
					shapeOptions: {
						clickable: false,
						color: "#ff0000"
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
		$scope.myDate = new Date();
		$scope.showLoader = false;
		$scope.showBanner = true;
		$scope.defaultHandle = "default";
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

		// Sidebar Menu controller
		$scope.openSidebar = function () {

			if ($scope.toggleButtonClass === 'toggle-sidebar-button is-closed') {
				$scope.mapClass = 'col-sm-7 col-md-9 col-lg-9';
				$scope.sidebarClass = 'col-sm-5 col-md-3 col-lg-3 sidebar';
				$scope.toggleButtonClass = 'toggle-sidebar-button is-open';
				$scope.alertClass = 'custom-alert';
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
		var slider = document.getElementById("datePickerSlider");

		// Create a string representation of the date.
		$scope.toFormat = function (v, handle) {
			// where is this string representation
			// values = "uipipes" ; default is "default"
			var date = new Date(v);
			handle = handle || $scope.defaultHandle;
			if (handle === "uipipes") {
				return settings.months[date.getMonth()] + " " + date.getFullYear();
			} else if (handle === $scope.defaultHandle) {
				return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
			}
		};

		noUiSlider.create(slider, {
			// Create two timestamps to define a range.
			range: {
				min: new Date("1981").getTime(),
				max: $scope.myDate.setMonth($scope.myDate.getMonth() + 3)
			},

			// Steps of one day
			step: 1 * 24 * 60 * 60 * 1000,

			// Handle starting positions.
			start: new Date().getTime(),

			tooltips: true,

			format: { to: $scope.toFormat, from: Number },

			connect: "lower",

			// Show a scale with the slider
			pips: {
				mode: "count",
				density: 2,
				values: 10,
				stepped: true,
				format: {
					to: function (value) {
						return $scope.toFormat(value, "uipipes");
					},
					from: function (value) {
						return $scope.toFormat(value, "uipipes");
					}
				}
			}
		});

		// click tooltip
		$(".noUi-tooltip").on("click", function () {
			// Remove before adding
			$(this).find(".input-tooltip").remove();
			$(this).append("<input type='text' class='input-tooltip' style='background-color: darkred; color: #fff;'>");
			$(this).find(".input-tooltip").focus().focusout(function () {
				var valor = $(this).val();
				slider.noUiSlider.set(new Date(valor).getTime());
				if (valor) {
					$scope.selectedDate = valor;
					$scope.changeTimeSlider();
				}
			});
		});

		// Event Handler for slider
		slider.noUiSlider.on("end", function (values) {
			$scope.selectedDate = values[0];
			// trigger ajax only if it is coming from the default handle, not from input tooltip
			//if (event.target.className === "noUi-handle noUi-handle-lower") {
			if (event.target.className.startsWith('noUi')) {
				$scope.changeTimeSlider();
			}
		});

		/*
		 * Select Options for Variables
		 **/
		$scope.populateVariableOptions = function (option) {
			$scope.indexOptions = settings.indexOptions[option.value];
			$scope.showVariableSelect = true;
		};

		/*
		 * Alert
		 **/
		$scope.closeAlert = function () {
			$('.' + $scope.alertClass).addClass('display-none');
		};

		$scope.showAlert = function () {
			$('.' + $scope.alertClass).removeClass('display-none');
		};

		$scope.addDangerAlert = function () {
			$('.' + $scope.alertClass).removeClass('alert-info');
			$('.' + $scope.alertClass).removeClass('alert-success');
			$('.' + $scope.alertClass).addClass('alert-danger');
		};

		$scope.addSuccessAlert = function () {
			$('.' + $scope.alertClass).removeClass('alert-info');
			$('.' + $scope.alertClass).removeClass('alert-danger');
			$('.' + $scope.alertClass).addClass('alert-success');
		};

		$scope.addInfoAlert = function () {
			$('.' + $scope.alertClass).removeClass('alert-success');
			$('.' + $scope.alertClass).removeClass('alert-danger');
			$('.' + $scope.alertClass).addClass('alert-info');
		};


		/**
		 * Web Mapping
		 **/

		// Base Map
		var basemap_mapbox = L.tileLayer(settings.mapLayer,
			{
				maxZoom: 18,
				attribution: "Map data &copy; <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors, " +
				"<a href='http://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, " +
				"Imagery © <a href='http://mapbox.com'>Mapbox</a>", // jshint ignore:line
				id: "mapbox.light"
			}
		);

		// Initialize the Map
		var map = L.map("map", {
			center: [18.041, 98.218],
			zoom: 5,
			zoomControl: false,
			layers: [basemap_mapbox]
		});

		// Set the max bounds for the map
		//map.setMaxBounds(map.getBounds());

		$scope.loadCountryGeoJSON = function (load) {
			if (typeof(load) === 'undefined') load = false;
			// Load Country Level Geojson
			$.getJSON("data/country_geojson.geojson")
				.done(function (data) {
					console.log("added country geojson");
					$scope.countryGeojson = L.geoJson(data, {
						onEachFeature: function (feature, layer) {
							layer.bindPopup(feature.properties.NAME_0);
						}
					}).on("click", function (e) {
						if ($scope.selectedLayer) {
							e.target.resetStyle($scope.selectedLayer);
						}
						$scope.selectedLayerBounds = e.layer.getBounds();
						$scope.selectedLayer = e.layer;
						$scope.selectedLayerData = { "table": "country", "iso": e.layer.feature.properties.ISO, "name": e.layer.feature.properties.NAME_0 };
						$scope.selectedLayer.bringToFront();
						$scope.selectedLayer.setStyle({
							"color": "red"
						});
					});
					if (load) {
						markerCluster.addLayer($scope.countryGeojson);
					}
				});
		};

		$scope.loadAdminOneGeoJSON = function (load) {
			if (typeof(load) === 'undefined') load = false;
			// Load Admin Level 1 Geojson
			$.getJSON("data/admin1_geojson.geojson")
				.done(function (data) {
					console.log("added admin1 geojson");
					$scope.adminOneGeojson = L.geoJson(data, {
						onEachFeature: function (feature, layer) {
							layer.bindPopup(feature.properties.VARNAME_1);
						}
					}).on("click", function (e) {
						if ($scope.selectedLayer) {
							e.target.resetStyle($scope.selectedLayer);
						}
						$scope.selectedLayerBounds = e.layer.getBounds();
						$scope.selectedLayer = e.layer;
						$scope.selectedLayerData = { "table": "admin1", "iso": e.layer.feature.properties.ISO, "id": e.layer.feature.properties.ID_1 };
						$scope.selectedLayer.bringToFront();
						$scope.selectedLayer.setStyle({
							"color": "red"
						});
					});
					if (load) {
						markerCluster.addLayer($scope.adminOneGeojson);
					}
				});
		};

		$scope.loadAdminTwoGeoJSON = function (load) {
			if (typeof(load) === 'undefined') load = false;
			// Load Admin Level 2 Geojson
			$.getJSON("data/admin2_geojson.geojson")
				.done(function (data) {
					console.log("added admin2 geojson");
					$scope.adminTwoGeojson = L.geoJson(data, {
						onEachFeature: function (feature, layer) {
							layer.bindPopup(feature.properties.VARNAME_2);
						}
					}).on("click", function (e) {
						if ($scope.selectedLayer) {
							e.target.resetStyle($scope.selectedLayer);
						}
						$scope.selectedLayerBounds = e.layer.getBounds();
						$scope.selectedLayer = e.layer;
						$scope.selectedLayerData = { "table": "admin2", "iso": e.layer.feature.properties.ISO, "id": e.layer.feature.properties.ID_2 };
						$scope.selectedLayer.bringToFront();
						$scope.selectedLayer.setStyle({
							"color": "red"
						});
					});
					if (load) {
						markerCluster.addLayer($scope.adminTwoGeojson);
					}
				});
		};

		// Hide Draw Control
		$scope.hideDrawControl = function () {
			$(".leaflet-draw.leaflet-control").hide();
		};

		// Show Draw Control
		$scope.showDrawControl = function () {
			$(".leaflet-draw.leaflet-control").show();
		};

		// Hide file upload control
		$scope.hideFileUploader = function () {
			$(".leaflet-control-filelayer").hide();
		};

		// Show file upload control
		$scope.showFileUploader = function () {
			$(".leaflet-control-filelayer").show();
		};

		// Marker Cluster for loading the geojson
		var markerCluster = L.markerClusterGroup();
		var adminAreaChange = function (type) {

			if ($scope.selectedLayer) {
				map.removeLayer($scope.selectedLayer);
				$scope.layerControl.removeLayer($scope.selectedLayer);
			}
			markerCluster.clearLayers();
			// Hide Controls
			$scope.hideDrawControl();
			$scope.hideFileUploader();

			if (type === 'country') {
				if ($scope.countryGeojson) {
					markerCluster.addLayer($scope.countryGeojson);
				} else {
					$scope.loadCountryGeoJSON(true);
				}
				map.addLayer(markerCluster);
			} else if (type === 'admin1') {
				if ($scope.adminOneGeojson) {
					markerCluster.addLayer($scope.adminOneGeojson);
				} else {
					$scope.loadAdminOneGeoJSON(true);
				}
				map.addLayer(markerCluster);
			} else if (type === 'admin2') {
				if ($scope.adminTwoGeojson) {
					markerCluster.addLayer($scope.adminTwoGeojson);
				} else {
					$scope.loadAdminTwoGeoJSON(true);
				}
				map.addLayer(markerCluster);
			}
			return false;
		};

		$scope.adminAreaChange = function (option) {
			adminAreaChange(option.value);
		};

		// Zoom control
		L.control.zoom({
			position: "bottomright"
		}).addTo(map);

		// Show layer control
		$scope.showLayerControl = function () {
			$(".leaflet-control-layers").show();
		};
		// Hide layer control
		$scope.hideLayerControl = function () {
			$(".leaflet-control-layers").hide();
		};

		// Add editable layers
		map.addLayer($scope.editableLayers);
		// Add layer control to display at top
		map.addControl($scope.layerControl);
		// Dont show yet
		$scope.hideLayerControl();

		// When draw is created
		map.on("draw:created", function (e) {
			if ($scope.selectedLayer) {
				map.removeLayer($scope.selectedLayer);
				$scope.layerControl.removeLayer($scope.selectedLayer);
			}
			var layer = e.layer;
			$scope.selectedLayer = layer;
			$scope.selectedLayerData = { "drawWKT": Terraformer.WKT.convert(layer.toGeoJSON().geometry) };
			//$scope.selectedLayerData = { "drawGeojson": JSON.stringify(layer.toGeoJSON()) };
			$scope.editableLayers.addLayer(layer);
		});

		// Geosearch
		new L.Control.GeoSearch({
			provider: new L.GeoSearch.Provider.OpenStreetMap(),
			position: "bottomright",
			showMarker: false,
			retainZoomLevel: true,
			autoComplete: true,
			autoCompleteDelay: 150,
		}).addTo(map);

		// FileLayer (KML/GeoJSON/GPX)
		var fileLayerStyle = {
			color: "red",
			opacity: 1.0,
			fillOpacity: 1.0,
			weight: 1,
			clickable: false
		};

		L.Control.FileLayerLoad.LABEL = "<img class='icon' width='20px' src='modules/core/client/img/folder.svg' alt='file icon'/>";

		var fileLayerControl = L.Control.fileLayerLoad({
			fitBounds: true,
			position: "bottomright",
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
		fileLayerControl.loader.on("data:error", function (e) {
			console.log(e.error);
		});

		// Event on data load
		fileLayerControl.loader.on("data:loaded", function (e) {
			// Add to map layer switcher
			if ($scope.selectedLayer) {
				map.removeLayer($scope.selectedLayer);
			}
			var layer = e.layer;
			var geojson = layer.toGeoJSON();
			var layerId = layer._leaflet_id;
			var layerName = e.filename.substr(0, e.filename.split(e.format)[0].length - 1);
			var layerObject = { "layerId": layerId };
			$scope.selectedLayer = layer;
			if (geojson.type === "FeatureCollection") {
				if (geojson.features.length === 1) {
					$scope.selectedLayerData = { "drawWKT": Terraformer.WKT.convert(geojson.features[0].geometry) };
				} else {
					return alert("FeatureCollection not supported!!!");
				}
			} else {
				$scope.selectedLayerData = { "drawFileWKT": Terraformer.WKT.convert(geojson.geometry) };
			}

			//$scope.fileLayers.append(e.layer);
			if ($scope.fileLayers) {
				$scope.layerControl.removeLayer($scope.selectedLayer);
			}
			$scope.fileLayers = layerObject;
			//$scope.fileLayers.addLayer(layer);
			// Show layer control
			$scope.showLayerControl();
			$scope.layerControl.addOverlay(layer, "<b><span style='color: red; font-size: 15px;'>" + layerName + "</span></b>");

			$(".leaflet-control-layers-list").find(".leaflet-control-layers-overlays").append("<div id=" + layerId + "></div>");

			var sliderDiv = document.getElementById(layerId);
			noUiSlider.create(sliderDiv, {
				// Create two timestamps to define a range.
				range: {
					min: 0,
					max: 1
				},
				step: 0.1,
				start: 1,
				connect: "lower"
			});

			// Event Handler for slider
			sliderDiv.noUiSlider.on("end", function (values, handle, unencoded) {
				var layer = $scope.layerControl._getLayer($scope.fileLayers.layerId).layer;
				layer.setStyle({
					fillOpacity: unencoded[0],
					opacity: unencoded[0]
				});
			});

			//$scope.hideDrawControl();

		});

		// Add draw control
		map.addControl($scope.drawControl);

		// Formatted date
		var formattedDate = function (date) {

			var dateArray = date.split('-');

			var monthObject = {
				'1': 'January',
				'2': 'February',
				'3': 'March',
				'4': 'April',
				'5': 'May',
				'6': 'June',
				'7': 'July',
				'8': 'August',
				'9': 'September',
				'10': 'October',
				'11': 'November',
				'12': 'December'
			};

			return dateArray[0] + ', ' + monthObject[dateArray[1]] + ' ' + dateArray[2];

		};

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
					if (val >= grade.min_value && val <= grade.max_value) {
						return grade.color;
					}
				}
			}

			/*if (val >= grades.extermely_wet.value) {
				return grades.extermely_wet.color;
			} else if (val <= grades.extermely_dry.value) {
				return grades.extermely_dry.color;
			} else {
				for (var k in grades) {
					if (val >= grades[k].min_value && val <= grades[k].max_value) {
						return grades[k].color;
					}
				}
			}*/
		};

		$scope.getLegend = function () {

			//var legend = L.control({
			//	position: "bottomleft"
			//});
			var legendControl = L.control();

			legendControl.onAdd = function () {

				var div = L.DomUtil.create("div", "info legend-leaflet"),
					labels = [],
					index = $scope.indexOption.option.value,
					grades = legend[index];

				for (var key in grades) { // jshint ignore:line
					labels.push('<i style="background:' + grades[key].color + '"></i> ' + grades[key].name);
				}

				div.innerHTML = labels.join('<br>');
				return div;
			};

			return legendControl;
		};

		$scope.drawFromDatabase = function (polygonCollection, _legendParameter, _legendDate) {

			// Clear Geojson before showing
			if ($scope.shownGeojson) {
				map.removeLayer($scope.shownGeojson);
			}

			$scope.shownGeojson = L.geoJson(polygonCollection, {
				style: function (feature) {
					return {
						weight: 1,
						opacity: 1,
						color: "white",
						dashArray: "3",
						fillOpacity: 0.7,
						fillColor: $scope.getColor([Math.round(feature.properties.value * 100) / 100])
					};
				},
				onEachFeature: function (feature, layer) {
					layer.bindPopup("<h5>Value = " + Math.round(feature.properties.value * 100) / 100 + "</h5>", { closeButton: false, offset: L.point(0, -20) });
					layer.on("mouseover", function () { layer.openPopup(); });
					layer.on("mouseout", function () { layer.closePopup(); });
				}
			}).addTo(map);

			// Add Legend
			var legend = $scope.getLegend();
			if ($(".info.legend-leaflet.leaflet-control").length) {
				$(".info.legend-leaflet.leaflet-control").remove();
			}
			legend.addTo(map);
			$('.legend #legend-body .panel-body').append($('.info.legend-leaflet.leaflet-control'));
			$scope.legendParameter = _legendParameter;
			$scope.legendDate = _legendDate;
			$scope.showLegend = true;
		};

		var apiCall = function (url, method, data) {
			console.log(method, url);
			if (data) {
				return $http({
					method: method,
					url: url,
					data: $.param(data),
					headers: { "Content-Type": "application/x-www-form-urlencoded" }
				});
			} else {
				return $http({
					method: method,
					url: url,
					headers: { "Content-Type": "application/x-www-form-urlencoded" }
				});
			}
		};

		var prepareUrlForAPI = function (action, apply) {
			if (!$scope.indexOption.option) {
				$scope.alertContent = 'No parameter specified!';
				$scope.addDangerAlert();
				$scope.showAlert();
				if (apply) {
					$scope.$apply();
				}
				return false;
			}

			$scope.showLoader = true;
			var start = $scope.selectedDate || new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(),
				data = {
					'action': action,
					'index': $scope.indexOption.option.value,
					'date': start
				},
				url = '/' + $.param(data);

			return url;
		};

		// API Request from Server
		$scope.updateMap = function (apply) {

			if (typeof(apply) === 'undefined') apply = false;

			var url = prepareUrlForAPI('map-data', apply);

			//$scope.$apply();
			if (url) {

				// Make a request
				apiCall(url, "POST", $scope.selectedLayerData).then(
					function (response) {
						// Success Callback
						$scope.showLoader = false;
						// Clear Admin Layers if they are present
						//$('#area-filter').val('clearLayer');
						$scope.areaFilter.value = $scope.areaFilter.options[3];
						markerCluster.clearLayers();
						// Clear the drawn Layer
						//$scope.editableLayers.removeLayer($scope.selectedLayer);
						if ($scope.selectedLayer) {
							map.removeLayer($scope.selectedLayer);
						}
						$scope.showDrawControl();
						$scope.showFileUploader();
						var features = response.data.data.features;
						var date = $scope.selectedDate || new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
						if (features) {
							$scope.displayedGeoJSON = response.data.data;
							var index = $scope.indexOption.option.value,
								legendTitle = $scope.indexOption.option.name;

							if (['severity'].indexOf(index) > -1) {
								legendTitle += ' (%) ';
							} else if (['dryspells'].indexOf(index) > -1) {
								legendTitle += ' during last 14 days duration ';
							} else if (['rootmoist'].indexOf(index) > -1) {
								legendTitle += ' (mm) ';
							}
							$scope.closeAlert();
							$scope.drawFromDatabase(features, legendTitle + ' for ', formattedDate(date));
							$scope.showDownloadButton = true;
						} else {
							$scope.addInfoAlert();
							$scope.alertContent = 'No data is available for ' + date + '! If you think this is error, please contact us!';
							$scope.showAlert();
						}
					},
					function () {
						// Error Callback
						$scope.showLoader = false;
						$scope.addDangerAlert();
						$scope.alertContent = 'problem connecting to database. check if database port is open!';
						$scope.showAlert();
						console.log('problem connecting to database. check if database port is open!');
					}
				);

			}
		};

		$scope.changeTimeSlider = function () {

			$scope.updateMap(true);
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
				apiCall(url, "POST", $scope.selectedLayerData).then(
					function (response) {
						// Success Callback

						// Clear Admin Layers if they are present
						$("#clearLayer").prop("checked", true);
						markerCluster.clearLayers();

						var formattedData = [];

						for (var i = 0; i < response.data.length; ++i) {
							var data = [Date.parse(response.data[i].data.date), response.data[i].data.average];
							formattedData.push(data);
						}

						// Show Model
						$scope.showModal();

						// Create graph on it
						$scope.createGraph(formattedData);

						// Close Loader
						$scope.showLoader = false;

						$scope.closeAlert();
					},
					function () {
						// Error Callback
						$scope.showLoader = false;
						$scope.addDangerAlert();
						$scope.alertContent = 'problem connecting to database. check if database port is open!';
						$scope.showAlert();
						console.log('problem connecting to database. check if database port is open!');
					}
				);

			}

		};

		// Modal Close Function
		$scope.closeModal = function () {
			$(".modal-body").html("");
			$('#chartModal').addClass('display-none-imp');
		};

		// Modal Open Function
		$scope.showModal = function () {
			$('#chartModal').removeClass('display-none-imp');
		};

		// Close the Modal
		$(".modal-close").click(function () {
			$scope.closeModal();
		});

		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function (event) {
			if (event.target === $("#chartModal")[0]) {
				$scope.closeModal();
			}
		};

		// Creates graph from the given data
		$scope.createGraph = function (data) {
			//$(".modal-body").show();
			$scope.chartModalTitle = 'Charts and Graphs';
			$('.modal-body').highcharts({
				chart: {
					type: "spline"
				},
				title: {
					text: 'Average ' + $scope.indexOption.option.name + ' Value (Regional)'
				},
				rangeSelector: {
					enabled: true,
					inputEnabled: true,
					buttons: [{
						type: "day",
						count: 3,
						text: "3d"
					}, {
						type: "week",
						count: 1,
						text: "1w"
					}, {
						type: "month",
						count: 1,
						text: "1m"
					}, {
						type: "month",
						count: 3,
						text: "3m"
					}, {
						type: "month",
						count: 6,
						text: "6m"
					}, {
						type: "year",
						count: 1,
						text: "1y"
					}, {
						type: "all",
						text: "All"
					}],
					selected: 3
				},
				xAxis: {
					type: 'datetime',
					dateTimeLabelFormats: {
						month: '%e. %b, %Y',
						year: '%b'
					},
					title: {
						text: 'Date'
					}
				},
				yAxis: {
					title: {
						text: 'Average ' + $scope.indexOption.option.name + ' (Regional)'
					}
				},
				series: [{
					name: $scope.indexOption.option.name,
					data: data
				}]
			});
		};

		$scope.downloadRaster = function () {

			var _date = $scope.selectedDate || new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
			_date = _date.split("-");
			var date = _date[0] + "-" + ("0" + _date[1]).slice(-2) + "-" + ("0" + _date[2]).slice(-2);
			date = date.replace(/-/g, "_");
			var DownloadURL = $scope.downloadServerURL + $scope.indexOption.option.value + '/' +
			                  $scope.indexOption.option.value + '_' + date + '_';

			var url = prepareUrlForAPI('method-data');

			// Make a request
			apiCall(url, "POST").then(
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
					$scope.addDangerAlert();
					$scope.alertContent = 'problem connecting to database. check if database port is open!';
					$scope.showAlert();
					console.log('problem connecting to database. check if database port is open!');
				}
			);
		};

		$scope.downloadVector = function () {

			if ($scope.displayedGeoJSON) {
				var _date = $scope.selectedDate || new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
				_date = _date.split("-");
				var date = _date[0] + "-" + ("0" + _date[1]).slice(-2) + "-" + ("0" + _date[2]).slice(-2);
				date = date.replace(/-/g, "_");
				var fileName = $scope.indexOption.option.value + '_' + date + '_';

				var url = prepareUrlForAPI('method-data');

				// Make a request
				apiCall(url, "POST").then(
					function (response) {
						// Success Callback
						$scope.showLoader = false;
						if (response.data) {
							var methodData = response.data[0];
							if (methodData.from_nowcast) {
								fileName += 'nowcast.geojson';
							} else {
								fileName += 'forecast_';
								if (methodData.from_nmme) {
									fileName += 'nmme.geojson';
								} else {
									fileName += 'esp.geojson';
								}
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
						$scope.addDangerAlert();
						$scope.alertContent = 'problem connecting to database. check if database port is open!';
						$scope.showAlert();
						console.log('problem connecting to database. check if database port is open!');
					}
				);
			}
		};
	});

}());
