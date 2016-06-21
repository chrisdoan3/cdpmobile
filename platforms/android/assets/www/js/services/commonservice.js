// Written    : 6/11/2016
// Last Update: 6/15/2016

'use strict';
angular.module('starter.controllers')
.service('commonservice', function ($window, $ionicLoading, $cordovaSQLite, $q) {
    this.toast = function (msg, duration, position) {
        if (!duration)
            duration = 'short';
        if (!position)
            position = 'top';

        // PhoneGap? Use native:
        if ($window.plugins) {
            if ($window.plugins.toast)
                $window.plugins.toast.show(msg, duration, position,
                    function (a) { }, function (err) { })
            return;
        }

        // … fallback / customized $ionicLoading:
        $ionicLoading.show({
            template: msg,
            noBackdrop: true,
            duration: (duration == 'short' ? 700 : 1500)
        });
    }

    //this.savedata = function (tablename, columnname, columnvalue) {
    //    var deferred = $q.defer();

    //    // for opening a background db:
    //    //var db = $cordovaSQLite.openDB({ name: "cdp.db", bgType: 1 });

    //    alert('db='+ db);

    //    var query = "insert into " + tablename + "_table (columnname) values (?)";
    //    alert(query);

    //    try {
    //        $cordovaSQLite.execute(db, query, [columnvalue]).then(function (res) {
    //            alert("insertId: " + res.insertId);
    //            deferred.resolve();
    //        }, function (err) {
    //            alert(err);
    //            deferred.reject();
    //        });
    //    }
    //    catch (err) {
    //        alert('err2='+err);
    //    }
    //    return deferred.promise;
    //}

    //this.getdata = function (tablename, columnname) {
    //    var deferred = $q.defer();
    //    var query = "select " + columnname + " from " + tablename + " where " + columnname + " = ?";
    //    alert(query);
    //    try {
    //        $cordovaSQLite.execute(db, query, [columnname]).then(function (res) {
    //            if (res.rows.length > 0) {
    //                alert("SELECTED -> " + res.rows.item(0).columnname);
    //                deferred.resolve();
    //                return res.rows.item(0).columnvalue;
    //            } else {
    //                alert("No results found");
    //                deferred.reject();
    //            }
    //        }, function (err) {
    //            alert(err);
    //        });
    //    }
    //    catch (err) {
    //        alert('err3=' + err);
    //    }
    //    deferred.promise;
    //}
})