﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using ServiceStack;
using ServiceStack.ServiceHost;
using ServiceStack.OrmLite;
using WebApi.ServiceModel.Tables;

namespace WebApi.ServiceModel.Wms
{
				[Route("/wms/imgr1", "Get")]												//imgr1?GoodsReceiptNoteNo= & CustomerCode= & StatusCode=
				[Route("/wms/imgr1/confirm", "Get")]				//confirm?TrxNo= &UserID=
				[Route("/wms/imgr2/receipt", "Get")]				//receipt?GoodsReceiptNoteNo=
				[Route("/wms/imgr2/putaway", "Get")]				//putaway?GoodsReceiptNoteNo=
				[Route("/wms/imgr2/putaway/update", "Get")]				//update?GoodsReceiptNoteNo= & TrxNo= & LineItemNo= & StoreNo= 
				[Route("/wms/imgr2/transfer", "Get")]			//transfer?TrxNo= & LineItemNo=
    public class Imgr : IReturn<CommonResponse>
    {
        public string CustomerCode { get; set; }
								public string GoodsReceiptNoteNo { get; set; }
								public string StatusCode { get; set; }
								public string TrxNo { get; set; }
								public string UserID { get; set; }
								public string StoreNo { get; set; }
								public string LineItemNo { get; set; }
    }
    public class Imgr_Logic
    {        
        public IDbConnectionFactory DbConnectionFactory { get; set; }
        public List<Imgr1> Get_Imgr1_List(Imgr request)
        {
            List<Imgr1> Result = null;
            try
            {
																using (var db = DbConnectionFactory.OpenDbConnection())
                {
                    if (!string.IsNullOrEmpty(request.CustomerCode))
                    {                       
																								if (string.IsNullOrEmpty(request.StatusCode))
																								{
																												Result = db.SelectParam<Imgr1>(
																																i => i.GoodsReceiptNoteNo != null && i.GoodsReceiptNoteNo != "" && i.StatusCode != null && i.StatusCode != "DEL" && i.StatusCode != "EXE" && i.StatusCode != "CMP" && i.CustomerCode == request.CustomerCode
																												).OrderByDescending(i => i.ReceiptDate).ToList<Imgr1>();
																								}
																								else
																								{
																												Result = db.SelectParam<Imgr1>(
																																i => i.GoodsReceiptNoteNo != null && i.GoodsReceiptNoteNo != "" && i.StatusCode == request.StatusCode && i.CustomerCode == request.CustomerCode
																												).OrderByDescending(i => i.ReceiptDate).ToList<Imgr1>();
																								}
                    }
                    else if (!string.IsNullOrEmpty(request.GoodsReceiptNoteNo))
                    {
																								if (string.IsNullOrEmpty(request.StatusCode))
																								{
																												//Result = db.SelectParam<Imgr1>(
																												//					i => i.GoodsReceiptNoteNo != null && i.GoodsReceiptNoteNo != "" && i.StatusCode != null && i.StatusCode != "DEL" && i.StatusCode != "EXE" && i.StatusCode != "CMP" && i.GoodsReceiptNoteNo.StartsWith(request.GoodsReceiptNoteNo)
																												//);
																												Result = db.Select<Imgr1>(
																																"Select Imgr1.* From Imgr1 " +
																																"Where IsNUll(StatusCode,'')<>'DEL' And IsNUll(StatusCode,'')<>'EXE' And IsNUll(StatusCode,'')<>'CMP' " +
																																"And (Select count(*) from Imgr2 Where Imgr2.TrxNo=Imgr1.TrxNo) > 0 " +
																																"And IsNUll(GoodsReceiptNoteNo,'') LIKE '" + request.GoodsReceiptNoteNo + "%'"
																												);
																								}
																								else
																								{
																												//Result = db.SelectParam<Imgr1>(
																												//					i => i.GoodsReceiptNoteNo != null && i.GoodsReceiptNoteNo != "" && i.StatusCode == request.StatusCode && i.GoodsReceiptNoteNo.StartsWith(request.GoodsReceiptNoteNo)
																												//);
																												Result = db.Select<Imgr1>(
																																"Select Imgr1.* From Imgr1 " +
																																"Where IsNUll(StatusCode,'')='" + request.StatusCode + "' " +
																																"And (Select count(*) from Imgr2 Where Imgr2.TrxNo=Imgr1.TrxNo) > 0 " +
																																"And IsNUll(GoodsReceiptNoteNo,'') LIKE '" + request.GoodsReceiptNoteNo + "%'"
																												);
																								}
                    }
                }
            }
            catch { throw; }
            return Result;
        }
								public List<Imgr2> Get_Imgr2_List(Imgr request)
								{
												List<Imgr2> Result = null;
												try
												{
																using (var db = DbConnectionFactory.OpenDbConnection())
																{
																				Result = db.Select<Imgr2>(
																								"Select " +
																								"Imgr2.TrxNo, Imgr2.LineItemNo," +
																								"IsNull(Imgr2.StoreNo,'') AS StoreNo, IsNull(Imgr2.WarehouseCode,'') AS WarehouseCode," +
																								"Imgr2.MovementTrxNo, Imgr2.ProductTrxNo," +
																								"Imgr2.ProductCode, Imgr2.DimensionFlag," +
																								"Imgr2.PackingQty, Imgr2.WholeQty, Imgr2.LooseQty," +
																								"Imgr2.Volume, Imgr2.Weight, Imgr2.SpaceArea," +
																								"Imgr2.UserDefine1 " +
																								"From Imgr2 " +
																								"Left Join Imgr1 On Imgr2.TrxNo = Imgr1.TrxNo " +
																								"Where Imgr1.GoodsReceiptNoteNo='" + request.GoodsReceiptNoteNo + "'"
																				);	
																}
												}
												catch { throw; }
												return Result;
								}
								public List<Imgr2_Receipt> Get_Imgr2_Receipt_List(Imgr request)
								{
												List<Imgr2_Receipt> Result = null;
												try
												{
																using (var db = DbConnectionFactory.OpenDbConnection())
																{
																				string strSql =
																								"Select " +
																								"Imgr2.TrxNo, Imgr2.LineItemNo, Imgr2.ProductTrxNo," +
																								"IsNull(Imgr2.ProductCode,'') AS ProductCode, IsNull(Imgr2.ProductDescription,'') AS ProductDescription," +
																								"IsNull(Imgr2.SerialNo,'') AS SerialNo, IsNull(Imgr2.DimensionFlag,'') AS DimensionFlag," +
																								"Imgr2.PackingQty, Imgr2.WholeQty, Imgr2.LooseQty," +
																								"0 AS ScanQty " +
																								"From Imgr2 " +
																								"Left Join Imgr1 On Imgr2.TrxNo = Imgr1.TrxNo " +
																								"Where Imgr1.GoodsReceiptNoteNo='" + request.GoodsReceiptNoteNo + "'";
																				Result = db.Select<Imgr2_Receipt>(strSql);
																}
												}
												catch { throw; }
												return Result;
								}
								public List<Imgr2_Putaway> Get_Imgr2_Putaway_List(Imgr request)
								{
												List<Imgr2_Putaway> Result = null;
												try
												{
																using (var db = DbConnectionFactory.OpenDbConnection())
																{
																				string strSql = "Select " +
																								"Imgr2.TrxNo, Imgr2.LineItemNo, Imgr2.ProductTrxNo," +
																								"IsNull(Imgr2.ProductCode,'') AS ProductCode, IsNull(Imgr2.ProductDescription,'') AS ProductDescription," +
																								"IsNull(Imgr2.SerialNo,'') AS SerialNo, IsNull(Imgr2.DimensionFlag,'') AS DimensionFlag," +
																								"IsNull(Imgr2.StoreNo,'') AS StoreNo," +
																								"(Select StagingAreaFlag From Whwh2 Where WarehouseCode=Imgr2.WarehouseCode And StoreNo=Imgr2.StoreNo) AS StagingAreaFlag," +
																								"Imgr2.PackingQty, Imgr2.WholeQty, Imgr2.LooseQty," +
																								"0 AS ScanQty " +
																								"From Imgr2 " +
																								"Left Join Imgr1 On Imgr2.TrxNo = Imgr1.TrxNo " +
																								"Where Imgr1.GoodsReceiptNoteNo='" + request.GoodsReceiptNoteNo + "'";
																				Result = db.Select<Imgr2_Putaway>(strSql);
																}
												}
												catch { throw; }
												return Result;
								}
								public List<Imgr2_Transfer> Get_Imgr2_Transfer_List(Imgr request)
								{
												List<Imgr2_Transfer> Result = null;
												try
												{
																using (var db = DbConnectionFactory.OpenDbConnection())
																{
																				string strSql = "Select Imgr2.*, " +
																								"(Select Top 1 SerialNoFlag From Impr1 Where TrxNo=Imgr2.ProductTrxNo) AS SerialNoFlag " +
																								"From Imgr2 " +
																								"Where Imgr2.TrxNo=" + int.Parse(request.TrxNo) + " And Imgr2.LineItemNo=" + int.Parse(request.LineItemNo);
																				Result = db.Select<Imgr2_Transfer>(strSql);
																}
												}
												catch { throw; }
												return Result;
								}
								public int Confirm_Imgr1(Imgr request)
								{
												int Result = -1;
												try
												{
																using (var db = DbConnectionFactory.OpenDbConnection())
																{
																				Result = db.SqlScalar<int>("EXEC spi_Imgr_Confirm @TrxNo,@UpdateBy", new { TrxNo = int.Parse(request.TrxNo), UpdateBy = request.UserID });
																				//List<int> results = db.SqlList<int>("EXEC spi_Imgr_Confirm @TrxNo @UpdateBy", new { TrxNo = request.TrxNo, UpdateBy = request.UserID });
																				//using (var cmd = db.SqlProc("spi_Imgr_Confirm", new { TrxNo = request.TrxNo, UpdateBy = request.UserID }))
																				//{
																				//    Result = cmd.ConvertTo<int>();
																				//}
																				if(Result > -1){
																								string GoodsReceiptNoteNo = db.Scalar<string>("Select GoodsReceiptNoteNo From Imgr1 Where TrxNo=" + int.Parse(request.TrxNo));
																								db.Insert(
																												new Imsl1
																												{
																																DocNo = GoodsReceiptNoteNo,
																																Description = "TALLY",
																																StatusLogDateTime = DateTime.Now,
																																UserId = request.UserID,
																																StatusCode = "EXE",
																																UpdateBy = request.UserID,
																																UpdateDateTime =  DateTime.Now
																												}
																								);
																				}
																}
												}
												catch { throw; }
												return Result;
								}
								public int Update_Imgr2_StoreNo(Imgr request)
								{
												int Result = -1;
												try
												{
																using (var db = DbConnectionFactory.OpenDbConnection())
																{
																				Result = db.Update<Imgr2>(
																								new
																								{
																												StoreNo = request.StoreNo
																								},
																								p => p.TrxNo == int.Parse(request.TrxNo) && p.LineItemNo == int.Parse(request.LineItemNo)
																				);
																				Result = db.Update<Impm1>(
																								new
																								{
																												StoreNo = request.StoreNo
																								},
																								p => p.BatchNo == request.GoodsReceiptNoteNo && p.BatchLineItemNo == int.Parse(request.LineItemNo)
																				);
																}
												}
												catch { throw; }
												return Result;
								}
				}
}
