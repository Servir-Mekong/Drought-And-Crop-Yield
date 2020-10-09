(function () {

  'use strict';
  angular.module('landcoverportal')
  .controller('MapController', function ($http, $rootScope, $scope, $sanitize, $timeout, appSettings, MapService) {

    $scope.partners = settings.partnerspopup;
    $scope.areaFilter = {};
		$scope.areaFilter = settings.areaFilterOptions;
		$scope.partners = settings.partnerspopup;
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

    // Map variables
		$scope.areaFilterLayer = null;
		$scope.shownGeojson = null;
		$scope.selectedLayerData = { 'from': 'country', 'name': 'Myanmar', 'gid': 3 };
		//$scope.selectedLayerBounds = null;
		$scope.countryGeojson = null;
		$scope.adminOneGeojson = null;
		$scope.adminTwoGeojson = null;
		//$scope.layerControl = L.control.layers();
		$scope.editableLayers = new L.FeatureGroup();
		//$scope.fileLayers = null;


		// Other variables
		$scope.disableCalendar = true;
		$scope.showBanner = true;
		$scope.defaultHandle = 'default';
		$scope.toggleButtonClass = 'toggle-sidebar-button is-closed';
		$scope.sidebarClass = 'display-none';
		$scope.mapClass = 'col-md-12 col-sm-12 col-lg-12';
		$scope.alertClass = 'custom-alert-full';
		$scope.alertContent = '';
		$scope.showVariableSelect = false;
		$scope.indexOption = {};
		$scope.showLegend = true;
		$scope.legendParameter = '';
		$scope.legendDate = '';
		$scope.chartModalTitle = '';
		$scope.showDownloadButton = false;
		$scope.displayedGeoJSON = null;
		$scope.showOpacitySlider = true;
		$scope.opacitySliderIcon = 'fa fa-eye-slash fa-2x';
		$scope.opacityValue = null;
		$scope.areaFilterOpacityValue = null;
		$scope.showTimeSlider = false;
		$scope.showAreaFilterSlider = false;

    $scope.variables = appSettings.variables;
    $scope.periodicity = appSettings.periodicity;
    $scope.areaIndexSelectors = appSettings.areaIndexSelectors;
    $scope.downloadServerURL = appSettings.downloadServerURL;
    $scope.legendsSB = appSettings.legendsSB;
    $scope.droughtLegend = appSettings.droughtLegend;
    $scope.legend = []
    $scope.showLoader = true;
    var geojsondata, selectedFeature, wmsLayer, selectedAreaLevel;
    var lwmsLayer;
    var rwmsLayer;
    var compare;

    //init study area
    var areaid0 = '154';
    var areaid1 = '';
    var type = 'country';
    var selectedArea = 'Myanmar';

    // Hide collapse for disclaimer
    $timeout(function () {
      $('#disclaimer-collapse').collapse('show');
      $('#disclaimer-collapse').collapse({
        toggle: false
      });
    }, 2000);
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

		// Initialize the Map
		var map = L.map('map', {
			center: [18.765819, 96.343595],
			minZoom: 4,
			zoom: 6,
			zoomControl: false,
		});

		// Base Layers
		var basemapLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}').addTo(map);
		map.attributionControl.setPrefix('Tiles &copy; Esri &mdash; World Topographic Map ');

		map.createPane('waterLayer');
		map.createPane('streamLayer');
		map.createPane('admin');
		map.createPane('droughtwmsLayer');
		map.getPane('admin').style.zIndex = 650;
		map.getPane('droughtwmsLayer').style.zIndex = 560;
		map.getPane('waterLayer').style.zIndex = 570;
		map.getPane('streamLayer').style.zIndex = 565;


    $("#selectedAreaText").text(selectedArea);
		//var layer = L.esri.basemapLayer('Topographic').addTo(map);

        // Control

		L.Control.Custom = L.Control.Layers.extend({
			onAdd: function () {
				this._initLayout();
				this._addElement();
				this._update();
				return this._container;
			},
			_addElement: function () {
				var elements = this._container.getElementsByClassName('leaflet-control-layers-list');
				var div = L.DomUtil.create('div', 'leaflet-control-layers-overlays', elements[0]);
				div.innerHTML = '<label><b>Basemap</b></label>'+
				'<label class="container_radio">Satellite Imagery<input name="basemap_selection" id="satellite" value="satellite" type="radio"></input><span class="checkmark_radio"></span></label>'+
				'<label class="container_radio">Topo Map<input name="basemap_selection" id="topo" value="topo" type="radio" checked="checked"></input><span class="checkmark_radio"></span></label>'+
				'<hr>'+
				'<label><b>Layers</b></label>'+
				'<ul class="toggles-list">'+
					'<li class="toggle"><label class="switch_layer"><input  name="inland_water_toggle" id="inland_water_toggle" checked="checked" type="checkbox"><span class="slider_toggle round"></span></label><label>Inland Water </label></li>'+
					'<li class="toggle"><label class="switch_layer"><input  name="stream_toggle" id="stream_toggle" type="checkbox"><span class="slider_toggle round"></span></label><label>Stream </label></li>'+
				'</ul>';
			}
		});

		var control = new L.Control.Custom().addTo(map);

    // Load water area Geojson
		 $.getJSON('/static/data/MMR_water_polygon.geojson')
			.done(function (data, status) {

				if (status === 'success') {
					$scope.$apply();
				}
				var waterStyle = {
				    "fillColor": "#00008b",
				    "opacity": 0,
				    "fillOpacity": 1
				};
				$scope.waterPolygonGeojson = L.geoJson(data, {
					style: waterStyle,
					pane: 'waterLayer'
				}).addTo(map);
				//map.fitBounds($scope.waterPolygonGeojson.getBounds());
			});

			// Load water area Geojson
			 $.getJSON('/static/data/MMR_water_line.geojson')
				.done(function (data, status) {

					if (status === 'success') {
						$scope.$apply();
					}
					var waterStyle = {
					    "color": '#9999ff',
					    "opacity": 1,
							"weight": 1,
					};
					$scope.streamGeojson = L.geoJson(data, {
						style: waterStyle,
						pane: 'streamLayer'
					});
				});
        // Load Myanmar boundary Geojson
        geojsondata = L.geoJson(adm0,{
            style: style,
            onEachFeature: onEachCountry
          }).addTo(map);


    lwmsLayer = L.tileLayer.wms();

		rwmsLayer = L.tileLayer.wms();
    map.createPane('droughtwmsLayer');
		map.getPane('droughtwmsLayer').style.zIndex = 455;
    map.createPane('lwmsLayer');
		map.getPane('lwmsLayer').style.zIndex = 555;
    map.createPane('rwmsLayer');
		map.getPane('rwmsLayer').style.zIndex = 555;



    //////////////////////////////Regoin Boundary onclick event////////////////////////////////////
    // Set style function that sets fill color property
    function style(feature) {
        return {
            fillColor: '#000000',
            fillOpacity: 0,
            weight: 1,
            opacity: 1,
            color: '#000000'
        };
    }
    // Set style function that sets fill color property
    function style2(feature) {
        return {
            fillColor: 'gray',
            fillOpacity: 0.9,
            weight: 1,
            opacity: 1,
            color: '#ffffff'
        };
    }
  	var highlight = {
  		'fillColor': 'blue',
  		'weight': 2,
  		'opacity': 1,
      'color': '#dd614a',
      'fillOpacity': 0,
  	};




    function onEachCountry(feature, layer) {
      $("#selectedAreaText").text();
      layer.on("click", function (e) {
          geojsondata.setStyle(style2); //resets layer colors
          layer.setStyle(highlight);  //highlights selected.
          map.fitBounds(layer.getBounds());

          areaid0 = e.sourceTarget.feature.properties.ID_0;
          selectedArea = e.sourceTarget.feature.properties.NAME_0;
          if(type=="admin1") {
            areaid1 = e.sourceTarget.feature.properties.ID_1;
            selectedArea = e.sourceTarget.feature.properties.NAME_1;
            $("#selectedAreaText").text("Myanmar | " + selectedArea );
          }else if(type=="admin2"){
            areaid1 = e.sourceTarget.feature.properties.ID_2;
            selectedArea = e.sourceTarget.feature.properties.NAME_2;
          }

          $scope.getDroughtData();

      });
      layer.on('mouseover', function (e){
        $("#mouseover-feature").text(e.sourceTarget.feature.properties.NAME_0);
      });
      layer.on('mouseout', function (){
        $("#mouseover-feature").text("");
        this.setStyle(style); //resets layer colors
      });
    }

    $scope.getDateAvailable = function (type) {
      $scope.showLoader = true;
      $scope.$apply();
      var enableDatesArray = [];

        $('.legend-list ul li').html('');
        var selectedopt = $("#map-select-indices1 option:selected").val();

        for(var i=0; i<$scope.droughtLegend.length; i++){
          if($scope.droughtLegend[i].name === selectedopt){
            for(var j=0; j< $scope.droughtLegend[i].colors.length; j++){
              var item = {color: $scope.droughtLegend[i].colors[j], label: $scope.droughtLegend[i].label[j]};
              $scope.legend.push(item)
            }
          }
        }

      var dataset = $("#map-select-indices1 option:selected").val();
      var datePicker = $("#dp5");


      var parameters = {
        dataset: dataset,
      };
      MapService.get_date_list(parameters)
      .then(function (result){
        for(var i=0; i<result.length; i++){
          enableDatesArray.push(result[i]);
        }
        datePicker.datepicker("destroy");
        datePicker.datepicker({
          beforeShowDay: function (date) {
                    var mm = date.getMonth() + 1;
                    var dd = date.getDate();
                    if((date.getMonth() + 1) < 10){
                      mm = '0'+ (date.getMonth() + 1);
                    }
                    if (date.getDate() < 10) {
                      dd = '0'+ date.getDate();
                    }
    				        var dt_ddmmyyyy = date.getFullYear() + '-' + mm + '-' + dd ;
    				        if (enableDatesArray.indexOf(dt_ddmmyyyy) !== -1) {
    				            return {
    				                tooltip: 'There is data available',
    				                classes: 'active2'
    				            };
    				        } else {
    				            return false;
    				        }
    				    }
        });
          $('#hide-calendar').css("display", "block");
          datePicker.datepicker("setDate", enableDatesArray[enableDatesArray.length - 1]);

      }), function (error){
        console.log(error);
      };
    };

  // function to add and update tile layer to map
		function addMapLayer(layer,url, pane){
			layer = L.tileLayer(url,{
				attribution: '<a href="https://earthengine.google.com" target="_">' +
				'Google Earth Engine</a>;',
			 	pane: pane}).addTo(map);
				return layer;
		}

    $scope.getData = function (dataset, chartid) {
      //line chart data
      var minArr = [];
      var maxArr = [];
      var averageArr = [];
      var categoriesArr = [];
      //area chart data
      var areaChartData = [];

      var periodicity = $("#select-periodicity option:selected").val();
      var date = $('#dp5').datepicker('getFormattedDate');
      var parameters = {
        dataset: dataset,
        type: type,
        date: date,
        areaid0: areaid0,
        areaid1: areaid1,
        periodicity: periodicity
      };
      MapService.get_mekong_data(parameters)
      .then(function (result){
        for(var i=0; i<result.length; i++){
          categoriesArr.push(result[i]['date']);
          minArr.push(result[i]['min']);
          maxArr.push(result[i]['max']);
          averageArr.push(result[i]['average']);
          areaChartData.push([result[i]['date'], result[i]['min'], result[i]['max']])
        }
        //genChart(categoriesArr, minArr, maxArr, averageArr, dataset, chartid);
        var areachartid =  'area-'+chartid;
        genAreaChart(categoriesArr, areaChartData, averageArr, areachartid);
        $scope.showLoader = false;
      }), function (error){
        console.log(error);
        $("#chart-description-c2").text("No time series data available. Please try again!")
      };
    };

    $scope.getDroughtData = function () {
      var dataset = $("#map-select-indices1 option:selected").val();
      var datasetTxt = $("#map-select-indices1 option:selected").text();
      var period = $("#select-periodicity option:selected").text();
      $scope.getData(dataset, 'container');
      //$("#chart-description-c1").text("This line chart shows Min, Max, Mean values of "+datasetTxt+ " in "+ selectedArea +" | Periodicity: "+ period);
      $("#chart-description-c2").text("An area chart compares Min and Max values of nowcast and forecasted data of "+datasetTxt+ " in "+ selectedArea +" | Periodicity: "+ period);
    };


    $scope.showWMSLayer = function(selected_date) {
      var selectedopt = $("#map-select-indices1 option:selected").val();
      var parameters = {
        dataset: selectedopt,
        date: selected_date,
      };
      MapService.get_map_id(parameters)
      .then(function (result){
        if(map.hasLayer(wmsLayer)){
          map.removeLayer(wmsLayer);
        }
        wmsLayer = addMapLayer(wmsLayer, result.eeMapURL, 'droughtwmsLayer');
        $scope.showLoader = false;

      }), function (error){
        console.log(error);
      };

    };
    $scope.downloadRaster = function(){
      var selectedopt = $("#map-select-indices1 option:selected").val();
      var selected_date = $('#dp5').datepicker('getFormattedDate');
      selectedopt = selectedopt.split("-")[1];
      var sensortype = $("#map-select-indices1 option:selected").val().split("-")[0];
      console.log(sensortype);
      var DownloadURL = '';
      if(sensortype === 'sb'){
        selected_date = selected_date.replace('-', '_');
        selected_date = selected_date.replace('-', '_');
        DownloadURL = $scope.downloadServerURL + '/rdcyis_outputs/eo_based/'+ selectedopt + '/myanmar/' +selectedopt+'_'+selected_date+'_myanmar.tif';
      }else{
        DownloadURL = $scope.downloadServerURL + '/rdcyis_outputs/rheas_based/'+ selectedopt + '/8day/' +selectedopt+'_8day_'+selected_date+'.tif';
      }

      var file_path = DownloadURL;
				var a = document.createElement('A');
				a.href = file_path;
				//a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
				document.body.appendChild(a);
				a.click()
				document.body.removeChild(a);

    }

    /**
     * Chart in Modal
     **/
    // displays chart in the modal
    $scope.showChart = function () {
      $("#chartModal").removeClass('hide');
      $("#chartModal").addClass('show');
    };
    $(".modal-close").click(function() {
      $("#chartModal").removeClass('show');
			$("#chartModal").addClass('hide');
		});


    /**
			* Change basemap layer(satellite, terrain, street)
			*/
			$('input[type=radio][name=basemap_selection]').change(function(){
				var selected_basemap = $(this).val();
				if(selected_basemap === "satellite"){
					basemapLayer.setUrl('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
					map.attributionControl.setPrefix('Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community');
				}else if(selected_basemap === "topo"){
					basemapLayer.setUrl('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}');
					map.attributionControl.setPrefix('Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, ' +
		            'Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community');
				}
			});

			/**
			* Toggle layer visualizing
			*/
			$('input[type=checkbox][name=inland_water_toggle]').click(function(){
				var waterStyle;
				if(this.checked) {
					waterStyle = {
					    "fillColor": "#00008b",
					    "opacity": 0,
					    "fillOpacity": 1
					};
				    $scope.waterPolygonGeojson.setStyle(waterStyle);
				} else {
					waterStyle = {
					    "fillColor": "#00008b",
					    "opacity": 0,
					    "fillOpacity": 0
					};
				    $scope.waterPolygonGeojson.setStyle(waterStyle);
				}
			});

			$('input[type=checkbox][name=stream_toggle]').click(function(){
				var waterStyle;
				if(this.checked) {
					if(!map.hasLayer($scope.streamGeojson)){
						$scope.streamGeojson.addTo(map);
					}

					waterStyle = {
					    "color": "#9999ff",
					    "opacity": 1,
					    "weight": 1
					};
				    $scope.streamGeojson.setStyle(waterStyle);
				} else {
					waterStyle = {
					    "fillColor": "#9999ff",
					    "opacity": 0,
					    "weight": 0
					};
				    $scope.streamGeojson.setStyle(waterStyle);
				}
			});

    $('#dp5').on('changeDate', function() {
        $scope.showLoader = true;
        var date = $('#dp5').datepicker('getFormattedDate');
        $scope.showWMSLayer(date);

        $scope.getDroughtData();

    });


    // A $( document ).ready() block.
    $( document ).ready(function() {

      $("#map-select-indices1 option[value=sb-vsdi]").attr('selected','selected');
      $("#select-periodicity option[value=3month]").attr('selected','selected');
        // $scope.getDroughtData();
        $scope.getDateAvailable(1);


    });

    $("#map-select-indices1").on('change', function(){
      $scope.getDroughtData();
    });


    $("#select-periodicity").on('change', function(){
      $scope.showLoader = true;
      $scope.$apply();
      $scope.getDroughtData();
    });

    $("#select-areaIndexSelectors").on('change', function(){
      var selectedopt = $("#select-areaIndexSelectors option:selected").val();
      if(map.hasLayer(geojsondata)){
        map.removeLayer(geojsondata);
      }

      if(selectedopt === 'country'){
        type='country';
        geojsondata = L.geoJson(adm0,{
            style: style,
            onEachFeature: onEachCountry,
            pane: 'admin'
          }).addTo(map);
      }else if(selectedopt === 'admin1'){
        type='admin1';
        geojsondata = L.geoJson(adm1,{
            style: style,
            onEachFeature: onEachCountry,
            pane: 'admin'
          }).addTo(map);
      }else{
        type='admin2';
        geojsondata = L.geoJson(adm2,{
            style: style,
            onEachFeature: onEachCountry,
            pane: 'admin'
          }).addTo(map);
      }
      // map.fitBounds(geojsondata.getBounds());
    });

    $("#map-select-indices1").on('change', function(){
      $scope.showLoader = true;
      $scope.getDateAvailable(1);
    });


    $("#zoom-in").click(function() {
					map.zoomIn();
				});

		$("#zoom-out").click(function() {
			map.zoomOut();
		});


    var slider = document.getElementById("opacity-slider");
    var output = document.getElementById("opacity-value");
    output.innerHTML = slider.value/100;

    slider.oninput = function() {
      output.innerHTML = this.value/100;
      wmsLayer.setOpacity(this.value/100);
    }


function genChart(categoriesData, minData, maxData, averageData, dataset, chartid){
  Highcharts.chart(chartid, {
    chart: {
        type: 'line',
        style: {
            fontFamily: 'Montserrat'
        },
        height: 400,
    },
    title: {
        text: ''
    },
    legend: {
      enabled: false,
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        x: 150,
        y: 50,
        floating: true,
        borderWidth: 1,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
    },
    xAxis: {
        categories: categoriesData,
        // plotBands: [{ // visualize the weekend
        //     from: 4.5,
        //     to: 6.5,
        //     color: 'rgba(68, 170, 213, .2)'
        // }]
    },
    yAxis: {
        title: {
            text: 'Index Value'
        }
    },
    tooltip: {
        shared: true,
        valueSuffix: ' '
    },
    credits: {
        enabled: false
    },
    plotOptions: {
        areaspline: {
            fillOpacity: 0.5
        }
    },
    series: [{
        name: 'Min',
        data: minData,
        color: '#ffdc7c'
    }, {
        name: 'Average',
        data: averageData,
        color: '#85a3c3'
    }, {
        name: 'Max',
        data: maxData,
        color: '#dd614a'
    }]
  });
}


function genAreaChart(categoriesData, data1, average, chartid){
  Highcharts.chart(chartid, {
          chart: {
              type: 'arearange',
              style: {
                  fontFamily: 'Montserrat'
              },
              height: 400,
          },

          title: {
              text: ''
          },

          xAxis: {
              categories: categoriesData,
              // plotBands: [{ // visualize the weekend
              //     from: 4.5,
              //     to: 6.5,
              //     color: 'rgba(68, 170, 213, .2)'
              // }]
          },
          yAxis: {
              title: {
                  text: 'Index Value'
              }
          },

          tooltip: {
              shared: true,
              valueSuffix: ' | ',

          },
          credits: {
              enabled: false
          },

          series: [{
              name: 'Min and Max',
              data: data1,
              color: '#85a3c3',
              fillOpacity: 0.1
          },
          {
              name: 'Average',
              type: 'spline',
              data: average,
              color: '#dd614a',
              fillOpacity: 0.1
          },
        ]
  });

}

    $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip();
      $("#header-logo").removeClass("container");
      $("#header-logo").addClass("container-fluid");
      $("#header-menu").removeClass("container");
      $("#header-menu").addClass("container-fluid");
    });



    $("#zoom-in").click(function() {
			map.zoomIn();
		});
		$("#zoom-out").click(function() {
			map.zoomOut();
		});
		$("#time-toggle").click(function() {
			if($scope.showTimeSlider){
				$scope.showTimeSlider = false;
				$scope.$apply();
			}else{
				$scope.showTimeSlider = true;
				$scope.$apply();
			}
		});
		$("#legend-toggle").click(function() {
			if($scope.showLegend){
				$scope.showLegend = false;
				$scope.$apply();
			}else{
				$scope.showLegend = true;
				$scope.$apply();
			}
		});
		$("#upload-file").click(function() {
			$("input[type='file']").click();
		});
		$("#draw-tool").click(function() {
			$("#drawing-modal").removeClass('hide');
			$("#drawing-modal").addClass('show');
		});
		$("#draw-polygon").click(function() {
			$(".modal-close").click();
			new L.Draw.Polygon(map, drawControl.options.draw.polygon).enable();
		});
		$("#draw-rectangle").click(function() {
			$(".modal-close").click();
			new L.Draw.Rectangle(map).enable();
		});
		$("#draw-clear").click(function() {
			$(".modal-close").click();
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
			//map.removeLayer($scope.editableLayers);
			$scope.showOpacitySlider = false;
			$scope.$apply();
		});
		$(".modal-close").click(function() {
			$("#chartModal").addClass('hide');
			$("#drawing-modal").removeClass('show');
			$("#drawing-modal").addClass('hide');
		});

		$('#toggle_drought').click(function(){
			$('#toggle_disclaimer_box').css("display", "none");
			$('#toggle_disclaimer').removeClass("active");
			if($('#toggle_drought_box').css("display") === "none"){
				$('#toggle_drought_box').css("display", "block");
				$(this).addClass("active");
			}else{
				$('#toggle_drought_box').css("display", "none");
				$(this).removeClass("active");
			}

		});
		$('#toggle_disclaimer').click(function(){
			$("#disclaimerModal").removeClass('modal hide');
			$("#disclaimerModal").addClass('modal show');

		});
		if($("select[name='variable-filter']").val() === null){
			$("#btn-update-map").attr("disabled", true);
			$("#btn-show-chart").attr("disabled", true);
		}

		$("select[name='index-filter']").change(function() {
			$("#btn-update-map").attr("disabled", true);
			$("#btn-show-chart").attr("disabled", true);
			$scope.showDownloadButton = false;
			$scope.$apply();
		});

		$("select[name='variable-filter']").change(function() {
			if($("select[name='variable-filter']").val() !== null){
				$("#btn-update-map").attr("disabled", false);
				$("#btn-show-chart").attr("disabled", false);
			}
		});
		$("#application_name").click(function() {
			$("#supporterModal").removeClass('modal hide');
			$("#supporterModal").addClass('modal show');
		});

		$(".modal-background").click(function() {
			$(".modal").removeClass('show');
			$(".modal").addClass('hide');
		});

		$('#caret-area').click(function(){
			if($('#content-area').hasClass("closed")){
				$('#caret-area span').text('▼');
			}else{
				$('#caret-area span').text('▲');
			}
			$('#content-area').toggleClass("closed");


		});

		$('#caret-dataset').click(function(){
			if($('#content-dataset').hasClass("closed")){
				$('#caret-dataset span').text('▼');
			}else{
				$('#caret-dataset span').text('▲');
			}
			$('#content-dataset').toggleClass("closed");
		});

  });
})();
