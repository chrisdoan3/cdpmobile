// Written    : 5-21-2016
// Last Update: 6-21-2016
(function () {
    'use strict';
    angular
        .module('starter.controllers').service('UtilitiesService', UtilitiesService);

    function UtilitiesService() {
        var self = this;
        
        self.isObjectEmpty = function (object) {
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        }

        self.getChangeElements = function (oldtransaction, editedtransaction) {
            var transaction = {};
            var sorteoldtransactions = Object.keys(oldtransaction).sort();  // Sort JavaScript object so we can access its elements by index
            var sorteeditedtransactions = Object.keys(editedtransaction).sort();
            var count = Object.keys(editedtransaction).length;
            for (var i = 0; i < count; i++) {
                if (editedtransaction[sorteeditedtransactions[i]] != oldtransaction[sorteoldtransactions[i]]) {
                    if (typeof(editedtransaction[sorteeditedtransactions[i]]) === 'number') {
                        transaction[sorteeditedtransactions[i]] = Number(editedtransaction[sorteeditedtransactions[i]]);
                    }
                    else if (typeof (editedtransaction[sorteeditedtransactions[i]]) === 'string') {
                        transaction[sorteeditedtransactions[i]] = editedtransaction[sorteeditedtransactions[i]];
                        if (transaction[sorteeditedtransactions[i]] == '') 
                            transaction[sorteeditedtransactions[i]] = null;                        
                    }
                    else if (typeof (editedtransaction[sorteeditedtransactions[i]]) === 'object') {
                        if (Object.prototype.toString.call(editedtransaction[sorteeditedtransactions[i]]) === '[object Date]') {
                            var olddate = new Date(oldtransaction[sorteoldtransactions[i]]);
                            var editeddate = new Date(editedtransaction[sorteeditedtransactions[i]]);
                            if (editeddate.getTime() === olddate.getTime()) { } //To check whether dates are equal, dates must be converted to their primitives:
                            else                            
                                transaction[sorteeditedtransactions[i]] = editedtransaction[sorteeditedtransactions[i]];
                        }
                    }
                    else if (typeof (editedtransaction[sorteeditedtransactions[i]]) === 'boolean') {
                        transaction[sorteeditedtransactions[i]] = editedtransaction[sorteeditedtransactions[i]];
                    }
                    else if (typeof (editedtransaction[sorteeditedtransactions[i]]) === 'undefined') {
                        transaction[sorteeditedtransactions[i]] = editedtransaction[sorteeditedtransactions[i]];
                    }
                }
            }
            return transaction;
        }
    }
})();
