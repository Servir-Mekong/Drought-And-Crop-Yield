(function() {

    'use strict';
    angular.module('landcoverportal')
        .controller('utilsController', function ($rootScope, $scope, appSettings) {


            $scope.menus = appSettings.menus;
            $scope.application = appSettings.application;
            $scope.footerLinks = appSettings.footerLinks;
            $scope.partnersHeader = appSettings.partnersHeader;
            $scope.partnersFooter = appSettings.partnersFooter;
            $scope.serviceApplicationsCards = appSettings.serviceApplicationsCards;
            $scope.publicationLists = appSettings.publicationLists;
            $scope.descriptionModalBody = '';
            $scope.descriptionModalTitle = '';
            $scope.toggleHandleClass = 'fa-chevron-up';

            $scope.trimDescription = function (description) {
                return String(description).substring(0, 200);
            };

            // Modal Close Function
            $scope.closeModal = function() {
                $('#descriptionModal').modal('hide');
            };

            // Modal Open Function
            $scope.showModal = function(title, description) {
                $scope.descriptionModalTitle = title;
                $scope.descriptionModalBody = description;
                $('#descriptionModal').modal('show');
            };

            // Close the Modal
            $('.modal-close').click(function() {
                $scope.closeModal();
            });

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
                if (event.target === $('#descriptionModal')[0]) {
                    $scope.closeModal();
                }
            };

            $('#carousel').carousel({
                interval: 2000
            });

            $scope.toggleFullScreen = function () {
                if ($('.map').hasClass('col-md-9')) {
                    $rootScope.$broadcast('toggleFullScreen', { mapClass: 'col-md-12 col-lg-12', sideClass: 'col-md-0 col-lg-0' });
                } else {
                    $rootScope.$broadcast('toggleFullScreen', { mapClass: 'col-md-9 col-lg-9', sideClass: 'col-md-3 col-lg-3' });
                }
            };

            $scope.showLogoBar = function () {
                $('.banner-container').removeClass('display-none');
                $scope.toggleHandleClass = 'fa-chevron-up';
                $('body').css({'margin-top': '110px'});
                $('.nav-side-menu').css({'height': 'calc(100vh - 110px)'});
                $('.map').css({'height': 'calc(100vh - 110px)'});
                $('.tab-tool').css({'top': '160px'});
            };

            $scope.hideLogoBar = function () {
                $('.banner-container').addClass('display-none');
                $scope.toggleHandleClass = 'fa-chevron-down';
                $('body').css({'margin-top': '55px'});
                $('.nav-side-menu').css({'height': 'calc(100vh - 55px)'});
                $('.map').css({'height': 'calc(100vh - 55px)'});
                $('.tab-tool').css({'top': '105px'});
            };

            $scope.toggleLogoBar = function () {
                if ($('.banner-container').hasClass('display-none')) {
                    $scope.showLogoBar();
                } else {
                    $scope.hideLogoBar();
                }
            };

            $rootScope.$on('toggleLogoBar', function (event, data) {
                if(data && data.show) {
                    $scope.showLogoBar();
                } else {
                    $scope.hideLogoBar();
                }
            });

            $rootScope.$on('showToggleFullScreenIcon', function (event, data) {
                if (data && data.show) {
                    $scope.showToggleFullScreenIcon = true;
                } else {
                    $scope.showToggleFullScreenIcon = false;
                }
            });

            $scope.showLogoToggleIcon = true;
            $rootScope.$on('showLogoToggleIcon', function (event, data) {
                if (data && data.show) {
                    $scope.showLogoToggleIcon = true;
                } else {
                    $scope.showLogoToggleIcon = false;
                    $scope.hideLogoBar();
                }
            });

            $rootScope.$on('changeMenu', function (event, data) {
                if (data && data.menus) {
                    $scope.menus = data.menus;
                } else {
                    console.log('no menu to change!');
                }
            });

            $rootScope.$on('changeApplicationName', function (event, data) {
                if (data && data.application) {
                    $scope.application = data.application;
                } else {
                    console.log('no name to change!');
                }
            });

            $scope.extraBrands = [];
            $rootScope.$on('changeExtraBrands', function (event, data) {
                if (data && data.extraBrands) {
                    $scope.extraBrands = data.extraBrands;
                } else {
                    console.log('no name to change!');
                }
            });

        });

})();
