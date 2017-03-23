﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WebApi.ServiceModel.Tables
{
    public class Imgi1
    {
        public int TrxNo { get; set; }
        public string CustomerCode { get; set; }
        public string GoodsIssueNoteNo { get; set; }
        public System.DateTime IssueDateTime { get; set; }
        public string RefNo { get; set; }
        public string StatusCode { get; set; }
								public string CompleteBy { get; set; }
								public System.DateTime CompleteDate { get; set; }
    }
}
