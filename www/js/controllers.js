// Written    : 6/9/2016
// Last Update: 6/14/2016

'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', 'loginservice', '$ionicPopup', '$ionicLoading', '$cordovaToast', 'commonservice', '$cordovaSQLite',
               function ($scope, $ionicModal, $timeout, loginservice, $ionicPopup, $ionicLoading, $cordovaToast, commonservice, $cordovaSQLite) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    var vm = this;

    // Form data for the login modal
    $scope.loginData = {};

    $scope.loginname = localStorage.getItem('userName');

    $scope.loginstatus = (localStorage.getItem('accessToken') == undefined) ? 'Log In' : 'Log Out';

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/dialogs/login.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.login = function () {
        if (localStorage.getItem('accessToken') == undefined) {
            $scope.modal.show();
        }
        else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userName');
            $scope.loginstatus = 'Log In';
            $scope.loginname = '';
        }
    };

    $scope.showAlert = function (title, message) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: '<div style="text-align:center; font-size: large;">' + message + '</div>'
        });
        alertPopup.then(function (res) {
            console.log(res);
        });
    };

    $scope.doLogin = function () {
        if ($scope.loginData == undefined) {
            $scope.showAlert('ERROR!', 'Please log in!');        
        }
        else {
            $ionicLoading.show({template: 'Authenticating...'});
            loginservice.login($scope.loginData).then(function (resp) {
                $ionicLoading.hide();
                console.log('Welcome ' + $scope.loginData.username);
                commonservice.toast('Welcome ' + $scope.loginData.username,'short','bottom');

                //sessionStorage.setItem('userName', $scope.loginData.username);
                //sessionStorage.setItem('accessToken', resp.data.access_token);  //Store the token information in the SessionStorage so that it can be accessed for other views

                localStorage.setItem('userName', $scope.loginData.username);
                localStorage.setItem('accessToken', resp.data.access_token);

                $scope.loginname = $scope.loginData.username;
                $scope.loginstatus = 'Log Out';
                $scope.modal.hide();
            }, function (err) {
                console.log();
                if (err.data == null) {
                    $scope.showAlert('ERROR!', 'Failed to log in!');
                }
                else {
                    $scope.showAlert('ERROR!', err.data.error_description);
                }
                $ionicLoading.hide();
            });
        }
    };

    $scope.closeModalError = function () {
        $scope.modalerror.hide();
    };
}])
