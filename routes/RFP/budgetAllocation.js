const express = require("express");
const router = express.Router();
const axios = require("axios");
const api = require("../../api");

var apisJson = {};
apisJson = JSON.parse(api.apiList());

// project list

// get budget list
router.post("/RfpBaHdrSet", (req, res) => {
  var data = req.body;
  axios({
    method: "get",
    url:
      apisJson.RfpBaHdr +
      `?$filter=(CreatedBy eq '${data.userid}')` +
      `&$format=json`,
    headers: {
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

// get budget list
router.post("/RfpBaHdrSetLogonUsr", (req, res) => {
  var data = req.body;
  axios({
    method: "get",
    url:
      apisJson.RfpBaHdr +
      `?$filter=(LogonUsr eq '${data.LogonUsr}')` +
      `&$format=json`,
    headers: {
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

// submit/save rfp
router.post("/RfpBaHdr", (req, res) => {
  var data = JSON.stringify(req.body);
  var config = {
    method: "post",
    url: apisJson.RfpBaHdr,
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
        res.sendStatus(400).json({ ErMessage: error.message });
      }
    )
    .catch(function () {});
});

// GET Budget Details
router.post("/RfpBaHdrSetDet", (req, res) => {
  axios({
    method: "get",
    url:
      apisJson.RfpBaHdrSet +
      "?$filter=" +
      `(ProjId eq '${req.body.ProjId}' and ProjType eq '${req.body.ProjType}' and TrfProjid eq'${req.body.TrfProjid}')` +
      `&$format=json&$expand=BaReqToBaNavg`,
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
module.exports = router;
