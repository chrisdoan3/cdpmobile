// Written    : 6/12/2016
// Last Update: 6/19/2016
'use strict';
angular.module('starter.controllers')
.controller('BarcodeCtrl', function ($scope, $cordovaBarcodeScanner, $cordovaInAppBrowser, commonservice) {
    $scope.scanBarCode = function () {
        if (window.cordova) {
            $cordovaBarcodeScanner.scan().then(function (imageData) {
                $scope.imagedata = imageData.text;
                $scope.imageformat = imageData.format;
                $scope.upclookup = 'http://www.upcindex.com/' + $scope.imagedata;
                upclookup();
            }, function (err) {
                $scope.showAlert('ERROR!', err);
            })
        }
        else {
            commonservice.toast('Only works on a physical device!', 'long', 'bottom');
        }
    }

    function upclookup() {
        var options = {
            location: 'yes',
            clearcache: 'yes',
            toolbar: 'no'
        };
        if ($scope.upclookup == undefined) {
            commonservice.toast('UPC data not present!', 'long', 'bottom');
        }
        else
        {
            $cordovaInAppBrowser.open($scope.upclookup, '_blank', options)
                .then(function (event) {
                    // success
                })
                .catch(function (event) {
                    $scope.showAlert('ERROR!', event);
                });
        }
    }

    $scope.lookUpUPC = function () {
        upclookup();
    }
})
