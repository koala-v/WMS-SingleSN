﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using WebApi.ServiceModel;
using WebApi.ServiceModel.Wms;

namespace WebApi.ServiceInterface.Wms
{
    public class TableService
				{
								public void TS_Impa(Auth auth, Impa request, Impa_Logic impa_Logic, CommonResponse ecr, string[] token, string uri)
								{
												if (auth.AuthResult(token, uri))
												{
																if (uri.IndexOf("/wms/impa1") > 0)
																{
																				ecr.data.results = impa_Logic.Get_Impa1_List(request);
																}
																ecr.meta.code = 200;
																ecr.meta.message = "OK";
												}
												else
												{
																ecr.meta.code = 401;
																ecr.meta.message = "Unauthorized";
												}
								}								
								public void TS_Rcbp(Auth auth, Rcbp request, Rcbp_Logic rcbp_Logic, CommonResponse ecr, string[] token, string uri)
								{
												if (auth.AuthResult(token, uri))
												{
																if (uri.IndexOf("/wms/rcbp1") > 0)
																{
																				ecr.data.results = rcbp_Logic.Get_Rcbp1_List(request);
																}
																ecr.meta.code = 200;
																ecr.meta.message = "OK";
												}
												else
												{
																ecr.meta.code = 401;
																ecr.meta.message = "Unauthorized";
												}
								}
        public void TS_Imgr(Auth auth, Imgr request, Imgr_Logic imgr_Logic, CommonResponse ecr, string[] token, string uri)
        {
            if (auth.AuthResult(token, uri))
            {
																if (uri.IndexOf("/wms/imgr1/confirm") > 0)
																{
																				ecr.data.results = imgr_Logic.Confirm_Imgr1(request);
																}
																else if (uri.IndexOf("/wms/imgr1") > 0)
																{
																				ecr.data.results = imgr_Logic.Get_Imgr1_List(request);
																}
																else if (uri.IndexOf("/wms/imgr2/putaway/update") > 0)
																{
																				ecr.data.results = imgr_Logic.Update_Imgr2_StoreNo(request);
																}
																else if (uri.IndexOf("/wms/imgr2/putaway") > 0)
																{
																				ecr.data.results = imgr_Logic.Get_Imgr2_Putaway_List(request);
																}
																else if (uri.IndexOf("/wms/imgr2/transfer") > 0)
																{
																				ecr.data.results = imgr_Logic.Get_Imgr2_Transfer_List(request);
																}
																else if (uri.IndexOf("/wms/imgr2/receipt") > 0)
																{
																				ecr.data.results = imgr_Logic.Get_Imgr2_Receipt_List(request);
																}
                ecr.meta.code = 200;
                ecr.meta.message = "OK";                
            }
            else
            {
                ecr.meta.code = 401;
                ecr.meta.message = "Unauthorized";
            }
        }
        public void TS_Impr(Auth auth, Impr request, Impr_Logic impr_Logic, CommonResponse ecr, string[] token, string uri)
        {
            if (auth.AuthResult(token, uri))
            {
																if (uri.IndexOf("/wms/impr1") > 0)
																{
																				ecr.data.results = impr_Logic.Get_Impr1_List(request);
																}
																ecr.meta.code = 200;
																ecr.meta.message = "OK";
            }
            else
            {
                ecr.meta.code = 401;
                ecr.meta.message = "Unauthorized";
            }
        }
								public void TS_Impm(Auth auth, Impm request, Impm_Logic logic, CommonResponse ecr, string[] token, string uri)
								{
												if (auth.AuthResult(token, uri))
												{
																if (uri.IndexOf("/wms/impm1/putaway/update") > 0)
																{
																				ecr.data.results = logic.Update_Impm1_StoreNo(request);
																}
																if (uri.IndexOf("/wms/impm1/putaway") > 0)
																{
																				ecr.data.results = logic.Get_Impm1_Putaway_List(request);
																}
																ecr.meta.code = 200;
																ecr.meta.message = "OK";
												}
												else
												{
																ecr.meta.code = 401;
																ecr.meta.message = "Unauthorized";
												}
								}
								public void TS_Whwh(Auth auth, Whwh request, Whwh_Logic whwh_Logic, CommonResponse ecr, string[] token, string uri)
								{
												if (auth.AuthResult(token, uri))
												{
																if (uri.IndexOf("/wms/whwh2") > 0)
																{
																				ecr.data.results = whwh_Logic.Get_Whwh2_List(request);
																}
																ecr.meta.code = 200;
																ecr.meta.message = "OK";
												}
												else
												{
																ecr.meta.code = 401;
																ecr.meta.message = "Unauthorized";
												}
								}
        public void TS_Imgi(Auth auth, Imgi request, Imgi_Logic imgi_Logic, CommonResponse ecr, string[] token, string uri)
        {
            if (auth.AuthResult(token, uri))
            {
																if (uri.IndexOf("/wms/imgi1/confirm") > 0)
																{
																				ecr.data.results = imgi_Logic.Confirm_Imgi1(request);
																}
																else if (uri.IndexOf("/wms/imgi1/complete") > 0)
																{
																				ecr.data.results = imgi_Logic.Complete_Imgi1(request);
																}
																else if (uri.IndexOf("/wms/imgi1") > 0)
																{
																				ecr.data.results = imgi_Logic.Get_Imgi1_List(request);
																}
																else if (uri.IndexOf("/wms/imgi2/update/packingno") > 0)
																{
																				ecr.data.results = imgi_Logic.Update_Imgi2_PackingNo(request);
																}
																else if (uri.IndexOf("/wms/imgi2/picking") > 0)
																{
																				ecr.data.results = imgi_Logic.Get_Imgi2_Picking_List(request);
																}
																else if (uri.IndexOf("/wms/imgi2/verify") > 0)
																{
																				ecr.data.results = imgi_Logic.Get_Imgi2_Verify_List(request);
																}
                ecr.meta.code = 200;
                ecr.meta.message = "OK";
            }
            else
            {
                ecr.meta.code = 401;
                ecr.meta.message = "Unauthorized";
            }
        }
        public void TS_Imsn(Auth auth, Imsn request, Imsn_Logic imsn_Logic, CommonResponse ecr, string[] token, string uri)
        {
            if (auth.AuthResult(token, uri))
            {
																if (uri.IndexOf("/wms/imsn1/create") > 0)
																{
																				ecr.data.results = imsn_Logic.Insert_Imsn1(request);
																}
																else if (uri.IndexOf("/wms/imsn1") > 0)
																{
																				ecr.data.results = imsn_Logic.Get_Imsn1_List(request);
																}
																ecr.meta.code = 200;
																ecr.meta.message = "OK";
            }
            else
            {
                ecr.meta.code = 401;
                ecr.meta.message = "Unauthorized";
            }
        }
								public void TS_Imit(Auth auth, Imit request, Imit_Logic imit_Logic, CommonResponse ecr, string[] token, string uri)
								{
												if (auth.AuthResult(token, uri))
												{
																if (uri.IndexOf("/wms/imit1/create") > 0)
																{
																				ecr.data.results = imit_Logic.Insert_Imit1(request);
																}
																else if (uri.IndexOf("/wms/imit1/confirm") > 0)
																{
																				ecr.data.results = imit_Logic.Confirm_Imit1(request);
																}
																else if (uri.IndexOf("/wms/imit2/create") > 0)
																{
																				ecr.data.results = imit_Logic.Insert_Imit2(request);
																}
																ecr.meta.code = 200;
																ecr.meta.message = "OK";
												}
												else
												{
																ecr.meta.code = 401;
																ecr.meta.message = "Unauthorized";
												}
								}

        public void TS_Imcc(Auth auth, imcc request, imcc_loigc imcc_Logic, CommonResponse ecr, string[] token, string uri)
        {
            if (auth.AuthResult(token, uri))
            {

                if (uri.IndexOf("/wms/imcc1") > 0)
                {
                    ecr.data.results = imcc_Logic.Get_Imcc1_List(request);
                }
                else if (uri.IndexOf("/wms/imcc2/confirm") > 0)
                {
                    ecr.data.results = imcc_Logic.ConfirmAll_Imcc2(request);
                }
                else if (uri.IndexOf("/wms/imcc2") > 0)
                {
                    ecr.data.results = imcc_Logic.Get_Imcc2_List(request);
                }

                ecr.meta.code = 200;
                ecr.meta.message = "OK";
            }
            else
            {
                ecr.meta.code = 401;
                ecr.meta.message = "Unauthorized";
            }
        }
    }
}
