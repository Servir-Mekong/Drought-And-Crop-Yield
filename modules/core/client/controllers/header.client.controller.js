(function () {

	"use strict";

	angular.module("rheas")
		.controller("GlobalCtrl", function ($scope, $window) {

			$scope.showUpwardArrow = true;
			$scope.showDownArrow = false;

			$scope.reload = function () {
				$window.location.reload();
			};

			// Animation for slide up
			$scope.slideUpClick = function () {
				if ($scope.showUpwardArrow) {
					$scope.showUpwardArrow = false;
					$scope.showDownArrow = true;
					$("#slide-up").attr("src", "modules/core/client/img/slide-down.png");
					$("#map").css({ "height": "calc(100vh - 45px)" });
				} else if ($scope.showDownArrow) {
					$scope.showUpwardArrow = true;
					$scope.showDownArrow = false;
					$("#slide-up").attr("src", "modules/core/client/img/slide-up.png");
					$("#map").css({ "height": "calc(100vh - 120px)" });
				}
			};
		});

}());