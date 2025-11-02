const express = require("express");
const router = express.Router();
const axios = require("axios");
const utility = require("../../utilities/utility");
const api = require("../../api");

var apisJson = {};
apisJson = JSON.parse(api.apiList());

// GET HEADER
router.post("/RfpHeader", (req, res) => {
  axios({
    method: "get",
    url:
      apisJson.RfpHeaderSet +
      `?$filter=(CreatedBy eq '${req.body.userid}' and DeptId eq '${req.body.DeptId}' and Ind eq '${req.body.Ind}')` +
      `&$format=json`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then(
      (response) => {
        res.status(200).json(response.data);
      },
      function (error) {
        res.sendStatus(400).json({ ErMessage: error.message });
      }
    )
    .catch(function () {});
});

// get header for my inbox
router.post("/RfpHeadinbox", (req, res) => {
  axios({
    method: "get",
    url:
      apisJson.RfpHeaderSet +
      `?$filter=(LogonUsr eq '${req.body.userid}' and DeptId eq '${req.body.DeptId}' and Ind eq '${req.body.Ind}')` +
      `&$format=json`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then(
      (response) => {
        res.status(200).json(response.data);
      },
      function (error) {
        res.sendStatus(400).json({ ErMessage: error.message });
      }
    )
    .catch(function () {});
});

// GET DEPS FOR MANAGER DASHBOARDS
//SIDFNGDEV.sidf.gov.sa:4430/sap/opu/odata/sap/ZMM_RFP_PRCS_SRV/F4DeptMangSet?$filter=(UserId eq 'EXTANAZRULLA')

router.get("/rfp-department-list", (req, res) => {
  let userid = req.query.userid;
  axios({
    method: "get",
    url:
      apisJson.RfpManagerSet +
      `?$filter=(UserId eq '${userid}')` +
      "&$format=json",
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then(async (response) => {
      const departmentList = await utility.deleteMeta(response.data.d.results);
      res.status(200).json(departmentList);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

router.get("/rfp-pending-departments", (req, res) => {
  axios({
    method: "get",
    url:
      apisJson.rfpPendingWithDept +
      "?$format=json",
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then(async (response) => {
      const departmentList = await utility.deleteMeta(response.data.d.results);
      res.status(200).json(departmentList);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
})

// GET DETAILS
router.post("/RfpDet", (req, res) => {
  let rfpno = req.body.rfpno;
  let RfpVersion = req.body.RfpVersion;
  axios({
    method: "get",
    url:
      apisJson.RfpHeaderSet +
      `?$expand=ReqToBoqNavg,ReqToPayNavg,ReqToQualfNavg,ReqToAttchNavg,ReqToBudsrNavg,ReqToBuddrNavg,ReqToTechNavg/TechToTechSub,ReqToWorkNavg,ReqToMpwrNavg,ReqToTreqNavg,ReqToFinNavg,ReqToPMChklstNavg,ReqToBoqNavg/BoqToITChkLstNavg,ReqToTmbrNavg` +
      `&$filter=(RfpNo eq '${rfpno}' and RfpVersion eq '${RfpVersion}' and WfDetails eq ' ')&$format=json`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then(
      (response) => {
        res.status(200).json(response.data);
      },
      function (error) {
        res.sendStatus(400).json({ ErMessage: error.message });
      }
    )
    .catch(function () {});
});

// GET ALL RFPS with search options
router.post("/RfpSearch", (req, res) => {
  var data = req.body;
  axios({
    method: "get",
    url:
      apisJson.RfpHeaderSet +
      `?$filter=(LogonUsr eq '${data.LogonUsr}' and CreatedBy eq '${data.userid}' and DeptId eq '${data.dep}' and CwfDept eq '${data.CwfDept}' and RfpNo eq '${data.rfpno}' and ProjId eq '${data.proj}' and Ind eq '${data.Ind}')` +
      `&$format=json`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then(
      (response) => {
        res.status(200).json(response.data);
      },
      function (error) {
        res.sendStatus(400).json({ ErMessage: error.message });
      }
    )
    .catch(function () {});
});

// action for approve/assign/return
router.post("/WfAction", (req, res) => {
  var data = JSON.stringify(req.body);
  axios({
    method: "post",
    url: apisJson.RfpHeaderSet,
    headers: {
      "X-Requested-With": "X",
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
    data: data,
  })
    .then(
      (response) => {
        res.status(200).json(response.data);
      },
      function (error) {
        res.sendStatus(400).json({ ErMessage: error.message });
      }
    )
    .catch(function () {});
});

// get uesrlist for workflow assign/review

router.post("/RfpWfUsrlstSet", (req, res) => {
  const reqData = req.body;
  axios({
    method: "get",
    url:
      apisJson.RfpWfUsrlstSet +
      `?$filter=(RfpNo eq '${reqData.RfpNo}' and RfpVersion eq '${reqData.RfpVersion}' and RfpDeptId eq '${reqData.RfpDeptId}' and WfFlowType eq '${reqData.WfFlowType}' and CwfDept eq '${reqData.CwfDept}' and CwfApprvLevel eq '${reqData.CwfApprvLevel}' and CwfApprvRole eq '${reqData.CwfApprvRole}')`,
    headers: {
      "X-Requested-With": "X",
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then(
      (response) => {
        res.status(200).json(response.data);
      },
      function (error) {
        res.sendStatus(400).json({ ErMessage: error.message });
      }
    )
    .catch(function () {});
});

router.post("/RfpWfUsrlist", (req, res) => {
  const reqData = req.body;
  axios({
    method: "get",
    url:
      apisJson.RfpWfUsrlstSet +
      `?$filter=(RfpNo eq '${reqData.RfpNo}' and RfpVersion eq '${reqData.RfpVersion}' and RfpDeptId eq '${reqData.RfpDeptId}' and WfFlowType eq '${reqData.WfFlowType}' and CwfDept eq '${reqData.CwfDept}' and CwfApprvLevel eq '${reqData.CwfApprvLevel}' and CwfApprvRole eq '${reqData.CwfApprvRole}' and Data1 eq '${reqData.assignToType}')`,
    headers: {
      "X-Requested-With": "X",
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then(
      (response) => {
        res.status(200).json(response.data);
      },
      function (error) {
        res.sendStatus(400).json({ ErMessage: error.message });
      }
    )
    .catch(function () {});
});

router.post("/RfpBoqSet", (req, res) => {
  var data = JSON.stringify(req.body);
  axios({
    method: "delete",
    url:
      apisJson.RfpBoqSet +
      `(RfpNo='${req.body.RfpNo}',RfpVersion='${req.body.RfpVersion}',ItemNo='${req.body.ItemNo}')`,
    headers: {
      "X-Requested-With": "X",
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
    data: data,
  })
    .then(
      (response) => {
        res.status(200).json(response.status);
      },
      function (error) {
        res.status(400).json(response.status);
      }
    )
    .catch(function () {});
});

router.post("/RfpMpwrSet", (req, res) => {
  var data = JSON.stringify(req.body);
  axios({
    method: "delete",
    url:
      apisJson.RfpMpwrSet +
      `(RfpNo='${req.body.RfpNo}',RfpVersion='${req.body.RfpVersion}',ItemNo='${req.body.ItemNo}')`,
    headers: {
      "X-Requested-With": "X",
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
    data: data,
  })
    .then(
      (response) => {
        res.status(200).json(response.status);
      },
      function (error) {
        res.status(400).json(response.status);
      }
    )
    .catch(function () {});
});

router.post("/RfpPaySet", (req, res) => {
  var data = JSON.stringify(req.body);
  axios({
    method: "delete",
    url:
      apisJson.RfpPaySet +
      `(RfpNo='${req.body.RfpNo}',RfpVersion='${req.body.RfpVersion}',ItemNo='${req.body.ItemNo}')`,
    headers: {
      "X-Requested-With": "X",
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
    data: data,
  })
    .then(
      (response) => {
        res.status(200).json(response.status);
      },
      function (error) {
        res.status(400).json(response.status);
      }
    )
    .catch(function () {});
});

router.post("/RfpQualSet", (req, res) => {
  var data = JSON.stringify(req.body);
  axios({
    method: "delete",
    url:
      apisJson.RfpQualSet +
      `(RfpNo='${req.body.RfpNo}',RfpVersion='${req.body.RfpVersion}',ItemNo='${req.body.ItemNo}')`,
    headers: {
      "X-Requested-With": "X",
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
    data: data,
  })
    .then(
      (response) => {
        res.status(200).json(response.status);
      },
      function (error) {
        res.status(400).json(response.status);
      }
    )
    .catch(function () {});
});

router.post("/RfpTechSet", (req, res) => {
  var data = JSON.stringify(req.body);
  axios({
    method: "delete",
    url:
      apisJson.RfpTechSet +
      `(RfpNo='${req.body.RfpNo}',RfpVersion='${req.body.RfpVersion}',ItemNo='${req.body.ItemNo}')`,
    headers: {
      "X-Requested-With": "X",
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
    data: data,
  })
    .then(
      (response) => {
        res.status(200).json(response.data);
      },
      function (error) {
        res.status(400).json(response.status);
      }
    )
    .catch(function () {});
});

router.post("/RfpTreqSet", (req, res) => {
  var data = JSON.stringify(req.body);
  axios({
    method: "delete",
    url:
      apisJson.RfpTreqSet +
      `(RfpNo='${req.body.RfpNo}',RfpVersion='${req.body.RfpVersion}',ItemNo='${req.body.ItemNo}')`,
    headers: {
      "X-Requested-With": "X",
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
    data: data,
  })
    .then(
      (response) => {
        res.status(200).json(response.data);
      },
      function (error) {
        res.status(400).json(response.status);
      }
    )
    .catch(function () {});
});

router.post("/RfpWorkSet", (req, res) => {
  var data = JSON.stringify(req.body);
  axios({
    method: "delete",
    url:
      apisJson.RfpWorkSet +
      `(RfpNo='${req.body.RfpNo}',RfpVersion='${req.body.RfpVersion}',ItemNo='${req.body.ItemNo}')`,
    headers: {
      "X-Requested-With": "X",
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
    data: data,
  })
    .then(
      (response) => {
        res.status(200).json(response.status);
      },
      function (error) {
        res.status(400).json(response.status);
      }
    )
    .catch(function () {});
});

router.post("/RfpAttchSet", (req, res) => {
  var data = JSON.stringify(req.body);
  axios({
    method: "delete",
    url:
      apisJson.RfpAttchSet +
      `(RfpNo='${req.body.RfpNo}',RfpVersion='${req.body.RfpVersion}',ItemNo='${req.body.ItemNo}')`,
    headers: {
      "X-Requested-With": "X",
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
    data: data,
  })
    .then(
      (response) => {
        res.status(200).json(response.status);
      },
      function (error) {
        res.status(400).json(response.status);
      }
    )
    .catch(function () {});
});

//* get budgeting tabel items
router.get("/rfp-budgeting-details", (req, res) => {
  let rfpno = req.query.rfpno; // Using query params instead of req.body
  let RfpVersion = req.query.RfpVersion;
  // console.log(
  //   `${apisJson.RfpBudgetingSet}?$filter=RfpNo eq '${rfpno}' and RfpVersion eq '${RfpVersion}'&$format=json`
  // );
  
  axios({
    method: "get",
    url:
      `${apisJson.RfpBudgetingSet}?$filter=RfpNo eq '${rfpno}' and RfpVersion eq '${RfpVersion}'&$format=json`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then(
       (response) => {
        // const BOQdetails =  utility.deleteMeta(response.data.d)
        res.status(200).json(response.data.d);
      },
      function (error) {
        res.sendStatus(400).json({ ErMessage: error.message });
      }
    )
    .catch(function () {});
});
//*get splited budget details
router.get("/rfp-splited-budget-details", (req, res) => {
  let rfpno = req.query.rfpno; // Using query params instead of req.body
  let RfpVersion = req.query.RfpVersion;
  // console.log(
  //   `${apisJson.RfpBudgetingSet}?$filter=RfpNo eq '${rfpno}' and RfpVersion eq '${RfpVersion}'&$format=json`
  // );
  
  axios({
    method: "get",
    url:
      `${apisJson.RFPBudgetSplitSet}?$filter=RfpNo eq '${rfpno}' and RfpVersion eq '${RfpVersion}'&$format=json`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then(
       (response) => {
        // const BOQdetails =  utility.deleteMeta(response.data.d)
        res.status(200).json(response.data.d);
      },
      function (error) {
        res.sendStatus(400).json({ ErMessage: error.message });
      }
    )
    .catch(function () {});
});

//* post budget split based on the years by user
router.post("/rfp-budget-split", (req, res) => {
  var data = req.body
  // console.log(apisJson.budgetSplitBasedonYears);
  
  axios({
    method: "post",
    url: apisJson.budgetSplitBasedonYears,
    headers: {
      "X-Requested-With": "X",
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
    data: data,
  })
    .then(
      (response) => {
        res.status(200).json(response.data);
      },
      function (error) {
        res.sendStatus(400).json({ ErMessage: error.message });
      }
    )
    .catch(function () {});
})

//* post Budget
router.post("/rfp-budget", (req, res) => {
  var data = req.body
  
  
  axios({
    method: "post",
    url: apisJson.RFPCreateBudget,
    headers: {
      "X-Requested-With": "X",
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
    data: data,
  })
    .then(
      (response) => {
        res.status(200).json(response.data);
      },
      function (error) {
        res.sendStatus(400).json({ ErMessage: error.message });
      }
    )
    .catch(function () {});
})
//* get created Budget 
router.get("/rfp-budget-details", (req, res) => {
  let rfpno = req.query.rfpno; // Using query params instead of req.body
  let RfpVersion = req.query.RfpVersion;
  // console.log(
  //   `${apisJson.RfpBudgetingSet}?$filter=RfpNo eq '${rfpno}' and RfpVersion eq '${RfpVersion}'&$format=json`
  // );
  
  axios({
    method: "get",
    url:
      `${apisJson.RFPCreatedBudgetSet}?$filter=RfpNo eq '${rfpno}' and RfpVersion eq '${RfpVersion}'&$format=json`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then(
       (response) => {
        // const BOQdetails =  utility.deleteMeta(response.data.d)
        res.status(200).json(response.data.d);
      },
      function (error) {
        res.sendStatus(400).json({ ErMessage: error.message });
      }
    )
    .catch(function () {});
});


//* get the user details based on the RFP 
router.get("/get-RFP-user-details", (req, res) => {
  let rfpno = req.query.rfpno; // Using query params instead of req.body
  let RfpVersion = req.query.RfpVersion;
  let logOnUser = req.query.LogonUsr
  let Ind = '1'
  
  axios({
    method: "get",
    url: `${apisJson.getRoleAndDeptBasedOnRFP}?$filter=RfpNo eq '${rfpno}' and RfpVersion eq '${RfpVersion}' and LogonUsr eq '${logOnUser}' and Ind eq '${Ind}'&$format=json`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })  
    .then(
       (response) => {
        // const BOQdetails =  utility.deleteMeta(response.data.d)
        res.status(200).json(response.data.d);
      },
      function (error) {
        res.sendStatus(400).json({ ErMessage: error.message });
      }
    )
    .catch(function () {});
});


module.exports = router;
