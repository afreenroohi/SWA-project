const express = require("express");
const router = express.Router();
const axios = require("axios");
const api = require("../../api");

var apisJson = {};

apisJson = JSON.parse(api.apiList());

// create/update Committee forms
router.post("/Cmt_create", (req, res) => {
  var data = JSON.stringify(req.body);
  axios({
    method: "post",
    url: apisJson.CrtUp_REQUEST,
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "X",
      Authorization: req.headers.authorization,
    },
    data: data,
  })
    .then((response) => {
      res.status(200).json(response.data);
      // console.log('response',response)
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

// BQC Vendor Dts Expand call
router.post("/CmtBQC_Expand", (req, res) => {
  var data = req.body;
  axios({
    method: "post",
    url:
      apisJson.CrtUp_REQUEST`?$filter=TndrID eq '${data.TndrID}'&$expand=to_RqstVndrs,to_RqstVndrs,to_RqstVndrs/to_VndrFnclEvl,to_RqstVndrs/to_VndrTchnlEvl` +
      `$format=json`,
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

// BOC Vendor Dts Expand call
router.post("/CmtBOC_Expand", (req, res) => {
  var data = req.body;
  axios({
    method: "post",
    url:
      apisJson.CrtUp_REQUEST`?$filter=TndrID eq '${data.TndrID}'&$expand=to_RqstVndrs,to_RqstVndrs,to_RqstVndrs/to_VndrChkLst,to_RqstVndrs/to_VndrChkLst/to_VndrChkAtt` +
      `$format=json`,
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

// BOC Vendor Dts Expand call
router.post("/CmtMOM_Expand", (req, res) => {
  var data = req.body;
  axios({
    method: "post",
    url:
      apisJson.CrtUp_REQUEST`?$filter=TndrID eq '${data.TndrID}'&$expand=to_RqstVndrs,to_RqstVndrs,to_RqstVndrs/to_VndrChkLst,to_RqstVndrs/to_VndrChkLst/to_VndrChkAtt` +
      `$format=json`,
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

module.exports = router;
