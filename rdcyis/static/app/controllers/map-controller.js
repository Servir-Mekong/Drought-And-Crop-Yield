(function () {

  'use strict';
  angular.module('landcoverportal')
  .controller('MapController', function ($http, $rootScope, $scope, $sanitize, $timeout, appSettings, MapService) {



    $scope.variables = appSettings.variables;
    $scope.periodicity = appSettings.periodicity;
    $scope.areaIndexSelectors = appSettings.areaIndexSelectors;
    $scope.downloadServerURL = appSettings.downloadServerURL;
    $scope.legendsSB = appSettings.legendsSB;
    $scope.droughtLegend = appSettings.droughtLegend;
    $scope.legend = []
    $scope.showLoader = true;
    var geojsondata, selectedFeature, wmsLayer, selectedAreaLevel;
    var areaid0 = '';
    var areaid1 = '';
    var type = 'mekong_country';
    var selectedArea = 'Mekong region';
    var $modalCompare = $("#compare-modal");
    var lwmsLayer;
    var rwmsLayer;
    var compare;


    var map = L.map('map').setView([15.255, 100.09], 6);
    L.tileLayer('https://api.mapbox.com/styles/v1/servirmekong/ckduef35613el19qlsoug6u2h/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2VydmlybWVrb25nIiwiYSI6ImNrYWMzenhldDFvNG4yeXBtam1xMTVseGoifQ.Wr-FBcvcircZ0qyItQTq9g', {
    	maxZoom: 20,
    	attribution: ''
    }).addTo(map);
    map.removeControl(map.zoomControl);

    lwmsLayer = L.tileLayer.wms();

		rwmsLayer = L.tileLayer.wms();

		map.createPane('admin');
		map.createPane('droughtwmsLayer');
		map.getPane('admin').style.zIndex = 650;
		map.getPane('droughtwmsLayer').style.zIndex = 560;
    map.createPane('lwmsLayer');
		map.getPane('lwmsLayer').style.zIndex = 655;
    map.createPane('rwmsLayer');
		map.getPane('rwmsLayer').style.zIndex = 655;


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

    geojsondata = L.geoJson(mekong,{
        style: style,
        onEachFeature: onEachCountry,
        pane: 'admin'
      }).addTo(map);
    //map.fitBounds(geojsondata.getBounds());


    function onEachCountry(feature, layer) {
      layer.on("click", function (e) {
          geojsondata.setStyle(style2); //resets layer colors
          layer.setStyle(highlight);  //highlights selected.
          map.fitBounds(layer.getBounds());

          areaid0 = e.sourceTarget.feature.properties.ID_0;
          selectedArea = e.sourceTarget.feature.properties.NAME_0;
          if(type=="adm1") {
            areaid1 = e.sourceTarget.feature.properties.ID_1;
            selectedArea = e.sourceTarget.feature.properties.NAME_1;
          }

          $scope.getDroughtData();
          $scope.getDroughtData2();
          //$scope.getDroughtData3();

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
      var enableDatesArray = [];
      if (type===1){
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
      }else if (type===2) {
        var dataset = $("#map-left-indices option:selected").val();
        var datePicker = $("#datepicker-left");
      }else{
        var dataset = $("#map-right-indices option:selected").val();
        var datePicker = $("#datepicker-right");
      }

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
          $scope.showLoader = false;

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
      }), function (error){
        console.log(error);
      };
    };

    $scope.getDroughtData = function () {
      var dataset = $("#select-indices1 option:selected").val();
      var datasetTxt = $("#select-indices1 option:selected").text();
      var period = $("#select-periodicity option:selected").text();
      $scope.getData(dataset, 'container');
      //$("#chart-description-c1").text("This line chart shows Min, Max, Mean values of "+datasetTxt+ " in "+ selectedArea +" | Periodicity: "+ period);
      $("#chart-description-c2").text("An area chart compares Min and Max values of nowcast and forecasted data of "+datasetTxt+ " in "+ selectedArea +" | Periodicity: "+ period);
    };
    $scope.getDroughtData2 = function () {
      var dataset = $("#select-indices2 option:selected").val();
      var datasetTxt = $("#select-indices2 option:selected").text();
      var period = $("#select-periodicity  option:selected").text();
      $scope.getData(dataset, 'container-chart3');
      //$("#chart-description-c3").text("This line chart shows Min, Max, Mean values of "+datasetTxt+ " in "+ selectedArea +" | Periodicity: "+ period);
      $("#chart-description-c4").text("An area chart compares Min and Max values of nowcast and forecasted data of "+datasetTxt+ " in "+ selectedArea +" | Periodicity: "+ period);

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


    $('#dp5').on('changeDate', function() {
        $scope.showLoader = true;
        var date = $('#dp5').datepicker('getFormattedDate');
        $scope.showWMSLayer(date);

        $scope.getDroughtData();
        $scope.getDroughtData2();
        //$scope.getDroughtData3();

    });

    $("#download-btn").click(function(){
      $scope.downloadRaster();
    });


    // A $( document ).ready() block.
    $( document ).ready(function() {

      $("#select-indices1 option[value=sb-vsdi]").attr('selected','selected');
      $("#select-indices2 option[value=sb-savi]").attr('selected','selected');
      $("#select-periodicity option[value=3month]").attr('selected','selected');
        // $scope.getDroughtData();
        // $scope.getDroughtData2();
        // $scope.getDroughtData3();
        $scope.getDateAvailable(1);
        $scope.getDateAvailable(2);
        $scope.getDateAvailable(3);


    });

    $("#select-indices1").on('change', function(){
      $scope.getDroughtData();
    });
    $("#select-indices2").on('change', function(){
      $scope.getDroughtData2();
    });
    // $("#select-indices3").on('change', function(){
    //   $scope.getDroughtData3();
    // });

    $("#select-periodicity").on('change', function(){
      $scope.getDroughtData();
      $scope.getDroughtData2();
      //$scope.getDroughtData3();
    });

    $("#select-areaIndexSelectors").on('change', function(){
      var selectedopt = $("#select-areaIndexSelectors option:selected").val();
      if(map.hasLayer(geojsondata)){
        map.removeLayer(geojsondata);
      }

      if(selectedopt === 'mekong'){
        type='mekong_country';
        geojsondata = L.geoJson(mekong,{
            style: style,
            onEachFeature: onEachCountry,
            pane: 'admin'
          }).addTo(map);
      }else if(selectedopt === 'lmr'){
        type='lmr';
        geojsondata = L.geoJson(mekong_basin,{
            style: style,
            onEachFeature: onEachCountry,
            pane: 'admin'
          }).addTo(map);
      }else if(selectedopt === 'country'){
        type='adm0';
        geojsondata = L.geoJson(adm0,{
            style: style,
            onEachFeature: onEachCountry,
            pane: 'admin'
          }).addTo(map);
      }else{
        type='adm1';
        geojsondata = L.geoJson(adm1,{
            style: style,
            onEachFeature: onEachCountry,
            pane: 'admin'
          }).addTo(map);
      }
      map.fitBounds(geojsondata.getBounds());
    });

    $("#map-select-indices1").on('change', function(){
      $scope.showLoader = true;
      $scope.getDateAvailable(1);
    });
    $("#map-left-indices").on('change', function(){
      $scope.showLoader = true;
      $scope.getDateAvailable(2);
    });
    $("#map-right-indices").on('change', function(){
      $scope.showLoader = true;
      $scope.getDateAvailable(3);
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
      wmsLayer.setOpacity(this.value/100);
    }



    /**
		* layers comparing function
		*/
		var add_compare = function(){
			$modalCompare.modal('hide');
      $scope.showLoader = true;
			var lindicator =  ($("#map-left-indices option:selected").val());
			var rindicator =  ($("#map-right-indices option:selected").val());
			var l_date = $("#datepicker-left").val();
			var r_date = $("#datepicker-right").val();
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

        }), function (error){
          console.log(error);
        };
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
      // var ldate = l_date.replace('-', '_');
      // ldate = ldate.replace('-', '_');
      // var rdate = r_date.replace('-', '_');
      // rdate = rdate.replace('-', '_');
      //
      // if(lindicator === 'sb-vsdi'){
      //   llayer =  'rdcyis-eo_based:vsdi_'+ldate+'_mekong';
      //   lstyle = 'drought-vsdi';
      // }else if(lindicator === 'sb-ndvi'){
      //   llayer =  'rdcyis-eo_based:ndvi_'+ldate+'_mekong';
      //   lstyle = 'drought-ndvi';
      // }else if(lindicator === 'sb-evi'){
      //   llayer =  'rdcyis-eo_based:evi_'+ldate+'_mekong';
      //   lstyle = 'drought-evi';
      // }else if(lindicator === 'sb-msi'){
      //   llayer =  'rdcyis-eo_based:msi_'+ldate+'_mekong';
      //   lstyle = 'drought-msi';
      // }else if(lindicator === 'sb-kbdi'){
      //   llayer =  'rdcyis-eo_based:kbdi_'+ldate+'_mekong';
      //   lstyle = 'drought-kbdi';
      // }else if(lindicator === 'sb-arvi'){
      //   llayer =  'rdcyis-eo_based:arvi_'+ldate+'_mekong';
      //   lstyle = 'drought-arvi';
      // }else if(lindicator === 'sb-savi'){
      //   llayer =  'rdcyis-eo_based:savi_'+ldate+'_mekong';
      //   lstyle = 'drought-savi';
      // }
      //
      // if(rindicator === 'sb-vsdi'){
      //   rlayer =  'rdcyis-eo_based:vsdi_'+rdate+'_mekong';
      //   rstyle = 'drought-vsdi';
      // }else if(rindicator === 'sb-ndvi'){
      //   rlayer =  'rdcyis-eo_based:ndvi_'+rdate+'_mekong';
      //   rstyle = 'drought-ndvi';
      // }else if(rindicator === 'sb-evi'){
      //   rlayer =  'rdcyis-eo_based:evi_'+rdate+'_mekong';
      //   rstyle = 'drought-evi';
      // }else if(rindicator === 'sb-msi'){
      //   rlayer =  'rdcyis-eo_based:msi_'+rdate+'_mekong';
      //   rstyle = 'drought-msi';
      // }else if(rindicator === 'sb-kbdi'){
      //   rlayer =  'rdcyis-eo_based:kbdi_'+rdate+'_mekong';
      //   rstyle = 'drought-kbdi';
      // }else if(rindicator === 'sb-arvi'){
      //   rlayer =  'rdcyis-eo_based:arvi_'+rdate+'_mekong';
      //   rstyle = 'drought-arvi';
      // }else if(rindicator === 'sb-savi'){
      //   rlayer =  'rdcyis-eo_based:savi_'+rdate+'_mekong';
      //   rstyle = 'drought-savi';
      // }
      //
      // lwmsLayer = L.tileLayer.wms('https://geoserver.adpc.net/geoserver/rdcyis-eo_based/wms?', {
      //       service:'WMS',
      //       version:'1.1.0',
      //       request:'GetMap',
      //       layers:llayer,
      //       format:'image/png',
      //       transparent:true,
      //       styles:lstyle
      //   });
      //
      // rwmsLayer = L.tileLayer.wms('https://geoserver.adpc.net/geoserver/rdcyis-eo_based/wms?', {
      //       service:'WMS',
      //       version:'1.1.0',
      //       request:'GetMap',
      //       layers:rlayer,
      //       format:'image/png',
      //       transparent:true,
      //       styles:rstyle
      //   });

			// lwmsLayer.addTo(map);
			// rwmsLayer.addTo(map);


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
    });

  });
})();
