// Written    : 6/9/2016
// Last Update: 6/18/2016

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
'use strict';

var db = null;

angular.module('starter', ['ngCordova', 'ionic', 'starter.controllers','ionic-datepicker','$selectBox'])

.config(function (ionicDatePickerProvider) {
    var today = new Date();
    var fromYear = today.getFullYear() - 5;
    var toYear = today.getFullYear();

    var datePickerObj = {
        inputDate: new Date(),
        setLabel: 'Set',
        todayLabel: 'Today',
        closeLabel: 'Close',
        mondayFirst: false,
        weeksList: ["S", "M", "T", "W", "T", "F", "S"],
        monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
        templateType: 'popup',
        from: new Date(fromYear, 1, 1),
        to: new Date(toYear, 12, 1),
        showTodayButton: true,
        dateFormat: 'dd MMMM yyyy',
        closeOnSelect: true,
        //disableWeekdays: [6]
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
})

.constant('API_CONFIG', {
    //'token': 'http://localhost:20000/oauth/token',
    //'idapi': 'http://localhost:20000',
    //'odata': 'http://localhost:20000',
    //'api': 'http://localhost:20000/api',
    'token': 'http://www.cdsoftwaresolutions.com/webapi/oauth/token',
    'idapi': 'http://www.cdsoftwaresolutions.com/webapi',
    'odata': 'http://www.cdsoftwaresolutions.com/webapi',
    'api': 'http://www.cdsoftwaresolutions.com/webapi'
})

.run(function ($ionicPlatform, $cordovaSQLite, commonservice, $cordovaDatePicker, $http, $httpParamSerializerJQLike) {

    //$http.defaults.transformRequest.unshift($httpParamSerializerJQLike);

    document.addEventListener('deviceready', onDeviceReady, false);

    function onDeviceReady() {
        //alert('openDB');
        //try {
        //    db = $cordovaSQLite.openDB({ name: "cdb.db", location: 'default' });
        //    $cordovaSQLite.execute(db, "create table if not exsits localstorage (id integer primary key, columnname text)");
        //    alert('1');
        //    commonservice.savedata('localstorage', 'accessToken', 'TEST').then(function () {
        //        alert('SUCCESS 2');
        //    }, function (err) {
        //        alert('err3='+err);
        //    });
        //    commonservice.getdata('localstorage', 'accessToken');
        //}
        //catch (err)
        //{
        //    alert(err);
        //}
        //alert('9');
    }

    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.transactions', {
        url: '/transactions',
        views: {
        'menuContent': {
                    templateUrl: 'templates/transactions.html',
                    controller: 'TransactionsCtrl',
                    controllerAs: 'vm'
                }
            }
    })

    .state('app.settings', {
        url: '/settings',
        views: {
            'menuContent': {
                templateUrl: 'templates/settings.html',
                controller: 'SettingsCtrl',
                controllerAs: 'vm'
            }
        }
    })

    .state('app.barcode', {
        url: '/barcode',
        views: {
            'menuContent': {
                templateUrl: 'templates/barcode.html',
                controller: 'BarcodeCtrl'
            }
        }
    })

  //.state('app.search', {
  //  url: '/search',
  //  views: {
  //    'menuContent': {
  //      templateUrl: 'templates/search.html'
  //    }
  //  }
  //})
  //.state('app.browse', {
  //    url: '/browse',
  //    views: {
  //      'menuContent': {
  //        templateUrl: 'templates/browse.html'
  //      }
  //    }
  //})
    //.state('app.playlists', {
    //  url: '/playlists',
    //  views: {
    //    'menuContent': {
    //      templateUrl: 'templates/playlists.html',
    //      controller: 'PlaylistsCtrl'
    //    }
    //  }
    //})
  //.state('app.single', {
  //  url: '/playlists/:playlistId',
  //  views: {
  //    'menuContent': {
  //      templateUrl: 'templates/playlist.html',
  //      controller: 'PlaylistCtrl'
  //    }
  //  }
  //});

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/transactions');

});
