(function () {

    'use strict';
    angular.module('mekongDroughtandCropWatch')
    .controller('CropMapController', function ($http, $rootScope, $scope, $sanitize, $timeout, appSettings, MapService) {
      $scope.showLoader = true;
  
      //Get Drought Summary content from Google Sheet
        $scope.cropListSummary = [];
        var parameters = {};
        MapService.getCropYield(parameters)
        .then(function (data) {
          $scope.cropListSummary = JSON.parse(data);
          $("#map-yield-date").text($scope.cropListSummary[0].Desc);
          $scope.showLoader = false;
        }, 
        function (error) {
        });
  
  
      $scope.downloadServerURL = appSettings.downloadServerURL;
      var selectedFeature = '';
      var selectedADM1Feature = '';
      var geojsonCountry_2, geojsonCountry_1, geojsonAdm1OutBBox_1, geojsonAdm1OutBBox_2, geojsonAdm2OutBBox_1, geojsonAdm2OutBBox_2, geojsonOutBBOX_1, geojsonADM0_1,geojsonOutBBOX_2, geojsonADM0_2;
      var geojsonADM2_2, geojsonADM2_1, adm0FeatureClicked, adm1FeatureClicked;
      var geojsonWater_1, geojsonWater_2, currentDateList, cropLayer, yieldLayer, outlookDateList;
      var selectedCurrentDate = ''
      var summaryCountryName = ['Cambodia','Laos','Myanmar','Thailand','Vietnam']

      var polygonstyle = {
        fillColor: "#FFF",
        weight: 0.5,
        opacity: 1,
        color: '#6c757d',
        fillOpacity: 0
      }
  
      var focusedPolygonstyle = {
        fillColor: "#FFF",
        weight: 2,
        opacity: 1,
        color: 'black',
        dashArray: '3',
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
        fillOpacity: 1
      }
  
      var map1 = L.map('map1').setView([51.505, -0.09], 13);
      L.tileLayer('https://api.mapbox.com/styles/v1/servirmekong/ckd8mk8ky0vbh1ipdns7ji9wz/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2VydmlybWVrb25nIiwiYSI6ImNrYWMzenhldDFvNG4yeXBtam1xMTVseGoifQ.Wr-FBcvcircZ0qyItQTq9g', {}).addTo(map1);
      //map1.removeControl(map1.zoomControl);
      map1.touchZoom.disable();
      //map1.dragging.disable();
      map1.doubleClickZoom.disable();
      map1.scrollWheelZoom.disable();
      map1.createPane('cropLayer');
      map1.getPane('cropLayer').style.zIndex = 300;

      map1.createPane('map1Label');
      map1.getPane('map1Label').style.zIndex = 900;

    

      /**
		* adding administrative boundaries
		*/
		// L.esri.dynamicMapLayer({
		// 	url: 'https://wwf-sight-maps.org/arcgis/rest/services/Global/Administrative_Boundaries_GADM/MapServer',
		// 	layers:[0,1],
		// 	opacity: 0.7,
		// 	zIndex:9999,
    //   pane: 'map1Label'
		// }).addTo(map1);

		// L.esri.tiledMapLayer({
		// 	url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer',
		// 	layers:[0],
		// 	opacity: 0.7,
		// 	zIndex:99999,
    //   pane: 'map1Label'
		// }).addTo(map1);


      var selected_province_json;
      function initMap1(){
        geojsonOutBBOX_1 = L.geoJson(outboundary,{
          style: outBBoxstyle
        }).addTo(map1);
  
        geojsonADM0_1 = L.geoJson(adm0,{
          style: polygonstyle,
          // onEachFeature: onEachGeojson,
        }).addTo(map1);
  
        geojsonWater_1 = L.geoJson(permanent_water,{
          style: waterstyle
        }).addTo(map1);

        $.getJSON('/static/data/crop_geojson/ninh_thuan_districts.geojson')
        .done(function (data, status) {
          selected_province_json = L.geoJson(data, {
            style: focusedPolygonstyle,
          }).addTo(map1);
          map1.fitBounds(selected_province_json.getBounds());
        });

      }
  
      // function to add and update tile layer to map
            function addMapLayer(layer,url, pane){
                layer = L.tileLayer(url,{
                    attribution: '<a href="https://earthengine.google.com" target="_">' +
                    'Google Earth Engine</a>;',
                     pane: pane}).addTo(map1);
                    return layer;
            }
  
        function addyieldLayer(layer,url, pane){
                layer = L.tileLayer(url,{
                    attribution: '<a href="https://earthengine.google.com" target="_">' +
                    'Google Earth Engine</a>;',
                     pane: pane}).addTo(map2);
                    return layer;
            }
  
        var parameters = {};

        MapService.get_current_date_crop(parameters)
        .then(function (result){
          currentDateList = result;
          $scope.cropLayer(0);
          var dateObj = new Date(currentDateList[0]);
  
          var _date = dateObj.toISOString().slice(0,10)
          selectedCurrentDate = _date.replace("-","_").replace("-","_");
          $("#map-updated-date").text(_date);
  
        }), function (error){
          console.log(error);
        };
      
      var province  = $('#area_selector').val();

      $scope.cropLayer = function(index) {
        if(map1.hasLayer(cropLayer)){
          map1.removeLayer(cropLayer);
        }
        var parameters = {
          date: currentDateList[index],
          province: province
        };
        MapService.get_crop_map_id(parameters)
        .then(function (result){
          cropLayer = addMapLayer(cropLayer, result.eeMapURL, 'cropLayer');
          $scope.showLoader = false;
  
        }), function (error){
          console.log(error);
        };
      };
  
  
      var map2 = L.map('map2').setView([51.505, -0.09], 13);
      L.tileLayer('https://api.mapbox.com/styles/v1/servirmekong/ckd8mk8ky0vbh1ipdns7ji9wz/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2VydmlybWVrb25nIiwiYSI6ImNrYWMzenhldDFvNG4yeXBtam1xMTVseGoifQ.Wr-FBcvcircZ0qyItQTq9g', {}).addTo(map2);
      //map2.removeControl(map2.zoomControl);
      map2.touchZoom.disable();
      //map2.dragging.disable();
      map2.doubleClickZoom.disable();
      map2.scrollWheelZoom.disable();
      map2.createPane('yieldLayer');
      map2.getPane('yieldLayer').style.zIndex = 300;
      map2.createPane('map2Label');
      map2.getPane('map2Label').style.zIndex = 999;
      
       /**
      * adding administrative boundaries
      */
      // L.esri.dynamicMapLayer({
      //   url: 'https://wwf-sight-maps.org/arcgis/rest/services/Global/Administrative_Boundaries_GADM/MapServer',
      //   layers:[0,1],
      //   opacity: 0.7,
      //   zIndex:9999,
      // }).addTo(map2);

      // L.esri.tiledMapLayer({
      //   url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer',
      //   layers:[0],
      //   opacity: 0.7,
      //   zIndex:9999,
      // }).addTo(map2);

      function getColor(d) {
        return d < 2000 ? '#FFFFD8' :
                d < 3000  ? '#FFFF9D' :
                d < 3500  ? '#E3F59B' :
                d < 4000  ? '#C6EB98' :
                d < 4500   ? '#AAE096' :
                d < 5000   ? '#8ED694' :
                d < 5500   ? '#71CC91' :
                d < 6000  ? '#55C28F' :
                d < 6500   ? '#00A388' :
                d < 7000   ? '#1CAD8A' :
                          '#00A388';
      }
      function style(feature) {
        return {
            fillColor: getColor(feature.properties.AVG_YIELD),
            weight: 1,
            opacity: 1,
            color: '#333',
            dashArray: '3',
            fillOpacity: 0.7
        };
      }
    
      var crop_yield_json = '';
      function initMap2(){

        var geojsonADM1 = L.geoJson(adm1,{
          style: polygonstyle,
        }).addTo(map2);
  
        geojsonWater_1 = L.geoJson(permanent_water,{
          style: waterstyle
        }).addTo(map2);


        $.getJSON('/static/data/crop_geojson/ninh_thuan_districts.geojson')
        .done(function (data, status) {

          crop_yield_json = L.geoJson(data, {
            style: style,
            onEachFeature: onEachcropyield
          }).addTo(map2);
          map2.fitBounds(crop_yield_json.getBounds());
        });
        

      }
  
      initMap1();
      initMap2();


  
      //////////////////////////////Regoin Boundary onclick event////////////////////////////////////
      function geojsonFilter(feature) {
  
        //toggle show/hide the summary content each of country
        for(var i=0; i<summaryCountryName.length; i++){
          if(summaryCountryName[i] === selectedFeature){
            document.getElementById(summaryCountryName[i]).classList.add("show-element");
          }else{
            document.getElementById(summaryCountryName[i]).classList.add("hide-element");
          }
        }
        if (feature.properties.NAME_0 === selectedFeature) return true
      }
      function geojsonFilterAdm1OutBBox(feature) {
        if (feature.properties.NAME_0 !== selectedFeature) return true
      }
  
      function whenClicked(e) {
        $("#map-nav").css("display", "block");
        adm0FeatureClicked = e;
        selectedFeature = e.sourceTarget.feature.properties.NAME_0;
        $("#country-map").text('> ' + selectedFeature);
        map2.removeLayer(geojsonADM0_2);
        map1.removeLayer(geojsonADM0_1);
        if(map2.hasLayer(geojsonCountry_2)){
          map2.removeLayer(geojsonCountry_2);
        }
        if(map1.hasLayer(geojsonCountry_1)){
          map1.removeLayer(geojsonCountry_1);
        }
        geojsonAdm1OutBBox_2 = L.geoJson(adm1,{
          style: outBBoxstyle,
          filter: geojsonFilterAdm1OutBBox
        }).addTo(map2);
  
        geojsonAdm1OutBBox_1 = L.geoJson(adm1,{
          style: outBBoxstyle,
          filter: geojsonFilterAdm1OutBBox
        }).addTo(map1);
  
        geojsonCountry_2 = L.geoJson(adm1,{
          style: polygonstyle,
          filter: geojsonFilter,
          onEachFeature: onEachADM1
        }).addTo(map2);
        geojsonCountry_1 = L.geoJson(adm1,{
          style: polygonstyle,
          filter: geojsonFilter,
          onEachFeature: onEachADM1
        }).addTo(map1);
        map2.fitBounds(geojsonCountry_2.getBounds());
        map1.fitBounds(geojsonCountry_1.getBounds());
      }

      function onEachcropyield(feature, layer) {
        var popupContent = "<table>"+
        "<tr>"+
          "<td>DISTRICT</td>"+
          "<td>"+feature.properties.DISTRICT+"</td>"+
        "</tr>"+
        "<tr>"+
          "<td>CROP</td>"+
          "<td>"+feature.properties.CROP+"</td>"+
        "</tr>"+
        "<tr>"+
          "<td>PLANTING</td>"+
          "<td>"+feature.properties.PLANTING+"</td>"+
        "</tr>"+
        "<tr>"+
          "<td>FIRST HARVEST</td>"+
          "<td>"+feature.properties.FIRST_HARV+"</td>"+
        "</tr>"+
        "<tr>"+
          "<td>LAST HARVEST</td>"+
          "<td>"+feature.properties.LAST_HARVE+"</td>"+
        "</tr>"+
        "<tr>"+
          "<td>MAX YIELD</td>"+
          "<td>"+feature.properties.MAX_YIELD+" kg/ha</td>"+
        "</tr>"+
        "<tr>"+
          "<td>MIN YIELD</td>"+
          "<td>"+feature.properties.MIN_YIELD+" kg/ha</td>"+
        "</tr>"+
        "<tr>"+
          "<td>AVG YIELD</td>"+
          "<td>"+feature.properties.AVG_YIELD+" kg/ha</td>"+
        "</tr>"+
        "<tr>"+
          "<td>STD YIELD</td>"+
          "<td>"+feature.properties.STD_YIELD+" kg/ha</td>"+
        "</tr>"+
        "</table>"
       // layer.bindPopup(popupContent);
       
        layer.on('mouseover', function (e){
          //open popup;
          var popup = L.popup()
					 .setLatLng(e.latlng) 
					 .setContent(popupContent)
					 .openOn(map2);

          // layer.openPopup();
          // console.log(arr_date_yield)
          this.setStyle({
            'color': '#333',
            'weight': 3,
            'opacity': 1,
            'fillOpacity': 0.3
          });
        });

        layer.on('mouseout', function (){
          map2.closePopup();
          $("#mouseover-feature").text("");
          this.setStyle({
            'weight': 1,
            'opacity': 1,
            'color': '#333',
            'fillOpacity': 0.5
          });
        });
    }
  
      //////////////////////////////End Regoin Boundary onclick event////////////////////////////////////
  
      //////////////////////////////Country Boundary onclick event////////////////////////////////////
      function geojsonADM1Filter(feature) {
        if (feature.properties.NAME_1 === selectedADM1Feature) return true
      }
      function geojsonADM1FilterOutBBox(feature) {
        if (feature.properties.NAME_1 !== selectedADM1Feature) return true
      }
  
      function whenADM1Clicked(e) {
        adm1FeatureClicked = e;
        selectedADM1Feature = e.sourceTarget.feature.properties.NAME_1;
        $("#province-map").text('> ' + selectedADM1Feature);
        map2.removeLayer(geojsonCountry_2);
        if(map2.hasLayer(geojsonADM2_2)){
          map2.removeLayer(geojsonADM2_2);
        }
        map1.removeLayer(geojsonCountry_1);
        if(map1.hasLayer(geojsonADM2_1)){
          map1.removeLayer(geojsonADM2_1);
        }
        geojsonAdm2OutBBox_2 = L.geoJson(adm2,{
          style: outBBoxstyle,
          filter: geojsonADM1FilterOutBBox
        }).addTo(map2);
  
        geojsonAdm2OutBBox_1 = L.geoJson(adm2,{
          style: outBBoxstyle,
          filter: geojsonADM1FilterOutBBox
        }).addTo(map1);
  
        geojsonADM2_2 = L.geoJson(adm2,{
          style: polygonstyle,
          filter: geojsonADM1Filter
        }).addTo(map2);
        geojsonADM2_1 = L.geoJson(adm2,{
          style: polygonstyle,
          filter: geojsonADM1Filter
        }).addTo(map1);
        map2.fitBounds(geojsonADM2_2.getBounds());
        map1.fitBounds(geojsonADM2_1.getBounds());
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
      //////////////////////////////End Country Boundary onclick event////////////////////////////////////
  
      function resetMap(){
        if(map2.hasLayer(geojsonCountry_2)){
          map2.removeLayer(geojsonCountry_2);
          map1.removeLayer(geojsonCountry_1);
        }
        if(map2.hasLayer(geojsonADM0_2)){
          map2.removeLayer(geojsonADM0_2);
          map1.removeLayer(geojsonADM0_1);
        }
        if(map2.hasLayer(geojsonADM2_2)){
          map2.removeLayer(geojsonADM2_2);
          map1.removeLayer(geojsonADM2_1);
        }
        if(map2.hasLayer(geojsonAdm1OutBBox_2)){
          map2.removeLayer(geojsonAdm1OutBBox_2);
          map1.removeLayer(geojsonAdm1OutBBox_1);
        }
        if(map2.hasLayer(geojsonAdm2OutBBox_2)){
          map2.removeLayer(geojsonAdm2OutBBox_2);
          map1.removeLayer(geojsonAdm2OutBBox_1);
        }
  
      }

      $( "#mekong-map" ).click(function() {
        resetMap();
        initMap1();
        initMap2();
        for(var i=0; i<summaryCountryName.length; i++){
          document.getElementById(summaryCountryName[i]).classList.remove("hide-element");
          document.getElementById(summaryCountryName[i]).classList.add("show-element");
        }
        $( "#country-map" ).text("");
        $( "#province-map" ).text("");
      });
      $( "#country-map" ).click(function() {
        resetMap();
        whenClicked(adm0FeatureClicked);
        $( "#province-map" ).text("");
      });

      $( "#geojson-btn-download" ).click(function() {
        var selected_province = $("#area_selector").val();
        var DownloadURL = 'https://mdcw-servir.adpc.net/static/data/crop_geojson/'+selected_province+'.geojson';
        var file_path = DownloadURL;
          var a = document.createElement('A');
          a.href = file_path;
          document.body.appendChild(a);
          a.click()
          document.body.removeChild(a);
      });

      $( "#raster-btn-download" ).click(function() {
        $scope.showLoader = true;
        var parameters = {
          date: currentDateList[0],
        };
        MapService.get_download_url(parameters).then(function (res){
          var dnlurl = res.downloadURL;
          var a = document.createElement('A');
          a.href = dnlurl;
          document.body.appendChild(a);
          a.click()
          document.body.removeChild(a);
          $scope.showLoader = false;
        }, function (error) {
          $scope.showLoader = false;
          console.log(error);
        })

      });

    $( "#current-d" ).click(function() {
      $("#map-updated-date").text();
      $scope.cropLayer(0);
      var dateObj = new Date(currentDateList[0]);
      var _date = dateObj.toISOString().slice(0,10)
      selectedCurrentDate = _date.replace("-","_").replace("-","_");
      $("#map-updated-date").text(_date);
    });
    $( "#current-8d" ).click(function() {
      $("#map-updated-date").text();
      $scope.cropLayer(1);
      var dateObj = new Date(currentDateList[1]);
      var _date = dateObj.toISOString().slice(0,10)
      $("#map-updated-date").text(_date);
    });
    $( "#current-16d" ).click(function() {
      $("#map-updated-date").text();
      $scope.cropLayer(2);
      var dateObj = new Date(currentDateList[2]);
      var _date = dateObj.toISOString().slice(0,10)
      $("#map-updated-date").text(_date);
    });
    $( "#current-24d" ).click(function() {
      $("#map-updated-date").text();
      $scope.cropLayer(3);
      var dateObj = new Date(currentDateList[3]);
      var _date = dateObj.toISOString().slice(0,10)
      $("#map-updated-date").text(_date);
    });
      

    $( "#area_selector" ).change(function() {
      var selected_province = $(this).val();
      $.getJSON('/static/data/crop_geojson/'+selected_province+'.geojson')
      .done(function (data, status) {

        if(map1.hasLayer(selected_province_json)){
          map1.removeLayer(selected_province_json);
        }
        if(map2.hasLayer(crop_yield_json)){
          map2.removeLayer(crop_yield_json);
        }

        selected_province_json = L.geoJson(data, {
          style: focusedPolygonstyle,
        }).addTo(map1);
        crop_yield_json = L.geoJson(data, {
          style: style,
          onEachFeature: onEachcropyield
        }).addTo(map2);

        map2.fitBounds(crop_yield_json.getBounds());
        map1.fitBounds(selected_province_json.getBounds());
      });

      // Change crop calender for selected province
      if (selected_province == "ninh_thuan_districts"){
        $("#ct-ninh-thuan").css("display", "block");
        $('#ct-nam-dinh').css("display", "none");
        $('#ct-vinh-phuc').css("display", "none");
      } else if (selected_province == "nam_dinh_districts"){
        $("#ct-ninh-thuan").css("display", "none");
        $('#ct-nam-dinh').css("display", "block");
        $('#ct-vinh-phuc').css("display", "none");
      } else if (selected_province == "vinh_phuc_districts"){
        $("#ct-ninh-thuan").css("display", "none");
        $('#ct-nam-dinh').css("display", "none");
        $('#ct-vinh-phuc').css("display", "block");
      }

      MapService.get_current_date_crop(parameters)
        .then(function (result){
          currentDateList = result;
          $scope.cropLayer(0);
          var dateObj = new Date(currentDateList[0]);
  
          var _date = dateObj.toISOString().slice(0,10)
          selectedCurrentDate = _date.replace("-","_").replace("-","_");
          $("#map-updated-date").text(_date);
  
        }), function (error){
          console.log(error);
        };

      //var province  = $(this).val();

      $scope.cropLayer = function(index) {
        if(map1.hasLayer(cropLayer)){
          map1.removeLayer(cropLayer);
        }
        var parameters = {
          date: currentDateList[index],
          province: selected_province
        };
        MapService.get_crop_map_id(parameters)
        .then(function (result){
          cropLayer = addMapLayer(cropLayer, result.eeMapURL, 'cropLayer');
          $scope.showLoader = false;
  
        }), function (error){
          console.log(error);
        };
      };


      $( "#current-d" ).click(function() {
        $("#map-updated-date").text();
        $scope.cropLayer(0);
        var dateObj = new Date(currentDateList[0]);
        var _date = dateObj.toISOString().slice(0,10)
        selectedCurrentDate = _date.replace("-","_").replace("-","_");
        $("#map-updated-date").text(_date);
      });
      $( "#current-8d" ).click(function() {
        $("#map-updated-date").text();
        $scope.cropLayer(1);
        var dateObj = new Date(currentDateList[1]);
        var _date = dateObj.toISOString().slice(0,10)
        $("#map-updated-date").text(_date);
      });
      $( "#current-16d" ).click(function() {
        $("#map-updated-date").text();
        $scope.cropLayer(2);
        var dateObj = new Date(currentDateList[2]);
        var _date = dateObj.toISOString().slice(0,10)
        $("#map-updated-date").text(_date);
      });
      $( "#current-24d" ).click(function() {
        $("#map-updated-date").text();
        $scope.cropLayer(3);
        var dateObj = new Date(currentDateList[3]);
        var _date = dateObj.toISOString().slice(0,10)
        $("#map-updated-date").text(_date);
      });

    });
  
     
  
  
  
    });
  })();
  