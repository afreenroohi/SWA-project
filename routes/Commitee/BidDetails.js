const express = require("express");
const router = express.Router();
const axios = require("axios");
const api = require("../../api");
const utility = require("../../utilities/utility");

var apisJson = {};

apisJson = JSON.parse(api.apiList());

//* To get the list of users
router.post("/ZMM_CMT_PRCS_SRV", (req, res) => {
  var data = req.body;
  var config = {
    method: "post",
    url: apisJson.ADMIN_List,
    headers: {
      "X-Requested-With": "X",
      Authorization: req.headers.authorization,
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(
      function (response) {
        res.status(200).json(response.data);
      },
      function (error) {
        console.log("error ", error);
        res.sendStatus(400).json({ ErMessage: error.message });
      }
    )
    .catch(function () {});
});
// + `?$filter=CommitteeID eq '01'`

router.get("/ZMM_CMT_PRCS_SRV", (req, res) => {
  const CommitteeId = req.body.CommitteeId;
  const CommitteeRole = req.body.CommitteeRole;

  axios({
    method: "get",
    url: apisJson.ADMIN_List,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

router.get("/ZMM_P2P_ADMIN_SRV", (req, res) => {
  axios({
    method: "get",
    url: apisJson.SLA_LIST,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

router.post("/Rfp_sla_dts1Set", (req, res) => {
  var data = JSON.stringify(req.body);
  axios({
    method: "put",
    url: apisJson.SLA_UPDATE + `(WfDept='${req.body.WfDept}',CurrLevel='${req.body.CurrLevel}')`,
    headers: {
      "X-Requested-With": "X",
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
    data: req.body
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

router.get("/ZMM_P2P_COMMITTEE_SRV", (req, res) => {
  axios({
    method: "get",
    url: apisJson.COMMITTEE_SLA_LIST,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

router.post("/cmt_sla_dtsSet", (req, res) => {
  var data = JSON.stringify(req.body);
  axios({
    method: "put",
    url: apisJson.COMMITTEE_SLA_UPDATE + `(CommitteeId='${req.body.CommitteeId}',CommitteeRole='${req.body.CommitteeRole}',CommitteeLgdinusrAction='${req.body.CommitteeLgdinusrAction}',CommitteeApproverActionMenu='${req.body.CommitteeApproverActionMenu}',)`,
    headers: {
      "X-Requested-With": "X",
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
    data: req.body
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

router.get("/ZMM_P2P_CONTRACT_SRV", (req, res) => {
  axios({
    method: "get",
    url: apisJson.CONTRACT_SLA_LIST,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

router.post("/cont_sla_dtsSet", (req, res) => {
  var data = JSON.stringify(req.body);
  axios({
    method: "put",
    url: apisJson.CONTRACT_SLA_UPDATE + `(ContractRole='${req.body.ContractRole}',ContractLgdinUsrAction='${req.body.ContractLgdinUsrAction}',)`,
    headers: {
      "X-Requested-With": "X",
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
    data: req.body
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

router.get("/ZMM_CMT_PRCS_SRV_USERS_LIST", (req, res) => {
  var data = req.body;

  var config = {
    method: "get",
    url: apisJson.ADMIN_USERS_LIST,
    headers: {
      "X-Requested-With": "X",
      Authorization: req.headers.authorization,
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(
      function (response) {
        res.status(200).json(response.data);
      },
      function (error) {
        console.log("error ", error);
        res.sendStatus(400).json({ ErMessage: error.message });
      }
    )
    .catch(function () {});
});

router.get("/ZMM_CMT_PRCS_SRV_ROLES_LIST", (req, res) => {
  var data = req.body;

  var config = {
    method: "get",
    url: apisJson.ADMIN_ROLES_LIST + `?$expand=to_UsrRoleDts&$format=json`,
    headers: {
      "X-Requested-With": "X",
      Authorization: req.headers.authorization,
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(
      function (response) {
        res.status(200).json(response.data);
      },
      function (error) {
        console.log("error ", error);
        res.sendStatus(400).json({ ErMessage: error.message });
      }
    )
    .catch(function () {});
});

//* To get the list of bi
router.post("/OCOM_BID_LIST_GET", (req, res) => {
  const UserName = req.body.UserName;
  axios({
    method: "get",
    url:
      apisJson.OCOM_List +
      `?$filter=WFCmtCrntApvr eq '` +
      UserName +
      `' and WFCmtMnuAction eq 'BLST'&$expand=to_MomVisibility&$orderby=TndrID desc&$format=json&$inlinecount=allpages`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

//* To get the list of bids
router.post("/OCOM_BID_LIST_GET_COUNT", (req, res) => {
  const UserName = req.body.UserName;
  axios({
    method: "get",
    url:
      apisJson.OCOM_List +
      `/$count` +
      `?$filter=WFCmtCrntApvr eq '` +
      UserName +
      `' and WFCmtMnuAction eq 'BLST'`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

//* To get the list of bids based on committe member and action
router.post("/OCOM_BID_TO_ACT", (req, res) => {
  // *Dynamically pass id, role and action in request body
  const CommitteeId = req.body.CommitteeId;
  const CommitteeRole = req.body.CommitteeRole;
  const CommitteeAction = req.body.CommitteeAction;
  const UserName = req.body.UserName;

  // console.log(apisJson.OCOM_List +`?$filter=WFCmtIdnt eq '`+ CommitteeId+`' and WFCmtRole eq '`+ CommitteeRole+`' and WFCmtCrntApvr eq '`+UserName+`' and WFCmtMnuAction eq '`+CommitteeAction+`'&$format=json`,);

  axios({
    method: "get",
    url:
      apisJson.OCOM_List +
      `?$filter=WFCmtIdnt eq '` +
      CommitteeId +
      `' and WFCmtRole eq '` +
      CommitteeRole +
      `' and WFCmtCrntApvr eq '` +
      UserName +
      `' and WFCmtMnuAction eq '` +
      CommitteeAction +
      `'&$expand=to_MomVisibility&$orderby=TndrID desc&$format=json` +
      "&$inlinecount=allpages",
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

//* To get the count of bids based on committe member and action
router.post("/OCOM_BID_TO_ACT_COUNT", (req, res) => {
  // *Dynamically pass id, role and action in request body
  const CommitteeId = req.body.CommitteeId;
  const CommitteeRole = req.body.CommitteeRole;
  const CommitteeAction = req.body.CommitteeAction;
  const UserName = req.body.UserName;

  axios({
    method: "get",
    url:
      apisJson.OCOM_List +
      `/$count` +
      `?$filter=WFCmtIdnt eq '` +
      CommitteeId +
      `' and WFCmtRole eq '` +
      CommitteeRole +
      `' and WFCmtCrntApvr eq '` +
      UserName +
      `' and WFCmtMnuAction eq '` +
      CommitteeAction +
      `'`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

//* To get the list of bids based on committe member and action
router.post("/OCOM_BID_TO_Dash", (req, res) => {
  // *Dynamically pass id, role and action in request body
  const CommitteeId = req.body.CommitteeId;
  const CommitteeRole = req.body.CommitteeRole;
  const CommitteeAction = req.body.CommitteeAction;
  const UserName = req.body.UserName;

  // console.log(apisJson.OCOM_List +`?$filter=WFCmtIdnt eq '`+ CommitteeId+`' and WFCmtRole eq '`+ CommitteeRole+`' and WFCmtMnuAction eq '`+CommitteeAction+`'&$format=json`,);

  axios({
    method: "get",
    url:
      apisJson.OCOM_List +
      `?$filter=WFCmtIdnt eq '` +
      CommitteeId +
      `' and WFCmtRole eq '` +
      CommitteeRole +
      `'  and WFCmtMnuAction eq '` +
      CommitteeAction +
      `'&$orderby=TndrID desc&$format=json` +
      "&$inlinecount=allpages",
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});
//* To get the list of bids based on committe member and action
router.post("/OCOM_BID_TO_Dash_CNT", (req, res) => {
  // *Dynamically pass id, role and action in request body
  const CommitteeId = req.body.CommitteeId;
  const CommitteeRole = req.body.CommitteeRole;
  const CommitteeAction = req.body.CommitteeAction;
  const UserName = req.body.UserName;

  // console.log(apisJson.OCOM_List +`?$filter=WFCmtIdnt eq '`+ CommitteeId+`' and WFCmtRole eq '`+ CommitteeRole+`' and WFCmtMnuAction eq '`+CommitteeAction+`'&$format=json`,);

  axios({
    method: "get",
    url:
      apisJson.OCOM_List +
      `/$count` +
      `?$filter=WFCmtIdnt eq '` +
      CommitteeId +
      `' and WFCmtRole eq '` +
      CommitteeRole +
      `'  and WFCmtMnuAction eq '` +
      CommitteeAction +
      `'`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});
//* To get the details of specific tender (Open committee)
router.post("/OCOM_TENDER_DETAILS", (req, res) => {
  // *Dynamically pass tender id in request body
  const TenderId = req.body.TenderId;

  axios({
    method: "get",
    url:
      apisJson.TEND_DETAIL +
      `?$filter=TndrID eq '` +
      TenderId +
      `' &$expand=to_RqstMbrs,to_MomVisibility,to_Button,to_RqstVndrs,to_LmtdVndrs,to_RqstVndrs/to_VndrChkLst,to_RqstVndrs,to_RqstVndrs/to_LeglEval,to_RqstVndrs/to_VndrTec/to_TechEval/to_tevalsub,to_RqstVndrs/to_VndrTec/to_TechReqEval,to_Attach&$format=json`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

//* To get the details of specific tender (Evaluation committee)
router.post("/ECOM_TENDER_DETAILS", (req, res) => {
  // *Dynamically pass tender id in request body
  const TenderId = req.body.TenderId;
  axios({
    method: "get",
    url:
      apisJson.TEND_DETAIL +
      `?$filter=TndrID eq '` +
      TenderId +
      `' &$expand=to_RqstMbrs,to_RqstVndrs,to_Button,to_MomVisibility,to_LmtdVndrs,to_RqstVndrs/to_VndrChkLst,to_RqstVndrs,to_RqstVndrs/to_LeglEval,to_RqstVndrs/to_VndrTec/to_TechEval/to_tevalsub,to_RqstVndrs/to_VndrTec/to_TechReqEval,to_RqstVndrs/to_TechReqEval,to_Attach&$format=json`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

//* To get the details of specific tender (Qualification committee)
router.post("/QCOM_TENDER_DETAILS", (req, res) => {
  // *Dynamically pass tender id in request body
  const TenderId = req.body.TenderId;
  // console.log(apisJson.TEND_DETAIL + `?$filter=TndrID eq '` + TenderId + `' &$expand=to_RqstMbrs,to_RqstVndrs,to_RqstVndrs,to_RqstVndrs/to_VndrTchnlEvl,to_RqstVndrs/to_VndrFnclEvl&$format=json`);
  axios({
    method: "get",
    url:
      apisJson.TEND_DETAIL +
      `?$filter=TndrID eq '` +
      TenderId +
      `' &$expand=to_RqstMbrs,to_Button,to_RqstVndrs,to_LmtdVndrs,to_QualTecCr,to_RqstVndrs/to_VndrChkLst,to_RqstVndrs,to_RqstVndrs/to_VndrTchnlEvl,to_RqstVndrs/to_VndrFnclEvl,to_RqstVndrs/to_VndrFnclStmnt,to_Attach&$format=json`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

//* To get the Financial Statement (Qualification committee)
router.get("/ZC_P2P_CMT_F4_FINSTMNT_CRT", (req, res) => {
  axios({
    method: "get",
    url: apisJson.CMPTN_FINSTMNT_TYPE + `?$format=json`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

// * Create new initial request and update status
router.post("/OCOM_CRT_UPD", (req, res) => {
  // var data = JSON.stringify(req.body);
  var data = req.body;

  if (data) {
    //  console.log(data)
  }

  var config = {
    method: "post",
    url: apisJson.TEND_DETAIL,
    headers: {
      "X-Requested-With": "X",
      Authorization: req.headers.authorization,
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(
      function (response) {
        res.status(200).json(response.data);
      }
    )
    .catch(function (error) {
      res.status(500).json({error: error})
    });
});

// Delete Vendors
router.post("/deleteVendors", (req, res) => {
  console.log(
    apisJson.DELET_VENDOR +
      `(CommitteeId='${req.body.CommitteeId}',TenderId='${req.body.TenderId}',VendorId='${req.body.VendorId}')?`
  );

  axios({
    method: "delete",
    url:
      apisJson.DELET_VENDOR +
      `(CommitteeId='${req.body.CommitteeId}',TenderId='${req.body.TenderId}',VendorId='${req.body.VendorId}')?`,
    headers: {
      "X-Requested-With": "X",
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then(
      (response) => {
        res.status(204).json({});
      },
      function (error) {
        res.sendStatus(400).json({ ErMessage: error.status });
      }
    )
    .catch(function () {});
});

// Get competition Types
router.post("/F4_CMPTN_TYPE", (req, res) => {
  axios({
    method: "get",
    url: apisJson.CMPTN_TYPE + `?$format=json`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

// Get Vendor GUID
router.get("/getvendorGUID", (req, res) => {
  axios({
    method: "get",
    url: apisJson.GET_GUID + `?$format=json`,
    headers: {
      "X-Requested-With": "X",
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

router.get("/get-evaluation-weightage", (req, res) => {

  axios({
    method: "get",
    url: apisJson.getEvaluationWeightage + `(TndrID='${req.query.tender_id}')`,
    headers: {
      Authorization: req.headers.authorization,
    }
  }).then((response) => {
    res.status(200).json(response.data);
  }).catch((err) => {
    res.status(500).json({ message: err });
  })


});


router.get("/get-MOM-types", (req, res) => {
  
  axios({
    method: 'get',
    url: apisJson.getMOMTypes + '?$format=json',
    headers: {
      Authorization: req.headers.authorization,
    },
  })
    .then((response) => {
      // Transform the data to the desired format
      const formattedData = response.data.d.results.map((item) => ({
        domvalue_l: item.domvalue_l,
        DesEn: item.DesEn,
        DesAr: item.DesAr,
      }));
      res.status(200).json(formattedData);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.get("/getFinalApprovalList", (req, res) => {
  
  axios({
    method: 'get',
    url: apisJson.getfinalApprovalList + '?$format=json',
    headers: {
      Authorization: req.headers.authorization,
    },
  })
    .then((response) => {
      // Transform the data to the desired format
      const formattedData = response.data.d.results.map((item) => ({
        domvalue_l: item.domvalue_l,
        DesEn: item.DesEn,
        DesAr: item.DesAr,
      }));
      res.status(200).json(formattedData);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});
router.get("/getLocalContentList", (req, res) => {
  
  axios({
    method: 'get',
    url: apisJson.getLocalContentList + '?$format=json',
    headers: {
      Authorization: req.headers.authorization,
    },
  })
    .then((response) => {
      // Transform the data to the desired format
      const formattedData = response.data.d.results.map((item) => ({
        domvalue_l: item.domvalue_l,
        DesEn: item.DesEn,
        DesAr: item.DesAr,
      }));
      res.status(200).json(formattedData);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});


router.post("/vendor-details", (req, res) => {

  axios({
    method: 'post',
    url: apisJson.vendorDetails,
    headers: {
      Authorization: req.headers.authorization,
      'X-Requested-With': 'X'
    },
    data: req.body
  }).then(
    async (response) => {
      const vendorDetails = await utility.deleteMeta(response.data.d);
      res.status(200).json(vendorDetails);
    },
    (err) => {
      res.status(500).json({ message: err });
    }
  )

});


router.get("/vendor-details", (req, res) => {

  axios({
    method: 'get',
    url: apisJson.vendorDetails + `?$filter=CrNumber eq '${req.query.crnumber}'` + '&$expand=to_bnkdt&$format=json',
    headers: {
      Authorization: req.headers.authorization
    }
  }).then(
    async (response) => {
      const vendorDetails = await utility.deleteMeta(response.data.d.results);
      res.status(200).json(vendorDetails);
    },
    (err) => {
      res.status(500).json({ message: err });
    }
  )  

});


router.get("/gl-accounts", (req, res) => {

  axios({
    method: 'get',
    url: apisJson.glAccount + '?$format=json',
    headers: {
      Authorization: req.headers.authorization
    }
  }).then(
    async (response) => {
      const glAccount = await utility.deleteMeta(response.data.d.results);
      res.status(200).json(glAccount);
    },
    (err) => {
      res.status(500).json({ message: err });
    }
  ) 

});


module.exports = router;
