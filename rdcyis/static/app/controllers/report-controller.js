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
    $scope.showLoader = true;
    var geojsondata, geojsonClipedBasin, wmsLayer, selectedFeature, selectedAreaLevel;
    var areaid0 = '';
    var areaid1 = '';
    var type = 'mekong_country';
    var selectedArea = 'Mekong region';
    var rainfallMap= null;
    var meteorologicalMap = null;

    // mapArr = [rainfallMap, meteorologicalMap, agriculturalMap];
    //var mapArrText = ['rainfallMap', 'meteorologicalMap', 'agriculturalMap'];
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
        'mapArr': agriculturalMap,
        'mapArrText': 'agriculturalMap',
        'mapDataset': 'sb-vsdi'
      },
      {
        'mapArr': rainfallMap_outlook,
        'mapArrText': 'rainfallMap_outlook',
        'mapDataset': 'sb-rainf'
      },
      {
        'mapArr': meteorologicalMap_outlook,
        'mapArrText': 'meteorologicalMap_outlook',
        'mapDataset': 'sb-spi1'
      },
      {
        'mapArr': agriculturalMap_outlook,
        'mapArrText': 'agriculturalMap_outlook',
        'mapDataset': 'sb-vsdi'
      }
    ];

    var mapURL = [];

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
  				return layer;
  		}

          function onEachCountry(feature, layer) {
            layer.on("click", function (e) {
                geojsondata.setStyle(style2); //resets layer colors
                layer.setStyle(highlight);  //highlights selected.
                //map.fitBounds(layer.getBounds());

                areaid0 = e.sourceTarget.feature.properties.ID_0;
                selectedArea = e.sourceTarget.feature.properties.NAME_0;
                if(type=="adm1") {
                  areaid1 = e.sourceTarget.feature.properties.ID_1;
                  selectedArea = e.sourceTarget.feature.properties.NAME_1;
                }
                if(type=="lmr"){
                  geojsonClipedBasin = L.geoJson(cliped_mekong_basin,{
                      style: style2,
                      pane: 'maskedout'
                    }).addTo(map);
                  selectedArea = "Mekong River Basin";
                }


            });
            layer.on('mouseover', function (e){
              $("#mouseover-feature").text(e.sourceTarget.feature.properties.NAME_0);
            });
            layer.on('mouseout', function (){
              $("#mouseover-feature").text("");
              this.setStyle(style); //resets layer colors
            });
          }





    $scope.showWMSLayer = function(map,mapContainer, dataset) {

      var parameters = {
        dataset: dataset,
      };
      MapService.get_date_list(parameters)
      .then(function (result){
        var parameters = {
          dataset: dataset,
          date: result[0],
        };
        MapService.get_map_id(parameters)
        .then(function (result){
            map = L.map(mapContainer).setView([18.055, 100.09], 5);
            // Base Layers
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
            geojsondata = L.geoJson(adm0,{
                style: style,
                onEachFeature: onEachCountry,
                pane: 'admin'
              }).addTo(map);
            map.fitBounds(geojsondata.getBounds());



          if(map.hasLayer(wmsLayer)){
            map.removeLayer(wmsLayer);
          }
          wmsLayer = addMapLayer(map, wmsLayer, result.eeMapURL, 'droughtwmsLayer');
          $scope.showLoader = false;

        }), function (error){
          console.log(error);
        };

      }), function (error){
        console.log(error);
      };

    };

    for(var i=0; i<mapCont.length; i++){
      $scope.showWMSLayer(mapCont[i]["mapArr"], mapCont[i]["mapArrText"], mapCont[i]["mapDataset"]);
    }


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
                  fontFamily: 'Questrial'
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



  });
})();
