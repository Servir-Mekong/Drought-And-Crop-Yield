(function () {

  'use strict';
  angular.module('mekongDroughtandCropWatch')
  .controller('ReportController', function ($http, $rootScope, $scope, $sanitize, $timeout, appSettings, MapService) {
    $scope.variables = appSettings.variables;
    $scope.periodicity = appSettings.periodicity;
    $scope.areaIndexSelectors = appSettings.areaIndexSelectors;
    $scope.downloadServerURL = appSettings.downloadServerURL;
    $scope.legendsSB = appSettings.legendsSB;
    $scope.droughtLegend = appSettings.droughtLegend;
    var selectedFeature = '';
    var selectedADM1Feature = '';
    //$scope.showLoader = true;
    var geojsondata, geojsonClipedBasin, wmsLayer, selectedFeature, selectedAreaLevel;
    var areaid0 = '';
    var areaid1 = '';
    var type = 'mekong_country';
    var selectedArea = 'Mekong region';
    var rainfallMap=   L.map('rainfallMap').setView([18.055, 100.09], 5);
    var meteorologicalMap =   L.map('meteorologicalMap').setView([18.055, 100.09], 5);
    var agriculturalMap=   L.map('agriculturalMap').setView([18.055, 100.09], 5);
    var rainfallMap_outlook =   L.map('rainfallMap_outlook').setView([18.055, 100.09], 5);
    var meteorologicalMap_outlook=   L.map('meteorologicalMap_outlook').setView([18.055, 100.09], 5);
    var agriculturalMap_outlook =   L.map('agriculturalMap_outlook').setView([18.055, 100.09], 5);

    var geojsonCountry, geojsonAdm1OutBBox, geojsonAdm2OutBBox, geojsonOutBBOX_1, geojsonADM0, geojsonADM2 ,geojsonOutBBOX;
    var geojsonADM2_2, geojsonADM2_1, adm0FeatureClicked, adm1FeatureClicked;
    var geojsonWater_1, geojsonWater_2, currentDateList, currentLayer, outlookLayer, outlookDateList;

    var mapCont = [
      {
        'mapArr': rainfallMap,
        'mapArrText': 'rainfallMap',
        'mapDataset': 'mb-rainf'
      },
      {
        'mapArr': meteorologicalMap,
        'mapArrText': 'meteorologicalMap',
        'mapDataset': 'mb-spi1'
      },
      {
        'mapArr': agriculturalMap,
        'mapArrText': 'agriculturalMap',
        'mapDataset': 'sb-vsdi'
      },
      {
        'mapArr': rainfallMap_outlook,
        'mapArrText': 'rainfallMap_outlook',
        'mapDataset': 'mb-rainf'
      },
      {
        'mapArr': meteorologicalMap_outlook,
        'mapArrText': 'meteorologicalMap_outlook',
        'mapDataset': 'mb-spi1'
      },
      {
        'mapArr': agriculturalMap_outlook,
        'mapArrText': 'agriculturalMap_outlook',
        'mapDataset': 'mb-rootmoist'
      }
    ];

    var mapURL = [];

    //////////////////////////////Regoin Boundary onclick event////////////////////////////////////
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
      fillOpacity: 1
    }
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
    // highlight polygon style
    var highlight = {
      'fillColor': 'blue',
      'weight': 2,
      'opacity': 1,
      'color': '#dd614a',
      'fillOpacity': 0,
    };
    // function to add and update tile layer to map
  		function addMapLayer(map, layer,url, pane){
  			layer = L.tileLayer(url,{
  				attribution: '<a href="https://earthengine.google.com" target="_">' +
  				'Google Earth Engine</a>;',
  			 	pane: pane}).addTo(map);
          $scope.showLoader = false;
  				return layer;
  		}



    $scope.showWMSLayer = function(map, mapContainer, dataset) {
      $scope.showLoader = true;
      var parameters = {
        dataset: dataset,
      };
      MapService.get_date_list(parameters)
      .then(function (result){
        var dateAgo = [];
        var dateOutlook = [];
        var currentDate = new Date();
        var month_ago = new Date(currentDate.getTime() - (30 * 24 * 60 * 60 * 1000));
        var outlook_1 = new Date(currentDate.getTime() + (7 * 24 * 60 * 60 * 1000));
        var day =currentDate.getDate();
        var month=currentDate.getMonth()+1;
        var year=currentDate.getFullYear();
        //var _7ago = new Date("2015-03-25");
        result.forEach(function(item, index){
          if(new Date(item) > month_ago && new Date(item) < currentDate){
            dateAgo.push(item);
          }
          if(new Date(item) > currentDate && new Date(item) < outlook_1){
            dateOutlook.push(item);
          }
        });

        if(mapContainer === "rainfallMap" || mapContainer === "meteorologicalMap" || mapContainer === "agriculturalMap"){
          var map_date = dateAgo.reverse()[0];
          console.log(mapContainer +" "+map_date);
        }else{
          var map_date = dateOutlook.reverse()[0];
          //var map_date = year+"-"+month+"-"+day;
          console.log(mapContainer +" "+map_date);
        }
        var parameters = {
          dataset: dataset,
          date: map_date,
        };

        MapService.get_map_id(parameters)
        .then(function (result){

            var basemapLayer = L.tileLayer('https://api.mapbox.com/styles/v1/servirmekong/ckduef35613el19qlsoug6u2h/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2VydmlybWVrb25nIiwiYSI6ImNrYWMzenhldDFvNG4yeXBtam1xMTVseGoifQ.Wr-FBcvcircZ0qyItQTq9g', {
            	maxZoom: 20,
            	attribution: ''
            }).addTo(map);

            map.removeControl(map.zoomControl);
        		map.createPane('admin');
            map.createPane('maskedout');
        		map.createPane('droughtwmsLayer');
        		map.getPane('admin').style.zIndex = 660;
            map.getPane('maskedout').style.zIndex = 659;
        		map.getPane('droughtwmsLayer').style.zIndex = 560;

            geojsonADM0 = L.geoJson(adm0,{
              style: polygonstyle,
              onEachFeature: onEachCountry,
              pane: 'admin'
            }).addTo(map);
            map.fitBounds(geojsonADM0.getBounds());

          if(map.hasLayer(wmsLayer)){
            map.removeLayer(wmsLayer);
          }
          wmsLayer = addMapLayer(map, wmsLayer, result.eeMapURL, 'droughtwmsLayer');



        }), function (error){
          console.log(error);
        };

      }), function (error){
        console.log(error);
      };

    };


//map init
for(var i=0; i<mapCont.length; i++){
  $scope.showLoader = true;
  $scope.showWMSLayer(mapCont[i]["mapArr"], mapCont[i]["mapArrText"], mapCont[i]["mapDataset"]);
}


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

  for(var i=0; i<mapCont.length; i++){

    var _map = mapCont[i]["mapArr"];
    _map.removeLayer(geojsonCountry);
    if(_map.hasLayer(geojsonADM2)){
      _map.removeLayer(geojsonADM2);
    }

    geojsonAdm2OutBBox = L.geoJson(adm2,{
      style: outBBoxstyle,
      filter: geojsonADM1FilterOutBBox,
      pane:'admin'
    }).addTo(_map);

    geojsonADM2 = L.geoJson(adm2,{
      style: polygonstyle,
      filter: geojsonADM1Filter,
      pane:'admin'
    }).addTo(_map);

    _map.fitBounds(geojsonADM2.getBounds());
  }

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


function geojsonFilter(feature) {
  if (feature.properties.NAME_0 === selectedFeature) return true
}
function geojsonFilterAdm1OutBBox(feature) {
  if (feature.properties.NAME_0 !== selectedFeature) return true
}

function whenClicked(e) {

  adm0FeatureClicked = e;
  selectedFeature = e.sourceTarget.feature.properties.NAME_0;

  for(var i=0; i<mapCont.length; i++){
    var _map = mapCont[i]["mapArr"];
    if(_map.hasLayer(geojsonADM0)){
      _map.removeLayer(geojsonADM0);
    }

    geojsonAdm1OutBBox = L.geoJson(adm1,{
      style: outBBoxstyle,
      filter: geojsonFilterAdm1OutBBox,
      pane:'admin'
    }).addTo(_map);

    geojsonCountry = L.geoJson(adm1,{
      style: polygonstyle,
      filter: geojsonFilter,
      onEachFeature: onEachADM1,
      pane:'admin'
    }).addTo(_map);

    _map.fitBounds(geojsonCountry.getBounds());
  }

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



  $("#btnSave").click(function() {
    $scope.showLoader = true;
    var node = document.getElementById('report');
    domtoimage.toPng(node)
        .then(function (dataUrl) {
            var img = new Image();
            img.src = dataUrl;
            var a = document.createElement("a");
            a.href = dataUrl;
            var newDate = new Date();
            var pngfilename = "MDCW-REPORT: " + newDate.toLocaleDateString() + " @ " + newDate.toLocaleTimeString()+ ".png";
            a.setAttribute("download", pngfilename);
            a.click();
            $scope.showLoader = false;
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
      });
  });

  $("#btnExport").click(function() {
    $scope.showLoader = true;
    var pdf = new jsPDF("l", "mm", "a4");
    var width = pdf.internal.pageSize.getWidth();
    var height = pdf.internal.pageSize.getHeight();

    var currentMap = document.getElementById('current-map');
    domtoimage.toPng(currentMap)
        .then(function (dataUrl) {
            var img = new Image();
            img.src = dataUrl;
            pdf.addImage(img, 'JPEG', 10, 10, width-10, height-20);

            var outlookMap = document.getElementById('outlook-map');
            domtoimage.toPng(outlookMap)
                .then(function (dataUrl) {
                    var imgOutlok = new Image();
                    imgOutlok.src = dataUrl;
                    pdf.addPage();
                    pdf.addImage(imgOutlok, 'JPEG', 10, 10, width-10, height-20);
                    var newDate = new Date();
                    var pdffilename = "MDCW-REPORT: " + newDate.toLocaleDateString() + " @ " + newDate.toLocaleTimeString()+ ".pdf";
                    pdf.save(pdffilename);
                    $scope.showLoader = false;
                })
                .catch(function (error) {
                    console.error('oops, something went wrong!', error);
              });

        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
      });




  });



  });
})();
