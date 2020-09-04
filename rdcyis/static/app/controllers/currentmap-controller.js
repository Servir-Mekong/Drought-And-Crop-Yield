(function () {

  'use strict';
  angular.module('landcoverportal')
  .controller('CurrentMapController', function ($http, $rootScope, $scope, $sanitize, $timeout, appSettings) {

    var selectedFeature = '';
    var selectedADM1Feature = '';
    var geojsonCountry_2, geojsonCountry_1, geojsonAdm1OutBBox_1, geojsonAdm1OutBBox_2, geojsonAdm2OutBBox_1, geojsonAdm2OutBBox_2, geojsonOutBBOX_1, geojsonADM0_1,geojsonOutBBOX_2, geojsonADM0_2;
    var geojsonADM2_2, geojsonADM2_1, adm0FeatureClicked, adm1FeatureClicked;
    var summaryCountryName = ['Cambodia','Laos','Myanmar','Thailand','Vietnam']
    var polygonstyle = {
      fillColor: "#FFF",
      weight: 0.5,
      opacity: 1,
      color: '#6c757d',
      fillOpacity: 0
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
    map1.removeControl(map1.zoomControl);
    map1.touchZoom.disable();
    map1.dragging.disable();
    map1.doubleClickZoom.disable();
    map1.scrollWheelZoom.disable();

    function initMap1(){
      geojsonOutBBOX_1 = L.geoJson(outboundary,{
        style: outBBoxstyle
      }).addTo(map1);

      geojsonADM0_1 = L.geoJson(adm0,{
        style: polygonstyle,
        onEachFeature: onEachCountry
      }).addTo(map1);
      map1.fitBounds(geojsonADM0_1.getBounds());
    }

    var map2 = L.map('map2').setView([51.505, -0.09], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/servirmekong/ckd8mk8ky0vbh1ipdns7ji9wz/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2VydmlybWVrb25nIiwiYSI6ImNrYWMzenhldDFvNG4yeXBtam1xMTVseGoifQ.Wr-FBcvcircZ0qyItQTq9g', {}).addTo(map2);
    map2.removeControl(map2.zoomControl);
    map2.touchZoom.disable();
    map2.dragging.disable();
    map2.doubleClickZoom.disable();
    map2.scrollWheelZoom.disable();

    function initMap2(){
      geojsonOutBBOX_2 = L.geoJson(outboundary,{
        style: outBBoxstyle
      }).addTo(map2);
      geojsonADM0_2 = L.geoJson(adm0,{
        style: polygonstyle,
        onEachFeature: onEachCountry
      }).addTo(map2);
      map2.fitBounds(geojsonADM0_2.getBounds());
    }

    initMap1();
    initMap2();

    ////////////////////////////Current Condition Map////////////////////////////
    var wmsCurrentConditionLayer= L.tileLayer.wms("https://geoserver.adpc.net/geoserver/rdcyis-eo_based/wms", {
    format: 'image/png',
    layers: 'rdcyis-eo_based:front_gcdi_mekong_2020_01_01',
    format: 'image/png',
    version: '1.3.0',
    styles:'intensity-drought',
    transparent: true,
    });
    wmsCurrentConditionLayer.addTo(map1);

    ////////////////////////////Outlooks Map////////////////////////////
    function showOutlookLayer(m){
      if(map2.hasLayer(wmsOutlookLayer)){
        map2.removeLayer(wmsOutlookLayer);
      }
      if(m==="m1"){
        var layer_id = 'rdcyis-rheas_based:front_rcdi_mekong_2020_01';
      }else if (m==="m2") {
        var layer_id = 'rdcyis-rheas_based:front_rcdi_mekong_2020_02';
      }else if (m==="m3") {
        var layer_id = 'rdcyis-rheas_based:front_rcdi_mekong_2020_03';
      }
      var wmsOutlookLayer= L.tileLayer.wms("https://geoserver.adpc.net/geoserver/rdcyis-rheas_based/wms", {
      format: 'image/png',
      layers: layer_id,
      format: 'image/png',
      version: '1.3.0',
      styles:'intensity-drought',
      transparent: true,
      });
      wmsOutlookLayer.addTo(map2);
    }
    showOutlookLayer("m1");

    //////////////////////////////Regoin Boundary onclick event////////////////////////////////////
    function geojsonFilter(feature) {
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
      $("#country-map").text(selectedFeature);
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
      $("#province-map").text(selectedADM1Feature);
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


    $( "#outlook-m1" ).click(function() {
      showOutlookLayer(1);
    });
    $( "#outlook-m2" ).click(function() {
      showOutlookLayer(2);
    });
    $( "#outlook-m3" ).click(function() {
      showOutlookLayer(3);
    });
    $( "#mekong-map" ).click(function() {
      resetMap();
      initMap1();
      initMap2();
      for(var i=0; i<summaryCountryName.length; i++){
        document.getElementById(summaryCountryName[i]).classList.remove("hide-element");
        document.getElementById(summaryCountryName[i]).classList.add("show-element");
      }
      $( "#country-map" ).text("");
    });
    $( "#country-map" ).click(function() {
      resetMap();
      whenClicked(adm0FeatureClicked);
      $( "#province-map" ).text("");
    });

    $("#current-btn-download").click(function(){

      // var file_path = DownloadURL;
			// var a = document.createElement('A');
			// a.href = file_path;
			// a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
			// document.body.appendChild(a);
			// a.click()
			// document.body.removeChild(a);
    });


  });
})();