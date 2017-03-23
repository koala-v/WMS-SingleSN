appControllers.controller( 'PickingListCtrl', [ '$scope', '$stateParams', '$state', 'ApiService',
    function( $scope, $stateParams, $state, ApiService ) {
        $scope.rcbp1 = {};
        $scope.GinNo = {};
        $scope.Imgi1s = {};
        $scope.refreshRcbp1 = function( BusinessPartyName ) {
            if ( is.not.undefined( BusinessPartyName ) && is.not.empty( BusinessPartyName ) ) {
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
        $scope.ShowImgi1 = function( CustomerCode ) {
            var strUri = '/api/wms/imgi1?CustomerCode=' + CustomerCode;
            ApiService.GetParam( strUri, true ).then( function success( result ) {
                $scope.Imgi1s = result.data.results;
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
                $state.go( 'pickingDetail', {
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
    }
] );

appControllers.controller( 'PickingDetailCtrl', [ 'ENV', '$scope', '$stateParams', '$state', '$timeout', '$ionicHistory', '$ionicPopup', '$ionicModal', '$ionicLoading', '$cordovaToast', '$cordovaBarcodeScanner', 'ApiService',
    function( ENV, $scope, $stateParams, $state, $timeout, $ionicHistory, $ionicPopup, $ionicModal, $ionicLoading, $cordovaToast, $cordovaBarcodeScanner, ApiService ) {
        var alertPopup = null,
            alertTitle = '';
        var hmImgi2 = new HashMap();
        var hmImsn1 = new HashMap();
        $scope.Detail = {
            Customer: $stateParams.CustomerCode,
            GIN: $stateParams.GoodsIssueNoteNo,
            Scan: {
                StoreNo: '',
                SerialNo: '',
                PackingNo: '',
                Qty: 0
            },
            Impa1: {},
            Imgi2: {
                RowNum: 0,
                TrxNo: 0,
                LineItemNo: 0,
                StoreNo: '',
                ProductCode: '',
                ProductDescription: '',
                Qty: 0,
                QtyBal: 0
            },
            Imgi2s: {},
            Imgi2sDb: {},
            Imsn1s: {},
            blnNext: true,
            blnUpdatePakcingNo: false
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
        var showPopup = function( title, type, callback ) {
            if ( alertPopup != null ) {
                alertPopup.close();
                alertPopup = null;
            }
            alertPopup = $ionicPopup.alert( {
                title: title,
                okType: 'button-' + type
            } );
            if ( typeof( callback ) == 'function' ) callback( alertPopup );
        };
        var blnVerifyInput = function( type ) {
            var blnPass = true;
            if ( is.equal( type, 'StoreNo' ) ) {
                if ( !is.equal( $scope.Detail.Scan.StoreNo, $scope.Detail.Imgi2.StoreNo ) ) {
                    showPopup( 'Invalid Store No', 'assertive' );
                    blnPass = false;
                }
            } else if ( is.equal( type, 'SerialNo' ) ) {
                if ( !is.equal( $scope.Detail.Scan.SerialNo.toLowerCase(), $scope.Detail.Imgi2.SerialNo.toLowerCase() ) ) {
                    showPopup( 'Invalid Serial No', 'assertive' );
                    blnPass = false;
                }
            }
            return blnPass;
        };
        var onErrorConfirm = function() {
            var checkPopup = $ionicPopup.show( {
                title: 'Discrepancies on Qty',
                buttons: [ {
                    text: '<b>Check</b>',
                    type: 'button-assertive',
                    onTap: function( e ) {
                        checkPopup.close();
                        $scope.openModal();
                    }
                } ]
            } );
        };
        var updatePackingNo = function( callback ) {
            db_query_Imgi2_Picking( function( imgi2s ) {
                var strUri = '/api/wms/imgi2/update/packingno',
                    jsonData = {
                        'Imgi2s': imgi2s
                    };
                ApiService.Post( strUri, jsonData, true ).then( function success( result ) {
                    if ( result.data.results > -1 ) {
                        if ( is.function( callback ) ) callback();
                    }
                } );
            } );
        };
        var sendConfirm = function() {
            var userID = sessionStorage.getItem( 'UserId' ).toString(),
                strUri = '/api/wms/imgi1/complete?GoodsIssueNoteNo=' + $scope.Detail.GIN + '&UserID=' + userID;
            ApiService.GetParam( strUri, true ).then( function success( result ) {
                showPopup( 'Confirm success', 'calm', function( popup ) {
                    $timeout( function() {
                        popup.close();
                        $scope.returnList();
                    }, 2500 );
                } );
            } );
        };
        var setScanQty = function( serialno, imgi2 ) {
            imgi2.ScanQty += 1;
            hmImgi2.remove( serialno );
            hmImgi2.set( serialno, imgi2 );
            db_update_Imgi2_Picking( imgi2 );
            $scope.Detail.Scan.Qty = imgi2.ScanQty;
            $scope.Detail.Scan.SerialNo = '';
            $scope.Detail.Imgi2.QtyBal = imgi2.Qty - imgi2.ScanQty;
            if ( is.equal( imgi2.Qty, imgi2.ScanQty ) ) {
                $scope.showNext();
            }
        };
        var showImpr = function( serialno ) {
            if ( hmImgi2.has( serialno ) ) {
                var imgi2 = hmImgi2.get( serialno );
                setScanQty( serialno, imgi2 );
                $scope.$apply();
            } else {
                showPopup( 'Invalid Serial No', 'assertive' );
            }
        };
        var showImgi2 = function( row ) {
            if ( row != null && $scope.Detail.Imgi2s.length >= row ) {
                $scope.Detail.Imgi2 = {
                    RowNum: $scope.Detail.Imgi2s[ row ].RowNum,
                    TrxNo: $scope.Detail.Imgi2s[ row ].TrxNo,
                    LineItemNo: $scope.Detail.Imgi2s[ row ].LineItemNo,
                    StoreNo: $scope.Detail.Imgi2s[ row ].StoreNo,
                    ProductTrxNo: $scope.Detail.Imgi2s[ row ].ProductTrxNo,
                    ProductCode: $scope.Detail.Imgi2s[ row ].ProductCode,
                    ProductDescription: $scope.Detail.Imgi2s[ row ].ProductDescription,
                    SerialNo: $scope.Detail.Imgi2s[ row ].SerialNo,
                    PackingNo: $scope.Detail.Imgi2s[ row ].PackingNo,
                    Qty: $scope.Detail.Imgi2s[ row ].Qty,
                    QtyBal: $scope.Detail.Imgi2s[ row ].Qty - $scope.Detail.Imgi2s[ row ].ScanQty
                };
                $scope.Detail.Scan.Qty = $scope.Detail.Imgi2s[ row ].ScanQty;
            }
            if ( is.equal( row, $scope.Detail.Imgi2s.length - 1 ) ) {
                $scope.Detail.blnNext = false;
            } else {
                $scope.Detail.blnNext = true;
            }
        };
        var GetImpa1 = function( GoodsIssueNoteNo ) {
            var strUri = '/api/wms/impa1';
            ApiService.Get( strUri, true ).then( function success( result ) {
                $scope.Detail.Impa1 = result.data.results[ 0 ];
                GetImgi2s( $scope.Detail.GIN );
            } );
        };
        var GetImgi2s = function( GoodsIssueNoteNo ) {
            var strUri = '/api/wms/imgi2/picking?GoodsIssueNoteNo=' + GoodsIssueNoteNo;
            ApiService.GetParam( strUri, true ).then( function success( result ) {
                $scope.Detail.Imgi2s = result.data.results;
                db_del_Imgi2_Picking();
                if ( is.array( $scope.Detail.Imgi2s ) && is.not.empty( $scope.Detail.Imgi2s ) ) {
                    for ( var i in $scope.Detail.Imgi2s ) {
                        hmImgi2.set( $scope.Detail.Imgi2s[ i ].SerialNo.toLowerCase(), $scope.Detail.Imgi2s[ i ] );
                        db_add_Imgi2_Picking( $scope.Detail.Imgi2s[ i ] );
                    }
                    showImgi2( 0 );
                } else {
                    showPopup( 'This GIN has no Products', 'calm', function( popup ) {
                        $timeout( function() {
                            popup.close();
                            $scope.returnList();
                        }, 2500 );
                    } );
                }
            } );
        };
        GetImpa1();
        //var GetImsn1SerialNo = function(GoodsIssueNoteNo) {
        //    var strUri = '/api/wms/imsn1?GoodsIssueNoteNo=' + GoodsIssueNoteNo;
        //    ApiService.GetParam(strUri, true).then(function success(result) {
        //        $scope.Detail.Imsn1s = result.data.results;
        //        db_del_Imsn1_Picking();
        //        if (is.array($scope.Detail.Imsn1s) && is.not.empty($scope.Detail.Imsn1s)) {
        //            for (var i = 0; i < $scope.Detail.Imsn1s.length; i++) {
        //                hmImsn1.set($scope.Detail.Imsn1s[i].IssueNoteNo + "#" + $scope.Detail.Imsn1s[i].IssueLineItemNo, Imsn1.SerialNo);
        //                db_add_Imsn1_Picking($scope.Detail.Imsn1s[i]);
        //            }
        //        }
        //    });
        //};
        //GetImsn1SerialNo($scope.Detail.GIN);
        $scope.openModal = function() {
            $scope.modal.show();
            $ionicLoading.show();
            db_query_Imgi2_Picking( function( results ) {
                $scope.Detail.Imgi2sDb = results;
                $ionicLoading.hide();
            } );
        };
        $scope.closeModal = function() {
            $scope.Detail.Imgi2sDb = {};
            $scope.modal.hide();
        };
        $scope.returnList = function() {
            $state.go( 'pickingList', {}, {
                reload: true
            } );
        };
        $scope.changePackingNo = function() {
            if ( hmImgi2.count() > 0 ) {
                var imgi2 = hmImgi2.get( $scope.Detail.Imgi2.SerialNo.toLowerCase() );
                var promptPopup = $ionicPopup.show( {
                    template: '<input type="text" ng-model="Detail.Imgi2.PackingNo">',
                    title: 'Enter Packing No',
                    subTitle: 'Are you sure to change Packing No manually?',
                    scope: $scope,
                    buttons: [ {
                        text: 'Cancel'
                    }, {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function( e ) {
                            blnUpdatePakcingNo = true;
                            imgi2.PackingNo = $scope.Detail.Imgi2.PackingNo;
                            db_update_Imgi2_Picking( imgi2 );
                        }
                    } ]
                } );
            }
        };
        $scope.changeQty = function() {
            if ( hmImgi2.count() > 0 ) {
                var imgi2 = hmImgi2.get( $scope.Detail.Imgi2.SerialNo.toLowerCase() );
                var promptPopup = $ionicPopup.show( {
                    template: '<input type="number" ng-model="Detail.Scan.Qty">',
                    title: 'Enter Qty',
                    subTitle: 'Are you sure to change Qty manually?',
                    scope: $scope,
                    buttons: [ {
                        text: 'Cancel'
                    }, {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function( e ) {
                            imgi2.ScanQty = $scope.Detail.Scan.Qty;
                            $scope.Detail.Imgi2.QtyBal = imgi2.Qty - imgi2.ScanQty;
                            db_update_Imgi2_Picking( imgi2 );
                            if ( is.equal( imgi2.Qty, imgi2.ScanQty ) ) {
                                $scope.showNext();
                            }
                        }
                    } ]
                } );
            }
        };
        $scope.openCam = function( type ) {
            if ( is.equal( type, 'StoreNo' ) ) {
                $cordovaBarcodeScanner.scan().then( function( imageData ) {
                    $scope.Detail.Scan.StoreNo = imageData.text;
                }, function( error ) {
                    $cordovaToast.showShortBottom( error );
                } );
            } else if ( is.equal( type, 'PackingNo' ) ) {
                $cordovaBarcodeScanner.scan().then( function( imageData ) {
                    $scope.Detail.Scan.PackingNo = imageData.text;
                }, function( error ) {
                    $cordovaToast.showShortBottom( error );
                } );
            } else if ( is.equal( type, 'BarCode' ) ) {
                $cordovaBarcodeScanner.scan().then( function( imageData ) {
                    $scope.Detail.Scan.BarCode = imageData.text;
                    showImpr( $scope.Detail.Scan.BarCode );
                }, function( error ) {
                    $cordovaToast.showShortBottom( error );
                } );
            } else if ( is.equal( type, 'SerialNo' ) ) {
                //if ($('#txt-sn').attr("readonly") != "readonly") {
                $cordovaBarcodeScanner.scan().then( function( imageData ) {
                    $scope.Detail.Scan.SerialNo = imageData.text;
                    showSn( $scope.Detail.Scan.SerialNo );
                }, function( error ) {
                    $cordovaToast.showShortBottom( error );
                } );
                //}
            }
        };
        $scope.clearInput = function( type ) {
            if ( is.equal( type, 'SerialNo' ) ) {
                if ( is.not.empty( $scope.Detail.Scan.SerialNo ) ) {
                    $scope.Detail.Scan.SerialNo = '';
                    $( '#txt-sn' ).select();
                }
            } else if ( is.equal( type, 'StoreNo' ) ) {
                if ( is.not.empty( $scope.Detail.Scan.StoreNo ) ) {
                    $scope.Detail.Scan.StoreNo = '';
                    $( '#txt-storeno' ).select();
                }
            } else if ( is.equal( type, 'PackingNo' ) ) {
                if ( is.not.empty( $scope.Detail.Scan.PackingNo ) ) {
                    $scope.Detail.Scan.PackingNo = '';
                    $( '#txt-packingno' ).select();
                }
            } else {
                $scope.Detail.Scan = {
                    StoreNo: '',
                    PackingNo: '',
                    SerialNo: '',
                    Qty: 0
                };
                $( '#txt-storeno' ).select();
            }
        };
        $scope.showPrev = function() {
            var intRow = $scope.Detail.Imgi2.RowNum - 1;
            if ( $scope.Detail.Imgi2s.length > 0 && intRow > 0 && is.equal( $scope.Detail.Imgi2s[ intRow - 1 ].RowNum, intRow ) ) {
                $scope.clearInput();
                showImgi2( intRow - 1 );
            } else {
                showPopup( 'Already the first one', 'calm' );
            }
        }
        $scope.showNext = function() {
            var intRow = $scope.Detail.Imgi2.RowNum + 1;
            if ( $scope.Detail.Imgi2s.length > 0 && $scope.Detail.Imgi2s.length >= intRow && is.equal( $scope.Detail.Imgi2s[ intRow - 1 ].RowNum, intRow ) ) {
                $scope.clearInput();
                showImgi2( intRow - 1 );
            } else {
                showPopup( 'Already the last one', 'calm' );
            }
        }
        $scope.checkConfirm = function() {
            $ionicLoading.show();
            if ( dbWms ) {
                dbWms.transaction( function( tx ) {
                    dbSql = 'Select * from Imgi2_Picking';
                    tx.executeSql( dbSql, [], function( tx, results ) {
                        var len = results.rows.length;
                        if ( len > 0 ) {
                            var blnDiscrepancies = false;
                            for ( var i = 0; i < len; i++ ) {
                                var imgi2 = results.rows.item( i );
                                if ( is.not.empty( imgi2.SerialNo ) ) {
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
                                onErrorConfirm();
                            } else {
                                if ( blnUpdatePakcingNo ) {
                                    updatePackingNo( sendConfirm() );
                                } else {
                                    sendConfirm();
                                }
                            }
                        } else {
                            $ionicLoading.hide();
                            onErrorConfirm();
                        }
                    }, dbError )
                } );
            }
        };
        $( '#txt-storeno' ).on( 'keydown', function( e ) {
            if ( e.which === 9 || e.which === 13 ) {
                if ( alertPopup === null ) {
                    if ( blnVerifyInput( 'StoreNo' ) ) {
                        $( '#txt-sn' ).focus();
                    }
                } else {
                    alertPopup.close();
                    alertPopup = null;
                }
            }
        } );
        $( '#txt-sn' ).on( 'keydown', function( e ) {
            if ( e.which === 9 || e.which === 13 ) {
                if ( alertPopup === null ) {
                    if ( blnVerifyInput( 'SerialNo' ) ) {
                        showImpr( $scope.Detail.Scan.SerialNo.toLowerCase() );
                    }
                } else {
                    alertPopup.close();
                    alertPopup = null;
                }
            }
        } );
    }
] );
