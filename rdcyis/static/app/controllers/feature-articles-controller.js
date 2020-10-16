(function () {

    'use strict';
    angular.module('mekongDroughtandCropWatch')
    .controller('FeatureController', function ($http, $rootScope, $scope, $sanitize, $timeout, appSettings, MapService) {
      $scope.showLoader = true;
      $scope.featureArticles = [];
      $scope.knowledgeCenter = [];
      var parameters = {};
      MapService.getFeatureArticles(parameters).then(function (data) {
        $scope.featureArticles = JSON.parse(data);
        $scope.showLoader = false;
      }, function (error) {});

      MapService.getKnowledgeCenter(parameters).then(function (data) {
        $scope.knowledgeCenter = JSON.parse(data);
        $scope.showLoader = false;
      }, function (error) {});

    });

})();
