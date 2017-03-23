var appFactory = angular.module('WMSAPP.factories', []);

appFactory.factory('TABLE_DB', function () {
    var TABLE_DB = {
        // Imgr2_Receipt: {
        //     TrxNo: 'INT',
        //     LineItemNo: 'INT',
        //     ProductTrxNo: 'INT',
        //     GoodsReceiptNoteNo: 'TEXT',
        //     ProductCode: 'TEXT',
        //     ProductDescription: 'TEXT',
        //     UserDefine1: 'TEXT',
        //     SerialNoFlag: 'TEXT',
        //     BarCode: 'TEXT',
        //     BarCode1: 'TEXT',
        //     BarCode2: 'TEXT',
        //     BarCode3: 'TEXT',
        //     DimensionFlag: 'TEXT',
        //     PackingQty: 'INT',
        //     WholeQty: 'INT',
        //     LooseQty: 'INT',
        //     ScanQty: 'INT',
        //     QtyStatus: 'TEXT',
        //     CustomerCode: 'TEXT'
        // },
        // Imsn1_Receipt: {
        //     ReceiptNoteNo: 'TEXT',
        //     ReceiptLineItemNo: 'INT',
        //     IssueNoteNo: 'TEXT',
        //     IssueLineItemNo: 'INT',
        //     SerialNo: 'TEXT'
        // },
        // Imgr2_Putaway: {
        //     ProductIndex: 'INT',
        //     TrxNo: 'INT',
        //     LineItemNo: 'INT',
        //     DefaultStoreNo: 'TEXT',
        //     StoreNo: 'TEXT',
        //     StagingAreaFlag: 'TEXT',
        //     ProductTrxNo: 'INT',
        //     ProductCode: 'TEXT',
        //     ProductDescription: 'TEXT',
        //     UserDefine1: 'TEXT',
        //     NewBarCode: 'TEXT',
        //     BarCode: 'TEXT',
        //     BarCode1: 'TEXT',
        //     BarCode2: 'TEXT',
        //     BarCode3: 'TEXT',
        //     DimensionFlag: 'TEXT',
        //     GoodsReceiptNoteNo: 'TEXT',
        //     PackingQty: 'INT',
        //     WholeQty: 'INT',
        //     LooseQty: 'INT',
        //     Qty: 'INT',
        //     ActualQty: 'INT',
        //     SerialNoFlag: 'TEXT',
        //     ScanQty: 'INT',
        //     QtyName: 'TEXT',
        //     QtyStatus: 'TEXT',
        //     NewFlag: 'TEXT'
        // },
        // Imsn1_Putaway: {
        //     ReceiptNoteNo: 'TEXT',
        //     ReceiptLineItemNo: 'INT',
        //     IssueNoteNo: 'TEXT',
        //     IssueLineItemNo: 'INT',
        //     SerialNo: 'TEXT'
        // },
        // Imgr2_Transfer: {
        //     TrxNo: 'INT',
        //     LineItemNo: 'INT',
        //     StoreNo: 'TEXT',
        //     StoreNoFrom: 'TEXT',
        //     StoreNoTo: 'TEXT',
        //     ProductTrxNo: 'INT',
        //     ProductCode: 'TEXT',
        //     ProductDescription: 'TEXT',
        //     SerialNoFlag: 'TEXT',
        //     BarCode: 'TEXT',
        //     BarCode1: 'TEXT',
        //     BarCode2: 'TEXT',
        //     BarCode3: 'TEXT',
        //     ScanQtyFrom: 'INT',
        //     ScanQtyTo: 'INT',
        //     QtyStatus: 'TEXT'
        // },
        // Imsn1_Transfer: {
        //     ReceiptNoteNo: 'TEXT',
        //     ReceiptLineItemNo: 'INT',
        //     IssueNoteNo: 'TEXT',
        //     IssueLineItemNo: 'INT',
        //     SerialNo: 'TEXT',
        //     QtyStatus: 'TEXT'
        // },
        // Imgi2_Picking: {
        //     RowNum: 'INT',
        //     TrxNo: 'INT',
        //     LineItemNo: 'INT',
        //     StoreNo: 'TEXT',
        //     PackingNo: 'TEXT',
        //     ProductTrxNo: 'INT',
        //     ProductCode: 'TEXT',
        //     ProductDescription: 'TEXT',
        //     SerialNoFlag: 'TEXT',
        //     SerialNo: 'TEXT',
        //     BarCode: 'TEXT',
        //     BarCode1: 'TEXT',
        //     BarCode2: 'TEXT',
        //     BarCode3: 'TEXT',
        //     Qty: 'INT',
        //     ScanQty: 'INT',
        //     QtyBal: 'INT',
        //     ReceiptMovementTrxNo: 'INT',
        //     QtyStatus: 'TEXT',
        //     DimensionFlag: 'TEXT',
        //     QtyName:'TEXT'
        // },
        // Imsn1_Picking: {
        //     ReceiptNoteNo: 'TEXT',
        //     ReceiptLineItemNo: 'INT',
        //     IssueNoteNo: 'TEXT',
        //     IssueLineItemNo: 'INT',
        //     SerialNo: 'TEXT'
        // },
        // Imgi2_Verify: {
        //     RowNum: 'INT',
        //     TrxNo: 'INT',
        //     LineItemNo: 'INT',
        //     ProductTrxNo: 'INT',
        //     ProductCode: 'TEXT',
        //     ProductDescription: 'TEXT',
        //     StoreNo: 'TEXT',
        //     SerialNoFlag: 'TEXT',
        //     SerialNo: 'TEXT',
        //     BarCode: 'TEXT',
        //     BarCode1: 'TEXT',
        //     BarCode2: 'TEXT',
        //     BarCode3: 'TEXT',
        //     Qty: 'INT',
        //     ScanQty: 'INT',
        //     QtyBal: 'INT',
        //     QtyStatus: 'TEXT'
        // },
        // Imsn1_Verify: {
        //     ReceiptNoteNo: 'TEXT',
        //     ReceiptLineItemNo: 'INT',
        //     IssueNoteNo: 'TEXT',
        //     IssueLineItemNo: 'INT',
        //     SerialNo: 'TEXT'
        // },
        // Imgi3_Picking: {
        //     LineItemNo: 'INT',
        //     PackingNo: 'TEXT',
        //     Qty: 'INT',
        //     ProductCode: 'TEXT',
        //     ProductTrxNo: 'INT',
        //     TrxNo: 'INT',
        //     UomCode: 'TEXT',
        //     ProductDescription: 'TEXT',
        //     DimensionFlag: 'TEXT',
        //     RowNumber: 'INT'
        // },
        Imcc2_CycleCount: {
            RowNum: 'INT',
            TrxNo: 'INT',
            LineItemNo: 'INT',
            WarehouseCode: 'TEXT',
            StoreNo: 'TEXT',
            ProductTrxNo: 'INT',
            CustomerCode: 'TEXT',
            Description: 'TEXT',
            PackingQtyTempValue: 'TEXT',
            WholeQtyTempValue: 'TEXT',
            LooseQtyTempValue: 'TEXT',
            DimensionFlag: 'TEXT',
            PackingUomCode: 'TEXT',
            LooseUomCode: 'TEXT',
            WholeUomCode: 'TEXT',
            ProductCode: 'TEXT',
            UserId: 'TEXT'
        }
    };
    return TABLE_DB;
});