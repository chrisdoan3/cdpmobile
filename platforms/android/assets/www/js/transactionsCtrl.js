// Written    : 6/9/2016
// Last Update: 6/19/2016
'use strict';
angular.module('starter.controllers')
.service('transactionservice', function ($http, API_CONFIG, UtilitiesService, commonservice, $httpParamSerializerJQLike) {
    this.gettransactions = function (startrecord, numrecords, jwt) {
        var odatatransactionsfilter = localStorage.getItem('odatatransactionsfilter');
        var urisearch = undefined;
        if (odatatransactionsfilter == null || odatatransactionsfilter == 'undefined')
            urisearch = API_CONFIG.odata + "/transactions?$expand=TransactionCategory,Transaction_Type&$count=true&$top=" + numrecords + "&$skip=" + startrecord + "&$orderby=TranDate desc";
        else
            urisearch = API_CONFIG.odata + "/transactions?$expand=TransactionCategory,Transaction_Type&$filter=" + odatatransactionsfilter + "&$count=true&$top=" + numrecords + "&$skip=" + startrecord + "&$orderby=TranDate desc";
        var resp = $http({
            url: urisearch,
            //url: API_CONFIG.odata + "/transactions?$expand=TransactionCategory,Transaction_Type&$count=true&$top=" + numrecords + "&$skip=" + startrecord + "&$orderby=TranDate desc",
            method: "GET",
            headers: { 'Authorization': 'Bearer ' + jwt }
        });
        return resp;
    };

    this.updatetransaction = function (id, oldtransaction, editedtransaction, jwt) {
        var transaction = {};
        transaction = UtilitiesService.getChangeElements(oldtransaction, editedtransaction);
        if (UtilitiesService.isObjectEmpty(transaction)) {
            MessagingHelperService.displayToast('warning', 'Nothing to save!', 1);
        }
        else {
            var resp = $http({
                url: API_CONFIG.odata + "/transactions(" + id + ')',
                method: "PATCH",
                //data: JSON.stringify(Transaction),
                data: transaction,
                headers: {
                    'Authorization': 'Bearer ' + jwt
                }
            });
            return resp;
        }
    };

    this.gettransactiontypes = function () {
        var resp = $http({
            url: API_CONFIG.odata + "/Transaction_Type",
            method: "GET"
        });
        return resp;
    }

    this.getcategories = function () {
        var resp = $http({
            url: API_CONFIG.odata + "/TransactionCategories",
            method: "GET"
        });
        return resp;
    }
})
.controller('TransactionsCtrl', ['$scope', '$q', 'commonservice', 'transactionservice', '$timeout', '$ionicLoading', '$ionicModal', '$cordovaDatePicker', 'ionicDatePicker',
                        function ($scope, $q, commonservice, transactionservice, $timeout, $ionicLoading, $ionicModal, $cordovaDatePicker, ionicDatePicker) {
        var vm = this;

        vm.pagesize = localStorage.getItem('transactionpagesize') || 10;
        vm.searchstring = localStorage.getItem('transactionsfilter');

        vm.settingsList = JSON.parse(localStorage.getItem('settingsList'));
        if (vm.settingsList == undefined) {
            vm.settingsList = [
              { text: "Use Native Datepicker", checked: true },
              { text: "Transactions Per Page", value: '10' },
            ];
        }

        function desktopDatePicker() {
            var ipObj1 = {
                callback: function (val) {
                    console.log('Return value from the datepicker popup is : ' + val, new Date(val));
                    vm.transactions[vm.transactionindex].TranDate = new Date(val);
                }
            };
            ionicDatePicker.openDatePicker(ipObj1);
        }

        function cordovaDatePicker() {
            try {
                var options = {
                    date: new Date(),
                    mode: 'date', // or 'time'
                    minDate: new Date() - 10000,
                    allowOldDates: true,
                    allowFutureDates: true,
                    doneButtonLabel: 'DONE',
                    doneButtonColor: '#F2F3F4',
                    cancelButtonLabel: 'CANCEL',
                    cancelButtonColor: '#000000'
                };
                $cordovaDatePicker.show(options).then(function (date) {
                    alert(date);
                });
            }
            catch (err) {
                alert(err);
            }
        }

        vm.openDatePicker = function () {
            if (window.cordova) {
                if (vm.settingsList[0].checked) {
                    cordovaDatePicker();
                }
                else {
                    desktopDatePicker();
                }
            }
            else {
                desktopDatePicker();
            }
        };

        $ionicModal.fromTemplateUrl('templates/edittransaction.html', {
            scope: $scope,
            //animation: 'slide-in-up'
            animation: 'animated zoomIn'
        }).then(function (modal) {
            vm.modal = modal;
        });
        vm.closeModal = function () {
            vm.modal.hide();
        };
        $scope.$on('$destroy', function () {
            vm.modal.remove();
        });
        $scope.$on('modal.hidden', function () {    // Execute action on hide modal
            // Execute action
        });
        $scope.$on('modal.removed', function () {    // Execute action on remove modal
            // Execute action
        });

        vm.expandpayee = function () {
            var element = document.getElementById("payee");
            element.style.height = element.scrollHeight + "px";
        }

        vm.expandmemo = function () {
            var element = document.getElementById("memo");
            element.style.height = element.scrollHeight + "px";
        }

        vm.updateTransaction = function () {
            var accesstoken = localStorage.getItem('accessToken');
            if (accesstoken) {
                vm.tranid = vm.transactions[vm.transactionindex].TranID;

                vm.editedtransaction = {
                    TranDate: vm.transactions[vm.transactionindex].TranDate,
                    ChkNum: vm.chknum,
                    PayeePayor: vm.transactions[vm.transactionindex].PayeePayor,
                    Amount: vm.amount == null ? null : parseFloat(vm.amount),
                    Type: vm.trantype,
                    TranCategory: vm.category,
                    Memo: vm.transactions[vm.transactionindex].Memo
                }

                var promiseupdatetransaction = transactionservice.updatetransaction(vm.tranid, vm.oldTransaction, vm.editedtransaction, accesstoken);
                promiseupdatetransaction.then(function (resp) {
                    displaytransactions().then(function () {
                        commonservice.toast('Transaction updated', 'short', 'bottom');
                    })
                }, function (err) {
                    commonservice.toast(err.data.error.innererror.message, 'long', 'bottom');
                });
            }
            else {
                commonservice.toast('Unauthorized!', 'long', 'center');
            }

            vm.modal.hide();
        };

        vm.edit = function edit(index) {
            vm.transactionindex = index;

            vm.oldTransaction = {
                TranDate: vm.transactions[vm.transactionindex].TranDate,
                ChkNum: vm.transactions[vm.transactionindex].ChkNum == null ? '' : vm.transactions[vm.transactionindex].ChkNum.toString(),
                PayeePayor: vm.transactions[vm.transactionindex].PayeePayor,
                Amount: vm.transactions[vm.transactionindex].Amount,
                Type: vm.transactions[vm.transactionindex].Type,
                TranCategory: vm.transactions[vm.transactionindex].TranCategory,
                Memo: vm.transactions[vm.transactionindex].Memo
            }

            var promisegettransactiontypes = transactionservice.gettransactiontypes();
            promisegettransactiontypes.then(function (resp) {
                vm.transactiontypes = resp.data.value;
                var promisegetcategories = transactionservice.getcategories();
                promisegetcategories.then(function (resp) {
                    vm.transactioncategories = resp.data.value;

                    vm.chknum = vm.transactions[vm.transactionindex].ChkNum;
                    vm.amount = vm.transactions[vm.transactionindex].Amount;
                    vm.trantype = vm.transactions[vm.transactionindex].Type;
                    vm.category = vm.transactions[vm.transactionindex].TransactionCategory.TransactionCategoryID;                

                    vm.payeerows = (vm.transactions[vm.transactionindex].PayeePayor.length) / 16;
                    if (vm.payeerows < 1)
                        vm.payeerows = 1;
                    vm.memorows = (vm.transactions[vm.transactionindex].Memo.length) / 16;
                    if (vm.memorows < 1)
                        vm.memorows = 1;

                    vm.modal.show();

                }, function (err) {
                    commonservice.toast(err.data.message, 'long', 'bottom');
                });
            }, function (err) {
                commonservice.toast(err.data.message, 'long', 'bottom');
            });                    
        };


        vm.onSwipeUp = function () {
            console.log('vm.onSwipeUp');
        };
        vm.onSwipeDown = function () {
            console.log('vm.onSwipeDown');
        };

        function processquery(qs) {
            var fields = qs.split('&');
            var qs = '';
            angular.forEach(fields, function (fld, index) {
                var f = fld.substring(0, 1);
                var o = fld.substring(1, 2);
                var o2 = fld.substring(1, 3);
                var v = fld.substring(2);
                switch (f) {
                    case 'p':
                        if (o == '%')
                            qs += "contains(PayeePayor,'" + v + "') eq true";
                        else
                            qs += "PayeePayor eq '" + v + "'";
                        if (index < fields.length - 1) {
                            qs += ' and ';
                        }
                        break;

                    case 'a':
                        if (o == '=')
                            qs += "(Amount eq " + v + ")";
                        else if (o == '>') {
                            if (o2 == '>=') {
                                qs += "(Amount ge " + v.substring(1) + ")";
                            }
                            else {
                                qs += "(Amount gt " + v + ")";
                            }
                            if (index < fields.length - 1) {
                                qs += ' and ';
                            }
                        }
                        else if (o == '<') {
                            if (o2 == '<=') {
                                qs += "(Amount le " + v.substring(1) + ")";
                            }
                            else {
                                qs += "(Amount lt " + v + ")";
                            }
                        }

                        break;

                    case 'm':
                        if (o == '%')
                            qs += "contains(Memo,'" + v + "') eq true";
                        else
                            qs += "Memo eq '" + v + "'";
                        if (index < fields.length - 1) {
                            qs += ' and ';
                        }
                        break;

                    default:
                        qs = 'error';
                        break;

                }
            })

            return qs;
        }

        vm.clearSearch = function () {
            vm.searchstring = '';
        }

        vm.search = function () {
            localStorage.setItem('transactionsfilter', vm.searchstring);
            console.log('vm.search');
            vm.keypressed = true;
            readytoprocessquery();
        }

        function readytoprocessquery() {
            vm.skiprecs = 0;
            var querysearch = undefined;
            if (vm.searchstring != '') {
                querysearch = processquery(vm.searchstring);
            }
            if (querysearch == 'error') {
                commonservice.toast('Unrecognized query format!', 'long', 'bottom');
            }
            else {
                localStorage.setItem('transactionsfilter', vm.searchstring);
                localStorage.setItem('odatatransactionsfilter', querysearch);
                displaytransactions();
            }
        }

        vm.checkIfEnterKeyWasPressed = function ($event) {
            var keyCode = $event.which || $event.keyCode;
            if (keyCode === 13 || vm.keypressed) {
                vm.keypressed = false;
                readytoprocessquery();
            }
        }

        function displaytransactions() {
            $ionicLoading.show({ template: 'Getting data...' });
            var promise = $q.defer();
            var accesstoken = localStorage.getItem('accessToken');
            if (accesstoken) {
                if (vm.skiprecs === undefined)
                    vm.skiprecs = 0;
                var promisegettransactions = transactionservice.gettransactions(vm.skiprecs, vm.pagesize, accesstoken);
                promisegettransactions.then(function (resp) {
                    $ionicLoading.hide();
                    vm.totalrecs = resp.data['@odata.count'];
                    if (vm.totalrecs == 0) {
                        vm.loading = false;
                        commonservice.toast('No record found!', 'short', 'bottom');
                    }
                    else {
                        vm.transactions = resp.data.value;
                        vm.loading = false;
                    }
                    promise.resolve();
                    vm.hasMoreData = true;
                }, function (err) {
                    $ionicLoading.hide();
                    vm.loading = false;
                    if (err.statusText != undefined) {
                        if (err.statusText == '') {
                            //MessagingHelperService.displayToast('error', 'Unexpected Error!', 1)
                            commonservice.toast('Unexpected Error!', 'long', 'bottom');
                        }
                        else {
                            //MessagingHelperService.displayToast('error', err.statusText, 1)
                            commonservice.toast(err.statusText, 'long', 'bottom');
                        }
                    }
                    else {
                        //MessagingHelperService.displayToast('error', err.data.message, 1)
                        commonservice.toast(err.data.message, 'long', 'bottom');
                    }
                    promise.reject();
                });
            }
            else {
                //vm.loading = false;
                //MessagingHelperService.displayToast('error', 'Please log in.');
                commonservice.toast('Please log in!', 'long', 'bottom');
            }
            return promise.promise;
        }

        function init() {
            displaytransactions();
        }

        init();

    }])
