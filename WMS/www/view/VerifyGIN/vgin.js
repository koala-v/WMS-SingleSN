appControllers.controller( 'VginListCtrl', [ '$scope', '$stateParams', '$state', 'ApiService',
    function( $scope, $stateParams, $state, ApiService ) {
        $scope.rcbp1 = {};
        $scope.GinNo = {};
        $scope.imgi1s = {};
        $scope.refreshRcbp1 = function( BusinessPartyName ) {
            if(is.not.undefined(BusinessPartyName) && is.not.empty(BusinessPartyName)){
                var strUri = '/api/wms/rcbp1?BusinessPartyName=' + BusinessPartyName;
                ApiService.GetParam( strUri, false ).then( function success( result ) {
                    $scope.Rcbp1s = result.data.results;
                } );
            }
        };
        $scope.refreshGinNos = function( Grn ) {
            var strUri = '/api/wms/imgi1?GoodsIssueNoteNo=' + Grn;
            ApiService.GetParam( strUri, true ).then( function success( result ) {
                $scope.GinNos = result.data.results;
            } );
        };
        $scope.ShowImgi1 = function( Customer ) {
            var strUri = '/api/wms/imgi1?CustomerCode=' + Customer;
            ApiService.GetParam( strUri, true ).then( function success( result ) {
                $scope.imgi1s = result.data.results;
                if ( window.cordova && window.cordova.plugins.Keyboard ) {
                    cordova.plugins.Keyboard.close();
                }
                $( '#div-vgin-list' ).focus();
            } );
        };
        $scope.showDate = function( utc ) {
            return moment( utc ).format( 'DD-MMM-YYYY' );
        };
        $scope.GoToDetail = function( Imgi1 ) {
            if ( Imgi1 != null ) {
                $state.go( 'vginDetail', {
                    'CustomerCode': Imgi1.CustomerCode,
                    'TrxNo': Imgi1.TrxNo,
                    'GoodsIssueNoteNo': Imgi1.GoodsIssueNoteNo
                }, {
                    reload: true
                } );
            }
        };
        $scope.returnMain = function() {
            $state.go( 'index.main', {}, {
                reload: true
            } );
        };
        $( '#div-list-rcbp' ).on( 'focus', ( function() {
            if ( window.cordova && window.cordova.plugins.Keyboard ) {
                cordova.plugins.Keyboard.close();
            }
        } ) );
        $( '#div-list-rcbp' ).focus();
    } ] );

