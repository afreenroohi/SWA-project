const express = require("express");
const router = express.Router();
const axios = require("axios");
const api = require("../../api");

var apisJson = {};

apisJson = JSON.parse(api.apiList());

// submit/save COC
router.post("/CocFormSet", (req, res) => {
  var data = JSON.stringify(req.body);
  var config = {
    method: "post",
    url: apisJson.CocFormSet,
    headers: {
      "X-Requested-With": "X",
      Authorization: req.headers.authorization,
      "Content-Type": "application/json",
    },
    data: data,
  };
  axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      res.status(500).json({ message: error });
    });
});

// * Get the Inital form data
router.post("/GetCocFormSet", (req, res) => {
  const payload = {
    CocNumber: "",
    ContractNo: req.body.ContractNo ?? "",
    PoNumber: req.body.PoNumber ?? "",
    RequestType: req.body.RequestType,
    CocHeadtoItemNav: {
      results: [
        {
          CocNumber: "",
          PoNo: "",
        },
        {
          CocNumber: "",
          PoNo: "",
        },
      ],
    },
  };
  const config = {
    method: "post",
    url: apisJson.CocFormSet,
    headers: {
      "X-Requested-With": "X",
      Authorization: req.headers.authorization,
      "Content-Type": "application/json",
    },
    data: payload,
  };
  axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      res.status(500).json({ message: error });
    });
});

