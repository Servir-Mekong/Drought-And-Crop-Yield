(function () {
	"use strict";
	METRO_AUTO_REINIT = true;// jshint ignore:line
}());

(function () {

	"use strict";

	angular.module("rheas").controller("HomeCtrl", function ($http, $scope, $state) {

		// Map variables
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
			position: "topright",
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

		$scope.disableCalendar = true;
		$scope.myDate = new Date();
		$scope.showLoader = false;
		$scope.showBanner = true;
		$scope.defaultHandle = "default";
		$scope.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
		$scope.droughtIndex = "";
		$scope.soilIndex = "";
		$scope.energyIndex = "";
		$scope.waterIndex = "";
		$scope.grades = {
			"extermely_wet": {
				"value": 2,
				"color": "#0c367a",
				"name": "Extremely Wet"
			},
			"very_wet": {
				"min_value": 1.5,
				"max_value": 1.99,
				"color": "#5490f2",
				"name": "Very Wet"
			},
			"moderately_wet": {
				"min_value": 1.0,
				"max_value": 1.49,
				"color": "#53f1ea",
				"name": "Moderately Wet"
			},
			"near_normal": {
				"min_value": -0.99,
				"max_value": 0.99,
				"color": "#c1c5cc",
				"name": "Near Normal"
			},
			"moderately_dry": {
				"min_value": -1.49,
				"max_value": -1.0,
				"color": "#e9fc16",
				"name": "Moderately Dry"
			},
			"severly_dry": {
				"min_value": -1.99,
				"max_value": -1.5,
				"color": "#f7911d",
				"name": "Severely Dry"
			},
			"extermely_dry": {
				"value": -2,
				"color": "#f41707",
				"name": "Extermely Dry"
			}
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
				return $scope.months[date.getMonth()] + " " + date.getFullYear();
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
				$scope.selectedDate = valor;
				$scope.changeTimeSlider();
			});
		});

		// Event Handler for slider
		slider.noUiSlider.on("end", function (values) {
			$scope.selectedDate = values[0];
			// trigger ajax only if it is coming from the default handle, not from input tooltip
			if (event.target.className === "noUi-handle noUi-handle-lower") {
				$scope.changeTimeSlider();
			}
		});

		/**
		 * Chart in Modal
		 **/

		// displays chart in the modal
		$scope.showChart = function () {
			// Show Loader
			$scope.showLoader = true;

			// Load Data
			$scope.graphLoader();

		};

		// Modal Close Function
		$scope.closeModal = function () {
			$(".modal-body").html("");
			$("#chartModal").hide();
		};

		// Modal Open Function
		$scope.openModal = function () {
			$("#chartModal").show();
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

		/**
		 * Web Mapping
		 **/

		// Base Map
		var basemap_mapbox = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
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
			});

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
			});

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
			});

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
		$("#country").change(function () {
			markerCluster.clearLayers();
			if ($scope.selectedLayer) {
				map.removeLayer($scope.selectedLayer);
				$scope.layerControl.removeLayer($scope.selectedLayer);
			}
			// Hide Controls
			$scope.hideDrawControl();
			$scope.hideFileUploader();
			if ($scope.countryGeojson) {
				markerCluster.addLayer($scope.countryGeojson);
			}
			map.addLayer(markerCluster);

		});

		$("#admin1").change(function () {
			if ($scope.selectedLayer) {
				map.removeLayer($scope.selectedLayer);
				$scope.layerControl.removeLayer($scope.selectedLayer);
			}
			markerCluster.clearLayers();
			// Hide Controls
			$scope.hideDrawControl();
			$scope.hideFileUploader();
			if ($scope.adminOneGeojson) {
				markerCluster.addLayer($scope.adminOneGeojson);
			}
			map.addLayer(markerCluster);

		});

		$("#admin2").change(function () {
			if ($scope.selectedLayer) {
				map.removeLayer($scope.selectedLayer);
				$scope.layerControl.removeLayer($scope.selectedLayer);
			}
			markerCluster.clearLayers();
			$scope.hideFileUploader();
			// Hide Controls
			$scope.hideDrawControl();
			if ($scope.adminTwoGeojson) {
				markerCluster.addLayer($scope.adminTwoGeojson);
			}
			map.addLayer(markerCluster);

		});

		$("#clearLayer").change(function () {
			if ($scope.selectedLayer) {
				map.removeLayer($scope.selectedLayer);
				$scope.layerControl.removeLayer($scope.selectedLayer);
			}
			markerCluster.clearLayers();
			// Show Controls
			$scope.showDrawControl();
			$scope.showFileUploader();
		});

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
		// Add draw control
		map.addControl($scope.drawControl);

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
			position: "topright",
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

		// Geosearch
		new L.Control.GeoSearch({
			provider: new L.GeoSearch.Provider.OpenStreetMap(),
			position: "topright",
			showMarker: false,
			retainZoomLevel: true,
			autoComplete: true,
			autoCompleteDelay: 150,
		}).addTo(map);

		// Animation for the side menu
		var sideMenu = true;
		$("#sidemenu-arrow-icon").click(function () {
			sideMenu = !sideMenu;
			sideMenu ? $("#sidemenu").animate({ left: "0px" }) : $("#sidemenu").animate({ left: "-350px" }); // jshint ignore:line
			$(this).toggleClass("sidebar-open sidebar-close");
		});

		$scope.getColor = function (val) {

			if (val >= $scope.grades.extermely_wet.value) {
				return $scope.grades.extermely_wet.color;
			} else if (val <= $scope.grades.extermely_dry.value) {
				return $scope.grades.extermely_dry.color;
			} else {
				for (var k in $scope.grades) {
					if (val >= $scope.grades[k].min_value && val <= $scope.grades[k].max_value) {
						return $scope.grades[k].color;
					}
				}
			}
		};

		$scope.getLegend = function () {

			var legend = L.control({
				position: "bottomleft"
			});

			legend.onAdd = function () {

				var div = L.DomUtil.create("div", "info legend"),
					labels = [];

				for (var key in $scope.grades) { // jshint ignore:line
					labels.push('<i style="background:' + $scope.grades[key].color + '"></i> ' + $scope.grades[key].name);
				}

				div.innerHTML = labels.join('<br>');
				return div;
			};

			if ($(".info.legend.leaflet-control").length) {
				$(".info.legend.leaflet-control").remove();
				legend.addTo(map);
			} else {
				legend.addTo(map);
			}
		};

		$scope.drawFromDatabase = function (polygonCollection) {

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
					layer.bindPopup("<h5>Value = " + feature.properties.value + "</h5>", { closeButton: false, offset: L.point(0, -20) });
					layer.on("mouseover", function () { layer.openPopup(); });
					layer.on("mouseout", function () { layer.closePopup(); });
				}
			}).addTo(map);

			// Add Legend
			$scope.getLegend();
		};

		var apiCall = function (url, method, data) {
			console.log(method, url);
			return $http({
				method: method,
				url: url,
				data: $.param(data),
				headers: { "Content-Type": "application/x-www-form-urlencoded" }
			});

		};

		// API Request from Server
		$scope.connectToDatabase = function (formData) {

			$scope.showLoader = true;
			$scope.droughtIndex = (formData) ? formData.drought_index : $scope.droughtIndex;
			$scope.soilIndex = (formData) ? formData.soil_index : $scope.soilIndex;
			$scope.energyIndex = (formData) ? formData.energy_index : $scope.energyIndex;
			$scope.waterIndex = (formData) ? formData.water_index : $scope.waterIndex;
			var start = $scope.selectedDate || new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(),
				data = {
					"drought-index": $scope.droughtIndex,
					"soil-index": $scope.soilIndex,
					"energy-balance": $scope.energyIndex,
					"water-balance": $scope.waterIndex,
					"fdate": start
				},
				url = "/" + $.param(data);

			if (!$scope.droughtIndex && !$scope.soilIndex && !$scope.energyIndex && !$scope.waterIndex) {
				$scope.showLoader = false;
				return alert("no parameter specified!");
			}

			// Make a request
			apiCall(url, "POST", $scope.selectedLayerData).then(
				function (response) {
					// Success Callback
					$scope.showLoader = false;
					// Clear Admin Layers if they are present
					$("#clearLayer").prop("checked", true);
					markerCluster.clearLayers();
					// Clear the drawn Layer
					//$scope.editableLayers.removeLayer($scope.selectedLayer);
					if ($scope.selectedLayer) {
						map.removeLayer($scope.selectedLayer);
					}
					$scope.showDrawControl();
					$scope.showFileUploader();
					$scope.drawFromDatabase(response.data.row_to_json.features);
				},
				function () {
					// Error Callback
					$scope.showLoader = false;
					alert("problem connecting to database.check if database port is open!");
					console.log("problem connecting to database. check if database port is open!");
				}
			);
		};

		$scope.changeTimeSlider = function () {

			$scope.showLoader = true;
			$scope.droughtIndex = $("#droughtIndex").val() || $scope.droughtIndex;
			$scope.soilIndex = $("#soilIndex").val() || $scope.soilIndex;
			$scope.energyIndex = $("#energyIndex").val() || $scope.energyIndex;
			$scope.waterIndex = $("#waterIndex").val() || $scope.waterIndex;
			var start = $scope.selectedDate || new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(),
				data = {
					"drought-index": $scope.droughtIndex,
					"soil-index": $scope.soilIndex,
					"energy-balance": $scope.energyIndex,
					"water-balance": $scope.waterIndex,
					"fdate": start
				},
				url = "/" + $.param(data);

			console.log(url);

			if (!$scope.droughtIndex && !$scope.soilIndex && !$scope.energyIndex && !$scope.waterIndex) {
				$scope.showLoader = false;
				return alert("no parameter specified!");
			}

			// Make a request
			apiCall(url, "POST", $scope.selectedLayerData).then(
				function (response) {
					// Success Callback
					$scope.showLoader = false;
					// Clear Admin Layers if they are present
					$("#clearLayer").prop("checked", true);
					markerCluster.clearLayers();
					// Clear the drawn Layer
					//$scope.editableLayers.removeLayer($scope.selectedLayer);
					if ($scope.selectedLayer) {
						map.removeLayer($scope.selectedLayer);
					}
					$scope.drawFromDatabase(response.data.row_to_json.features);
				},
				function () {
					// Error Callback
					$scope.showLoader = false;
					alert("problem connecting to database.check if database port is open!");
					console.log("problem connecting to database. check if database port is open!");
				}
			);
		};

		// Creates graph from the given data
		$scope.createGraph = function (data) {
			$(".modal-body").show();
			$("#modal-header-title").text("Charts and Graphs");
			$(".modal-body").highcharts({
				chart: {
					type: "spline"
				},
				title: {
					text: "Average SPI1 Value"
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
					type: "datetime",
					dateTimeLabelFormats: {
						month: "%e. %b, %Y",
						year: "%b"
					},
					title: {
						text: "Date"
					}
				},
				yAxis: {
					title: {
						text: "Average SPI1"
					}
				},
				series: [{
					name: "SPI1",
					data: data
				}]
			});
		};

		$scope.graphLoader = function () {
			$scope.showLoader = true;
			$scope.droughtIndex = $("#droughtIndex").val() || $scope.droughtIndex;
			$scope.soilIndex = $("#soilIndex").val() || $scope.soilIndex;
			$scope.energyIndex = $("#energyIndex").val() || $scope.energyIndex;
			$scope.waterIndex = $("#waterIndex").val() || $scope.waterIndex;
			var start = $scope.selectedDate || new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(),
				data = {
					"action": "graph-data",
					"drought-index": $scope.droughtIndex,
					"soil-index": $scope.soilIndex,
					"energy-balance": $scope.energyIndex,
					"water-balance": $scope.waterIndex,
					"fdate": start
				},
				url = "/" + $.param(data);

			// Error when no index is specified
			if (!$scope.droughtIndex && !$scope.soilIndex && !$scope.energyIndex && !$scope.waterIndex) {
				$scope.showLoader = false;
				return alert("no parameter specified!");
			}

			console.log(url);

			// Database call
			apiCall(url, "POST", {}).then(
				function (response) {
					// Success Callback

					// Clear Admin Layers if they are present
					$("#clearLayer").prop("checked", true);
					markerCluster.clearLayers();

					var formattedData = [];

					for (var i = 0; i < response.data.length; ++i) {
						var data = [Date.parse(response.data[i].row_to_json._date), response.data[i].row_to_json._average];
						formattedData.push(data);
					}

					// Show Model
					$scope.openModal();

					// Create graph on it
					$scope.createGraph(formattedData);

					// Close Loader
					$scope.showLoader = false;
				},
				function () {
					// Error Callback
					$scope.showLoader = false;
					alert("problem connecting to database.check if database port is open!");
					console.log("problem connecting to database. check if database port is open!");
				}
			);
		};
	});

}());