appControllers.controller( 'VginDetailCtrl', [ '$scope', '$stateParams', '$state', '$timeout', '$ionicHistory', '$ionicLoading', '$ionicModal', '$ionicPopup', '$cordovaToast', '$cordovaBarcodeScanner', 'ApiService',
    function( $scope, $stateParams, $state, $timeout, $ionicHistory, $ionicLoading, $ionicModal, $ionicPopup, $cordovaToast, $cordovaBarcodeScanner, ApiService ) {
        var alertPopup = null,
            alertTitle = '',
            hmImgi2 = new HashMap(),
            hmImsn1 = new HashMap();
        $scope.Detail = {
            Customer:$stateParams.CustomerCode,
            GIN:$stateParams.GoodsIssueNoteNo,
            Scan:{
                SerialNo:'',
                QtyBal:0,
                Qty:0,
            },
            Imgi2: {
                RowNum: 0,
                TrxNo: 0,
                LineItemNo: 0,
                StoreNo: '',
                SerialNo: '',
                ProductCode: '',
                ProductDescription: '',
                Qty: 0,
                QtyBal: 0
            },
            Imgi2s:{},
            Imgi2sDb:{},
            Imsn1s:{}
        };
        $ionicModal.fromTemplateUrl( 'scan.html', {
            scope: $scope,
            animation: 'slide-in-up'
        } ).then( function( modal ) {
            $scope.modal = modal;
        } );
        $scope.$on( '$destroy', function() {
            $scope.modal.remove();
        } );
        var showPopup = function( title, type, callback ){
            if (alertPopup != null) {
                alertPopup.close();
                alertPopup = null;
            }
            alertPopup = $ionicPopup.alert( {
                title: title,
                okType: 'button-' + type
            } );
            alertPopup.then(function(res){
                if( typeof(callback) == 'function') callback(res);
            });
        };
        var sendConfirm = function() {
            var userID = sessionStorage.getItem( 'UserId' ).toString(),
                strUri = '/api/wms/imgi1/confirm?GoodsIssueNoteNo=' + $scope.Detail.GIN + '&UserID=' + userID;
            ApiService.GetParam( strUri, true ).then( function success( result ) {
                showPopup('Confirm success', 'calm', function(res){
                    $scope.returnList();
                });
            } );
        };
        var setScanQty = function( serialno, imgi2  ) {
            imgi2.ScanQty += 1;
            hmImgi2.remove( serialno );
            hmImgi2.set( serialno, imgi2 );
            db_update_Imgi2_Verify(imgi2);
            $scope.Detail.Scan.Qty = imgi2.ScanQty;
            $scope.Detail.Scan.SerialNo = '';
            $scope.Detail.Imgi2.QtyBal = imgi2.Qty - imgi2.ScanQty;
        };
        var showImpr = function( serialno ) {
            if ( hmImgi2.has( serialno ) ) {
                var imgi2 = hmImgi2.get( serialno );
                setScanQty( serialno, imgi2 );
            } else {
                showPopup('Wrong Serial No','assertive');
            }
            $scope.$apply();
        };
        var GetImgi2 = function( GoodsIssueNoteNo ) {
            var strUri = '/api/wms/imgi2/verify?GoodsIssueNoteNo=' + GoodsIssueNoteNo;
            ApiService.GetParam( strUri, true ).then( function success( result ) {
                $scope.Detail.Imgi2s = result.data.results;
                db_del_Imgi2_Verify();
                if ( is.array($scope.Detail.Imgi2s) && is.not.empty($scope.Detail.Imgi2s)) {
                    for ( var i = 0; i < $scope.Detail.Imgi2s.length; i++ ) {
                        hmImgi2.set($scope.Detail.Imgi2s[i].SerialNo.toLowerCase(), $scope.Detail.Imgi2s[i]);
                        db_add_Imgi2_Verify( $scope.Detail.Imgi2s[ i ] );
                    }
                } else {
                    showPopup('This GIN has no Products','calm',function(res){
                        $scope.returnList();
                    });
                }
            } );

        };
        GetImgi2( $scope.Detail.GIN );
        $scope.openModal = function() {
            $scope.modal.show();
            $ionicLoading.show();
            db_query_Imgi2_Verify(function(results){
                $scope.Detail.Imgi2sDb = results;
                $ionicLoading.hide();
            });
        };
        $scope.closeModal = function() {
            $scope.Detail.Imgi2sDb = {};
            $scope.modal.hide();
        };
        $scope.changeQty = function() {
            if ( hmImgi2.count()>0 ) {
                var imgi2 = hmImgi2.get( $scope.Detail.Imgi2.SerialNo.toLowerCase() );
                var promptPopup = $ionicPopup.show( {
                    template: '<input type="number" ng-model="Detail.Scan.Qty">',
                    title: 'Enter Qty',
                    subTitle: 'Are you sure to change Qty manually?',
                    scope: $scope,
                    buttons: [
                        {
                            text: 'Cancel'
                        },
                        {
                            text: '<b>Save</b>',
                            type: 'button-positive',
                            onTap: function( e ) {
                                imgi2.ScanQty = $scope.Detail.Scan.Qty;
                                $scope.Detail.Imgi2.QtyBal = imgi2.Qty - imgi2.ScanQty;
                                db_update_Imgi2_Verify(imgi2);
                            }
                      }
                    ]
                } );
            }
        };
        $scope.returnList = function() {
            $state.go( 'vginList', {}, {
                reload: true
            } );
        };
        $scope.openCam = function(type) {
            if(is.equal(type,'SerialNo')){
                //if ($('#txt-sn').attr("readonly") != "readonly") {
                    $cordovaBarcodeScanner.scan().then(function(imageData) {
                        $scope.Detail.Scan.SerialNo = imageData.text;
                        showSn($scope.Detail.Scan.SerialNo);
                    }, function(error) {
                        $cordovaToast.showShortBottom(error);
                    });
                //}
            }
        };
        $scope.clearInput = function(type) {
            if(is.equal(type,'SerialNo')){
                if ($scope.Detail.Scan.SerialNo.length > 0) {
                    $scope.Detail.Scan.SerialNo = "";
                    $('#txt-sn').select();
                }
            } else {
                $scope.Detail.Scan.SerialNo = '';
                $scope.Detail.Scan.Qty = 0;
                //$('#txt-sn').attr('readonly', true);
                $('#txt-storeno').select();
            }
        };
        $scope.checkConfirm = function() {
            $ionicLoading.show();
            if ( dbWms ) {
                dbWms.transaction( function( tx ) {
                    dbSql = 'Select * from Imgi2_Verify';
                    tx.executeSql( dbSql, [], function( tx, results ) {
                        var len = results.rows.length;
                        if ( len > 0 ) {
                            var blnDiscrepancies = false;
                            for ( var i = 0; i < len; i++ ) {
                                var imgi2 = results.rows.item( i );
                                if ( is.not.empty(imgi2.SerialNo) ) {
                                    if ( imgi2.Qty != imgi2.ScanQty ) {
                                        console.log( 'Product (' + imgi2.ProductCode + ') Qty not equal.' );
                                        blnDiscrepancies = true;
                                    }
                                } else {
                                    blnDiscrepancies = true;
                                }
                            }
                            $ionicLoading.hide();
                            if ( blnDiscrepancies ) {
                                showPopup('Discrepancies on Qty','assertive',function(popup){
                                    $timeout( function() {
                                        popup.close();
                                        $scope.openModal();
                                    }, 2500 );
                                });
                            } else {
                                sendConfirm();
                            }
                        }
                        else{
                            $ionicLoading.hide();
                            showPopup('Discrepancies on Qty','assertive',function(popup){
                                $timeout( function() {
                                    popup.close();
                                    $scope.openModal();
                                }, 2500 );
                            });
                        }
                    }, dbError )
                } );
            }
        };
        $( '#txt-sn' ).on( 'keydown', function( e ) {
            if ( e.which === 9 || e.which === 13 ) {
                if (alertPopup === null) {
                    showImpr( $scope.Detail.Scan.SerialNo.toLowerCase() );
                } else {
                    alertPopup.close();
                    alertPopup = null;
                }
            }
        } );
    } ] );