// * Get coc autofill form details
router.post("/GetCOCFormDetails", (req, res) => {
  axios({
    method: "get",
    url:
      apisJson.CocFormSet +
      `(CocNumber='${req.body.CocNumber}')` +
      "?$expand=CocHeadtoItemNav,CocFormToAttachNav,CocFormToActItemNav&$format=json",
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then(function (response) {
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      res.status(500).json({ message: error });
    });
});

// get coc autofill form details
router.post("/CocFormDet", (req, res) => {
  var data = req.body;
  axios({
    method: "get",
    url:
      apisJson.CocFormSet +
      `(CocNumber='${data.CocNumber}',PoNumber='${data.PoNumber}',PoItemNo='${data.PoItemNo}',ContractNo='${data.ContractNo}')` +
      "/?$format=json&$expand=CocFormToAttachNav",
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then(function (response) {
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      res.status(500).json({ message: error });
    });
});

// get role
router.post("/COCLogin", (req, res) => {
  var data = req.body;
  axios({
    method: "get",
    url: apisJson.CocLoginSet + `(UserId='${data.UserName}')` + `?$format=json`,
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

// Get multiple roles for COC
router.get('/v2/COCLogin', (req, res) => {
  axios({
    method: "get",
    url:
      apisJson.CocLoginSet +
      `?$filter=UserId eq '` +
      req.query.username +
      `'&$format=json`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then((response) => {
      const responseObj = deleteMeta(response.data.d.results);
      res.status(200).json(responseObj);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

// * Get COC List - User specific
router.post("/CocDashboardSetAction", (req, res) => {
  axios({
    method: "get",
    url:
      apisJson.CocDashboardSet +
      `?$filter=UserId eq '${req.body.UserName}'and DashboardInd eq  'I'&$format=json`,
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

// * Get COC list
router.post("/CocDashboardSet", (req, res) => {
  axios({
    method: "get",
    url: apisJson.CocDashboardSet + `?$filter=UserId eq '${req.body.UserName}'and DashboardInd eq  'A'&$format=json`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
      "X-Requested-With": "X",
    },
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

// get project owner po details
router.post("/CocProjOwnerPOSet", (req, res) => {
  var data = req.body;
  axios({
    method: "get",
    url:
      apisJson.CocProjOwnerPOSet +
      `?$filter=(ContractNo eq '${data.ContractNo}')` +
      `&$format=json`,
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

// get project cordinator/procurement dashboard
router.post("/CocProjCordinatorSet", (req, res) => {
  var data = req.body;
  axios({
    method: "get",
    url:
      apisJson.CocProjCordinatorSet +
      `?$filter=(UserId eq '${data.UserId}')` +
      `&$format=json`,
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

// get completed ses
router.post("/CocCompletionSet", (req, res) => {
  var data = req.body;
  axios({
    method: "get",
    url:
      apisJson.CocCompletionSet +
      `?$filter=(UserId eq '${data.UserId}'and CocStatus eq '${data.CocStatus}')` +
      `&$format=json`,
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

// Get Department List
router.get("/CocDepartmentSet", (req, res) => {
  var data = req.body;
  axios({
    method: "get",
    url: apisJson.CocDepartmentSet + `?$format=json`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
      "X-Requested-With": "X",
    },
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

// get project cordinator/procurement dashboard
router.post("/CocOpenPoAndContractSet", (req, res) => {
  axios({
    method: "get",
    url:
      apisJson.CocOpenPoAndContractSet +
      `?$filter=ProfitCenter eq '${req.body.ProfitCentre}'` +
      `&$format=json`,
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

// get project cordinator/procurement dashboard
router.post("/CocOpenContractItemSet", (req, res) => {
  const encodedURI = encodeURI(
    apisJson.CocOpenContractItemSet +
      `?$filter=(ContractNumber eq '${req.body.DocumentNo}' and VendorName eq '${req.body.VendorName}')&$format=json`
  );
  axios({
    method: "get",
    url: encodedURI,
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

// * Post PO List
router.post("/POList", (req, res) => {
  const data = req.body;
  const payload = {
    CocPOtoItemNav: {
      results: [],
    },
  };
  for (const element of data) {
    payload.CocPOtoItemNav.results.push({
      PoNo: element.PoNo.toString(),
      ContractNumber: element.ContractNumber.toString(),
      ContractItem: element.ContractItem.toString(),
    });
  }

  var config = {
    method: "post",
    url: apisJson.CocPOList,
    headers: {
      "X-Requested-With": "X",
      Authorization: req.headers.authorization,
      "Content-Type": "application/json",
    },
    data: payload,
  };
  axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      res.status(500).json({ message: error });
    });
});

// get project cordinator/procurement dashboard
router.post("/CocOpenPoItemsSet", (req, res) => {
  const encodedURI = encodeURI(
    apisJson.CocOpenPoItemsSet +
      `?$filter=(PoNo eq '${req.body.DocumentNo}' and VendorName eq '${req.body.VendorName}')&$format=json`
  );
  axios({
    method: "get",
    url: encodedURI,
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

// * Get Comments
router.post("/CocCommentsSet", (req, res) => {
  axios({
    method: "get",
    url:
      apisJson.CocCommentsSet +
      `?$filter=CocNo eq '${req.body.CocNo}'&$format=json`,
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

// * Post Comments
router.post("/COCPostComment", (req, res) => {
  const config = {
    method: "post",
    url: apisJson.CocCommentsSet,
    headers: {
      "X-Requested-With": "X",
      Authorization: req.headers.authorization,
      "Content-Type": "application/json",
    },
    data: req.body,
  };
  axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      res.status(500).json({ message: error });
    });
});

// * Get COC Document
router.post("/getCOCDocument", (req, res) => {
  axios({
    method: "get",
    url: apisJson.CocPDFSet + `(Id='${req.body.CocNumber}')?$format=json`,
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

// * Get SES Document
router.post("/getSESDocument", (req, res) => {
  axios({
    method: "get",
    url: apisJson.SesPDFSet + `('${req.body.SesNumber}')?$format=json`,
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

// * Post COC Action
router.post("/COCActionPost", (req, res) => {
  const config = {
    method: "post",
    url: apisJson.CocDashItemSet,
    headers: {
      "X-Requested-With": "X",
      Authorization: req.headers.authorization,
      "Content-Type": "application/json",
    },
    data: req.body,
  };
  axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      res.status(500).json({ message: error });
    });
});

// * Post COC Attachment
router.post("/COCAttachmentPost", (req, res) => {
  const config = {
    method: "post",
    url: apisJson.CocAttachSet,
    headers: {
      "X-Requested-With": "X",
      Authorization: req.headers.authorization,
      "Content-Type": "application/json",
    },
    data: req.body,
  };
  axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      res.status(500).json({ message: error });
    });
});

// * Get COC History
router.post("/getCocHistory", (req, res) => {
  if (!req.body.CocNumber) {
    res.status(500).json({ message: "CocNumber is undefined !" });
  }

  axios({
    method: "get",
    url:
      apisJson.CocHistorySet +
      `?$filter=CocNumber eq '${req.body.CocNumber}'&$format=json`,
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

// * Get COC SLA Maintenance list
router.get("/CocSlaMaintenanceList", (req, res) => {
  axios({
    method: "get",
    url: apisJson.CocSlaMaintenance + `?$format=json`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
      "X-Requested-With": "X",
    },
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

// * Get COC SLA Role lookup
router.get("/CocSlaRoleList", (req, res) => {
  axios({
    method: "get",
    url: apisJson.CocSlaRole + `?$format=json`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
      "X-Requested-With": "X",
    },
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

// * Get COC SLA Units lookup
router.get("/CocSlaUnitsList", (req, res) => {
  axios({
    method: "get",
    url: apisJson.CocSlaUnit + `?$format=json`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
      "X-Requested-With": "X",
    },
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

// * Post COC SLA Maintenance
router.post("/postCocSlaMaintenance", (req, res) => {
  if (!req.body.ContractRole) {
    res.status(500).json({ message: "Role is undefined !" });
  }
  if (!req.body.Sla) {
    res.status(500).json({ message: "Sla is undefined !" });
  }
  if (!req.body.SlaUnit) {
    res.status(500).json({ message: "SlaUnit is undefined !" });
  }
  if (!req.body.Description) {
    res.status(500).json({ message: "Description is undefined !" });
  }

  const config = {
    method: "post",
    url: apisJson.CocSlaMaintenance,
    headers: {
      "X-Requested-With": "X",
      Authorization: req.headers.authorization,
      "Content-Type": "application/json",
    },
    data: req.body,
  };
  axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      res.status(500).json({ message: error });
    });
});

module.exports = router;
