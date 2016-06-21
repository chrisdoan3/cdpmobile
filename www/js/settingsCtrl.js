// Written    : 6/18/2016
// Last Update: 6/18/2016
'use strict';
angular.module('starter.controllers')
.controller('SettingsCtrl', ['$scope',
    function ($scope) {
        var vm = this;

        vm.settingsList = JSON.parse(localStorage.getItem('settingsList'));
        if (vm.settingsList == undefined) {
            vm.settingsList = [
              { text: "Use Native Datepicker", checked: true },
              { text: "Transactions Per Page", value: '10' },
            ];
        }

        vm.useNativeDatePickerChange = function () {
            vm.useNativeDatePicker.checked = !vm.useNativeDatePicker.checked;
        }
            
        $scope.$on('$stateChangeStart', function () {
            localStorage.setItem('settingsList', JSON.stringify(vm.settingsList));
            console.log('$stateChangeStart');
        })
    }])
