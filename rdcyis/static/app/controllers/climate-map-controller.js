(function () {

  'use strict';
  angular.module('mekongDroughtandCropWatch')
  .controller('ClimateMapController', function ($http, $rootScope, $scope, $sanitize, $timeout, appSettings, MapService) {
    $scope.climateAbsoluteVariables = appSettings.climateAbsoluteVariables;
    $scope.climateChangeVariables = appSettings.climateChangeVariables;
    $scope.periodicity = appSettings.periodicity;
    $scope.areaIndexSelectors = appSettings.areaIndexSelectors;
    $scope.climateScenarios = appSettings.climateAbsoluteScenarios;
    $scope.climatePeriod = appSettings.climateHistoricalPeriod;
    $scope.downloadServerURL = appSettings.downloadServerURL;
    $scope.legendsSB = appSettings.legendsSB;
    $scope.climateAbsoluteLegend = appSettings.climateAbsoluteLegend;
    $scope.climateChangeLegend = appSettings.climateChangeLegend;
    $scope.climateStoreName = appSettings.climateStoreName;
    $scope.legend = [];
    $scope.left_legend = [];
    $scope.right_legend = [];
    $scope.showLoader = false;

    $scope.showClimateAbsoluteSelect = true;
    $scope.showClimateChangeSelect = false;

    var geojsondata, geojsonClipedBasin, selectedFeature, wmsLayer, selectedAreaLevel;
    var selected_climateCase;
    var areaid0 = '';
    var areaid1 = '';
    var type = 'mekong_country';
    var selectedArea = 'Mekong region';
    var $modalCompare = $("#compare-modal");
    var lwmsLayer;
    var rwmsLayer;
    var compare;
    var geojsonCountry,geojsonAdm1OutBBox, geojsonADM0, geojsonADM2, geojsonAdm2OutBBox, adm0FeatureClicked, selectedADM1Feature;

    var map = L.map('map').setView([18.055, 100.09], 5);
    // Base Layers
    var basemapLayer = L.tileLayer('https://api.mapbox.com/styles/v1/servirmekong/ckduef35613el19qlsoug6u2h/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2VydmlybWVrb25nIiwiYSI6ImNrYWMzenhldDFvNG4yeXBtam1xMTVseGoifQ.Wr-FBcvcircZ0qyItQTq9g', {
    	maxZoom: 20,
    	attribution: ''
    }).addTo(map);
    map.removeControl(map.zoomControl);

    lwmsLayer = L.tileLayer.wms();

		rwmsLayer = L.tileLayer.wms();

		map.createPane('admin');
    map.createPane('maskedout');
		map.createPane('droughtwmsLayer');
		map.getPane('admin').style.zIndex = 660;
    map.getPane('maskedout').style.zIndex = 659;
		map.getPane('droughtwmsLayer').style.zIndex = 560;
    map.createPane('lwmsLayer');
		map.getPane('lwmsLayer').style.zIndex = 655;
    map.createPane('rwmsLayer');
		map.getPane('rwmsLayer').style.zIndex = 655;

    var polygonstyle = {
      fillColor: "#FFF",
      weight: 0.5,
      opacity: 1,
      color: '#6c757d',
      fillOpacity: 0
    }

    var waterstyle = {
      fillColor: "#00008b",
      weight: 0.5,
      opacity: 1,
      color: '#00008b',
      fillOpacity: 1
    }

    var outBBoxstyle = {
      fillColor: "#fafafa",
      weight: 2,
      opacity: 1,
      color: '#fafafa',
      fillOpacity: 0.7
    }

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
            fillOpacity: 0.5,
            weight: 1,
            opacity: 1,
            color: '#ffffff'
        };
    }
    // highlight polygon style
  	var highlight = {
  		'fillColor': 'blue',
  		'weight': 2,
  		'opacity': 1,
      'color': '#dd614a',
      'fillOpacity': 0,
  	};
    //////////////////////////////Regoin Boundary onclick event////////////////////////////////////
    function geojsonFilter(feature) {
      if (feature.properties.NAME_0 === selectedFeature) return true
    }
    function geojsonFilterAdm1OutBBox(feature) {
      if (feature.properties.NAME_0 !== selectedFeature) return true
    }
    function whenClicked(e) {
      $("#map-nav").css("display", "block");
      adm0FeatureClicked = e;
      selectedFeature = e.sourceTarget.feature.properties.NAME_0;
      areaid0 = e.sourceTarget.feature.properties.ID_0;
      // /compares Min and Max values of nowcast and forecasted data of SB: VSDI: Visible and Shortwave infrared Drought Index in Mekong region | Periodicity: 1 Year
      $("#chart-climate").text("The line chart compares Min and Max values of  "+selected_variable+ " in different time period in "+ selectedFeature)
      $scope.getData('chart-climate-container', 'country');

      map.removeLayer(geojsonADM0);
      if(map.hasLayer(geojsonCountry)){
        map.removeLayer(geojsonCountry);
      }
      geojsonAdm1OutBBox = L.geoJson(adm1,{
        style: outBBoxstyle,
        filter: geojsonFilterAdm1OutBBox
      }).addTo(map);

      geojsonCountry = L.geoJson(adm1,{
        style: polygonstyle,
        filter: geojsonFilter,
        onEachFeature: onEachADM1
      }).addTo(map);
      map.fitBounds(geojsonCountry.getBounds());
    }

    //////////////////////////////Country Boundary onclick event////////////////////////////////////
    function geojsonADM1Filter(feature) {
      if (feature.properties.NAME_1 === selectedADM1Feature) return true
    }
    function geojsonADM1FilterOutBBox(feature) {
      if (feature.properties.NAME_1 !== selectedADM1Feature) return true
    }

    function whenADM1Clicked(e) {
      selectedADM1Feature = e.sourceTarget.feature.properties.NAME_1;
      $("#chart-climate").text(selectedADM1Feature)
      areaid1 = e.sourceTarget.feature.properties.ID_1;
      $("#chart-climate").text("The line chart compares Min and Max values of  "+selected_variable+ " in different time period in "+ selectedFeature + "/ " +selectedADM1Feature)
      $scope.getData('chart-climate-container', 'province');
      map.removeLayer(geojsonCountry);
      if(map.hasLayer(geojsonADM2)){
        map.removeLayer(geojsonADM2);
      }
      geojsonAdm2OutBBox = L.geoJson(adm2,{
        style: outBBoxstyle,
        filter: geojsonADM1FilterOutBBox
      }).addTo(map);

      geojsonADM2 = L.geoJson(adm2,{
        style: polygonstyle,
        filter: geojsonADM1Filter
      }).addTo(map);

      map.fitBounds(geojsonADM2.getBounds());
    }

    function onEachADM1(feature, layer) {
      layer.on({
        click: whenADM1Clicked
      });
      layer.on('mouseover', function (e){
        $("#mouseover-feature").text(e.sourceTarget.feature.properties.NAME_0+" | "+e.sourceTarget.feature.properties.NAME_1);
        this.setStyle({
          'color': '#333',
          'weight': 1,
          'opacity': 1,
          'fillColor': '#0000ff',
          'fillOpacity': 0.3
        });
      });
      layer.on('mouseout', function (){
        $("#mouseover-feature").text("");
        this.setStyle({
          'fillColor': "#FFF",
          'weight': 0.5,
          'opacity': 1,
          'color': '#6c757d',
          'fillOpacity': 0
        });
      });
    }

    function onEachCountry(feature, layer) {
      layer.on({
        click: whenClicked
      });
      layer.on('mouseover', function (e){
        $("#mouseover-feature").text(e.sourceTarget.feature.properties.NAME_0);
        this.setStyle({
          'color': '#333',
          'weight': 1,
          'opacity': 1,
          'fillColor': '#0000ff',
          'fillOpacity': 0.3
        });
      });
      layer.on('mouseout', function (){
        $("#mouseover-feature").text("");
        this.setStyle({
          'fillColor': "#FFF",
          'weight': 0.5,
          'opacity': 1,
          'color': '#6c757d',
          'fillOpacity': 0
        });
      });
  }
  function onEachADM1(feature, layer) {
    layer.on({
      click: whenADM1Clicked
    });
    layer.on('mouseover', function (e){
      $("#mouseover-feature").text(e.sourceTarget.feature.properties.NAME_0+" | "+e.sourceTarget.feature.properties.NAME_1);
      this.setStyle({
        'color': '#333',
        'weight': 1,
        'opacity': 1,
        'fillColor': '#0000ff',
        'fillOpacity': 0.3
      });
    });
    layer.on('mouseout', function (){
      $("#mouseover-feature").text("");
      this.setStyle({
        'fillColor': "#FFF",
        'weight': 0.5,
        'opacity': 1,
        'color': '#6c757d',
        'fillOpacity': 0
      });
    });
  }




    var clearChartArea = function(){
      $("#chart-climate").text("Please select an area on the map to generate a line chart");
      $("#chart-climate-container").text("");
    }

    $scope.clearBoundaryMap = function(){
      if(map.hasLayer(geojsonCountry)){
        map.removeLayer(geojsonCountry);
      }
      if(map.hasLayer(geojsonADM2)){
        map.removeLayer(geojsonADM2);
      }
      if(map.hasLayer(geojsonAdm1OutBBox)){
        map.removeLayer(geojsonAdm1OutBBox);
      }
      if(map.hasLayer(geojsonAdm2OutBBox)){
        map.removeLayer(geojsonAdm2OutBBox);
      }
      geojsonADM0 = L.geoJson(adm0,{
        style: polygonstyle,
        onEachFeature: onEachCountry
      }).addTo(map);
      map.fitBounds(geojsonADM0.getBounds());
    }

    $scope.getData = function (chartid, type) {


      if(climate_type === 'change'){
        if(selected_variable === 'spei-change') {
          var dataset = 'chg_prob_div_num_drought_drysea_spei6';
        }else if(selected_variable === 'spi-change'){
          var dataset = 'chg_prob_div_num_drought_drysea_spi6';
        }else{
          var dataset = selected_climateCase.split("_");
          dataset = dataset[0]+"_"+dataset[1]+"_"+dataset[2]+"_"+dataset[3];
        }
      }else{
        if(selected_variable === 'spei-absolute') {
          var dataset = 'prob_div_num_drought_drysea_spei6';
        }else if(selected_variable === 'spi-absolute'){
          var dataset = 'prob_div_num_drought_drysea_spi6';
        }else{
          var dataset = selected_climateCase.split("_")[0];
        }
      }

      if(type == "mekong"){
        var parameters = {
          type: type,
          img_id: dataset,
          climate_scenarios: climate_scenarios,
          climate_type:climate_type
        };
      }
      else if(type === "country"){
        var parameters = {
          type: type,
          areaid0: areaid0,
          img_id: dataset,
          climate_scenarios: climate_scenarios,
          climate_type:climate_type
        };
      }else{
        var parameters = {
          type: type,
          areaid0: areaid0,
          areaid1: areaid1,
          img_id: dataset,
          climate_scenarios:climate_scenarios,
          climate_type:climate_type
        };
      }
      var minArr = [];
      var maxArr = [];
      var averageArr = [];
      var categoriesArr = ['Historical','2030s', '2050s' , '2080s'];
      var areaChartData = [];
      MapService.get_climate_data(parameters)
      .then(function (result){
        for(var i=0; i<result.length; i++){
          minArr.push(result[i]['min']);
          maxArr.push(result[i]['max']);
          averageArr.push(result[i]['mean']);
          areaChartData.push([areaChartData[i], result[i]['min'], result[i]['max']])
        }
        //genChart(categoriesArr, minArr, maxArr, averageArr, dataset, chartid);
        var areachartid =  chartid;
        console.log(result)
        genAreaChart(categoriesArr, areaChartData, averageArr, areachartid);
      }), function (error){
        console.log(error);
      };
    };


    $scope.getAbsoluteLegend = function () {
        $('.legend-list ul li').html('');
        var selectedopt = $("#map-climate-absolute option:selected").val();
        for(var i=0; i< $scope.climateAbsoluteLegend.length; i++){
          if($scope.climateAbsoluteLegend[i].name === selectedopt){
            for(var j=0; j< $scope.climateAbsoluteLegend[i].colors.length; j++){
              var item = {color: $scope.climateAbsoluteLegend[i].colors[j], label: $scope.climateAbsoluteLegend[i].labels[j]};
              $scope.legend.push(item)
            }
          }
        }
        $scope.$apply()
    };
    $scope.getChangeLegend = function () {
        $('.legend-list ul li').html('');
        var selectedopt = $("#map-climate-change option:selected").val();
        console.log(selectedopt)
        for(var i=0; i< $scope.climateChangeLegend.length; i++){
          console.log(selectedopt, $scope.climateChangeLegend[i].name)
          if($scope.climateChangeLegend[i].name === selectedopt){
            console.log(selectedopt, $scope.climateChangeLegend[i].name)
            for(var j=0; j< $scope.climateChangeLegend[i].colors.length; j++){
              console.log($scope.climateChangeLegend[i].colors[j])
              var item = {color: $scope.climateChangeLegend[i].colors[j], label: $scope.climateChangeLegend[i].labels[j]};
              $scope.legend.push(item)
            }
          }
        }
        $scope.$apply()
    };

    var mapWMSLayer;
    $scope.getMapLayer = function(workspace, store_name, style) {
      if(map.hasLayer(mapWMSLayer)){
        map.removeLayer(mapWMSLayer);
      }
      selected_climateCase = store_name;
      mapWMSLayer = L.tileLayer.wms("https://geoserver.adpc.net/geoserver/"+workspace+"/wms", {
				        transparent: true,
								service:'WMS',
								version:'1.1.0',
								request:'GetMap',
								layers:workspace+':'+store_name,
								styles:style,
								srs:'EPSG:32647',
								format:'image/png',
				    });
						map.addLayer(mapWMSLayer);
    }

    var selected_variable= 'cdd-absolute';
    var geoserver_workspace = 'rdcyis-climate-absolute';
    var climate_scenarios;

    $scope.parameterChange = function(){
      var scenarios = $("#map-climate-scenarios option:selected").val();
      var period = $("#map-climate-period option:selected").val();
      var store_name = $scope.climateStoreName[selected_variable][scenarios][period];
      var style = $scope.climateStoreName[selected_variable]['style'];
      climate_scenarios = scenarios;
      if(climate_type === 'absolute'){
        $scope.getAbsoluteLegend();
      }else{
        $scope.getChangeLegend();
      }

      $scope.getMapLayer(geoserver_workspace, store_name, style);
    };

    var climate_type = 'absolute';

    $("#map-climate-absolute").on('change', function(){
      clearChartArea();
      geoserver_workspace = 'rdcyis-climate-absolute';
      climate_type= 'absolute';
      selected_variable = $("#map-climate-absolute option:selected").val();
      console.log(selected_variable)
      $scope.parameterChange();
    });

    $("#map-climate-change").on('change', function(){
      clearChartArea();
      geoserver_workspace = 'rdcyis-climate-change';
      climate_type= 'change';
      selected_variable = $("#map-climate-change option:selected").val();
      console.log(selected_variable)
      $scope.parameterChange();
    });

    $("#map-climate-scenarios").on('change', function(){
      clearChartArea();
      var scenarios = $("#map-climate-scenarios option:selected").val();
      if(scenarios === 'his'){
        $scope.climatePeriod = appSettings.climateHistoricalPeriod;
      }else{
        $scope.climatePeriod = appSettings.climateRCPPeriod;
      }
      $scope.$apply();
      $scope.parameterChange();
    });
    $("#map-climate-period").on('change', function(){
      clearChartArea();
      $scope.parameterChange();
    });

    //$scope.parameterChange();


  // function to add and update tile layer to map
		function addMapLayer(layer,url, pane){
			layer = L.tileLayer(url,{
				attribution: '<a href="https://earthengine.google.com" target="_">' +
				'Google Earth Engine</a>;',
			 	pane: pane}).addTo(map);
				return layer;
		}


    $scope.downloadRaster = function(){
      var DownloadURL = '';
      //ftp://203.146.112.247/rdcyis_outputs/climate_studies/absolute/
      if(climate_type ==='absolute'){
        DownloadURL = $scope.downloadServerURL + '/rdcyis_outputs/climate_studies/absolute/'+ selected_climateCase +'.tif';
      }else{
        DownloadURL = $scope.downloadServerURL + '/rdcyis_outputs/climate_studies/change/'+ selected_climateCase +'.tif';
      }

      var file_path = DownloadURL;
				var a = document.createElement('A');
				a.href = file_path;
				//a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
				document.body.appendChild(a);
				a.click()
				document.body.removeChild(a);

    }

    $("#download-btn").click(function(){
      $scope.downloadRaster();
    });

    $("#legend-btn").click(function(){
      $('.legend-panel').toggleClass("hide");
    });

    $("#layers-btn").click(function(){
      $(".layer-control").toggleClass("hide");
    });

    /**
		* Change basemap layer(satellite, terrain, street)
		*/
		$('input[type=radio][name=basemap_selection]').change(function(){
			var selected_basemap = $(this).val();
			if(selected_basemap === "satellite-v9"){
        basemapLayer.setUrl('https://api.mapbox.com/styles/v1/servirmekong/ckecozln92fkk19mjhuoqxhuw/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2VydmlybWVrb25nIiwiYSI6ImNrYWMzenhldDFvNG4yeXBtam1xMTVseGoifQ.Wr-FBcvcircZ0qyItQTq9g');
			}else if(selected_basemap === "dark-v10"){
				basemapLayer.setUrl('https://api.mapbox.com/styles/v1/servirmekong/ckecoool62f6n19r9jrf3ldtd/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2VydmlybWVrb25nIiwiYSI6ImNrYWMzenhldDFvNG4yeXBtam1xMTVseGoifQ.Wr-FBcvcircZ0qyItQTq9g');
			}else if(selected_basemap === "light-v10"){
				basemapLayer.setUrl('https://api.mapbox.com/styles/v1/servirmekong/ckduef35613el19qlsoug6u2h/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2VydmlybWVrb25nIiwiYSI6ImNrYWMzenhldDFvNG4yeXBtam1xMTVseGoifQ.Wr-FBcvcircZ0qyItQTq9g');

			}

		});



    // A $( document ).ready() block.
    $( document ).ready(function() {
      $scope.getAbsoluteLegend();
      $scope.parameterChange();

    });




    $("#switch-climate-absolute").click(function() {
      clearChartArea();
      if($(this).hasClass('active')){
        $scope.showClimateAbsoluteSelect = true;
        $scope.showClimateChangeSelect = false;
        $scope.climateScenarios = appSettings.climateAbsoluteScenarios;
        $scope.$apply();
      }else{
        $(this).addClass('active');
        $scope.showClimateAbsoluteSelect = true;
        $scope.showClimateChangeSelect = false;
        $scope.climateScenarios = appSettings.climateAbsoluteScenarios;
        $scope.climatePeriod = appSettings.climateHistoricalPeriod;
        $scope.$apply();
        $("#switch-climate-change").removeClass('active');
        $scope.getAbsoluteLegend();
        $('#map-climate-absolute').trigger('change');
      }
    });

    $("#switch-climate-change").click(function() {
      clearChartArea();

      if($(this).hasClass('active')){
        $scope.showClimateChangeSelect = true;
        $scope.showClimateAbsoluteSelect = false;
        $scope.climateScenarios = appSettings.climateChangeScenarios;
        $scope.$apply();
      }else{
        $(this).addClass('active');
        console.log('active -change')
        $scope.showClimateChangeSelect = true;
        $scope.showClimateAbsoluteSelect = false;
        $scope.climateScenarios = appSettings.climateChangeScenarios;
        $scope.climatePeriod = appSettings.climateRCPPeriod;
        $scope.$apply();
        $("#switch-climate-absolute").removeClass('active');
        $scope.getChangeLegend();
        $('#map-climate-change').trigger('change');
      }
    });

    $("#zoom-in").click(function() {
					map.zoomIn();
				});

		$("#zoom-out").click(function() {
			map.zoomOut();
		});

    $('#hide-menu').click(function() {
      $("#menu-left").css("top", "-50px");
      $("#menu-left").css("height", "0px");
      $('#hide-menu').css("top", "-20px");
    });
    $('#show-menu').click(function() {
      $("#menu-left").css("top", "0");
      $("#menu-left").css("height", "100px");
      $('#hide-menu').css("top", "100px");
    });

    $('#hide-calendar').click(function() {
      $(".date-picker").css("display", "none");
      $('#hide-calendar').css("left", "-20px");
    });
    $('#show-calendar').click(function() {
      $(".date-picker").css("display", "block");
      $('#hide-calendar').css("left", "220px");
    });

    $("#compare-layers").click(function() {
			if($modalCompare.modal('hide')){
				if(map.hasLayer(lwmsLayer)){
					$modalCompare.modal('hide');
					map.removeControl(compare);
					map.removeLayer(lwmsLayer);
					map.removeLayer(rwmsLayer);
					wmsLayer.addTo(map);
          $('.legend-panel').removeClass("hide");
          $("#show-menu").click();
          $("#show-calendar").click();
          $("#left-legend").addClass("hide");
          $("#right-legend").addClass("hide");
          $(".left-map-desc").addClass("hide");
          $(".right-map-desc").addClass("hide");

				}else{
					$modalCompare.modal('show');
				}
			}
		});

    var slider = document.getElementById("opacity-slider");
    var output = document.getElementById("opacity-value");
    output.innerHTML = slider.value/100;

    slider.oninput = function() {
      output.innerHTML = this.value/100;
      mapWMSLayer.setOpacity(this.value/100);
    }



    /**
		* layers comparing function
		*/
		var add_compare = function(){

      $('.legend-panel').addClass("hide");
      $("#hide-menu").click();
      $("#hide-calendar").click();
			$modalCompare.modal('hide');
      $scope.showLoader = true;
			var lindicator =  ($("#map-left-indices option:selected").val());
			var rindicator =  ($("#map-right-indices option:selected").val());
      var lindicator_text =  ($("#map-left-indices option:selected").text());
			var rindicator_text =  ($("#map-right-indices option:selected").text());
      $("#left-variable").text(lindicator_text);
      $("#right-variable").text(rindicator_text);

      $('#right-legend ul li').html('');
      $('#left-legend ul li').html('');
      for(var i=0; i<$scope.droughtLegend.length; i++){
        if($scope.droughtLegend[i].name === lindicator){
          for(var j=0; j< $scope.droughtLegend[i].colors.length; j++){
            var item = {color: $scope.droughtLegend[i].colors[j], label: $scope.droughtLegend[i].label[j]};
            $scope.left_legend.push(item)
          }
        }
        if($scope.droughtLegend[i].name === rindicator){
          for(var j=0; j< $scope.droughtLegend[i].colors.length; j++){
            var item = {color: $scope.droughtLegend[i].colors[j], label: $scope.droughtLegend[i].label[j]};
            $scope.right_legend.push(item)
          }
        }
      }

			var l_date = $("#datepicker-left").val();
			var r_date = $("#datepicker-right").val();
      $("#left-date").text(l_date);
      $("#right-date").text(r_date);
      $("#left-legend").removeClass("hide");
      $("#right-legend").removeClass("hide");
      $(".left-map-desc").removeClass("hide");
      $(".right-map-desc").removeClass("hide");
      if(map.hasLayer(wmsLayer)){
        map.removeLayer(wmsLayer);
      }
      var llayer, lstyle, rlayer, rstyle;
      /////////////////////////left map/////////////////////////////////
      var lparameters = {
        dataset: lindicator,
        date: l_date,
      };
      MapService.get_map_id(lparameters)
      .then(function (result){
        if(map.hasLayer(lwmsLayer)){
          map.removeLayer(lwmsLayer);
        }
        lwmsLayer = addMapLayer(lwmsLayer, result.eeMapURL, 'lwmsLayer');

        /////////////////////////right map/////////////////////////////////
          var rparameters = {
            dataset: rindicator,
            date: r_date,
          };
          MapService.get_map_id(rparameters)
          .then(function (result){
            if(map.hasLayer(rwmsLayer)){
              map.removeLayer(rwmsLayer);
            }
            rwmsLayer = addMapLayer(rwmsLayer, result.eeMapURL, 'rwmsLayer');
            //$scope.showLoader = false;
            if(map.hasLayer(rwmsLayer) && map.hasLayer(lwmsLayer)){
              compare = L.control.sideBySide(lwmsLayer,rwmsLayer);
        			compare.addTo(map);
              $scope.showLoader = false;
            }

            }), function (error){
              console.log(error);
            };

        }), function (error){
          console.log(error);
        };

		};

		/**
		* open compare layers popup
		*/
		$("#btn-add-compare").on('click',add_compare);
		$("#btn-close-compare").on('click', function(){
			$modalCompare.modal('hide');
		})

function genChart(categoriesData, minData, maxData, averageData, dataset, chartid){
  Highcharts.chart(chartid, {
    chart: {
        type: 'line',
        style: {
            fontFamily: 'Questrial'
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
                  fontFamily: 'Roboto Condensed'
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
              valueSuffix: '',

          },
          credits: {
              enabled: false
          },

          series: [{
              name: 'Min and Max',
              data: data1,
              color: '#85a3c3',
              fillOpacity: 0.1,
              tooltip: {
                 formatter: function() {
                   return this.series.name + ': <b>'+  this.point.low + ' and ' + this.point.high +'</b><br/>'
                 }
               }
          },
          {
              name: 'Average',
              type: 'spline',
              data: average,
              color: '#dd614a',
              fillOpacity: 0.1,
              tooltip: {
                 formatter: function() {
                   return this.series.name + ': <b>'+ this.point.y+'</b><br/>'
                 }
               }
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

      geojsonADM0 = L.geoJson(adm0,{
        style: polygonstyle,
        onEachFeature: onEachCountry
      }).addTo(map);

      $("#chart-climate").text("The line chart compares Min and Max values of  "+selected_variable+ " in different time period in Mekong countries")

      $scope.getData('chart-climate-container', 'mekong');

    });

  });
})();
