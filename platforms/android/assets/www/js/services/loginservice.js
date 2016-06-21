// Written    : 6/9/2016
// Last Update: 6/11/2016

'use strict';
angular.module('starter.controllers')
//.run(function($http, $httpParamSerializerJQLike) {
//    $http.defaults.transformRequest.unshift($httpParamSerializerJQLike);    // Serialize form data without using jQuery
//})
.service('loginservice', function ($http, API_CONFIG, $q) {
    this.login = function (userlogin) {
        var resp = $http({
            url: API_CONFIG.token,
            method: "POST",
            data: $.param({ grant_type: 'password', username: userlogin.username, password: userlogin.password }),
            //data: { grant_type: 'password', username: userlogin.username, password: userlogin.password },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        return resp;
    };
})