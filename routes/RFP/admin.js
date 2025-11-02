const express = require("express");
const router = express.Router();
const axios = require("axios");
const api = require("../../api");

var apisJson = {};
apisJson = JSON.parse(api.apiList());

// Logged in User Role
router.post("/getAdminRole", (req, res) => {
  const UserName = req.body.UserName;
  console.log("UserName", UserName);
  axios({
    method: "get",
    url:
      apisJson.ADMIN_ROLE + `(P_LOGDUSR='${UserName}')/Set` + `?$format=json`,
    headers: {
      Authorization: req.headers.authorization,
    },
  })
    .then(
      (response) => {
        console.log("res",response)
        res.status(200).json(response.data);
      },
      function (error) {
        console.log(error)
        res.sendStatus(400).json({ ErMessage: error.message });
      }
    )
    .catch(function () {});
});

// Logged in User Task List
router.get("/getAdminTaskList", (req, res) => {
  axios({
    method: "get",
    url: apisJson.ADMIN_TASK_LIST + `?$format=json&$orderby=RfpNo desc`,
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

// Logged in User Task Details
router.post("/getAdminTaskDetails", (req, res) => {
  axios({
    method: "get",
    url:
      apisJson.ADMIN_TASK_LIST +
      `?$format=json&$filter=RfpNo eq '${req.body.RfpNo}' and RfpVersion eq '${req.body.RfpVersion}'`,
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

// User List
router.post("/getAdminUserList", (req, res) => {
  const _RFP_Number = req.body.RFP_Number;
  const _RFP_Version = req.body.RFP_Version;
  axios({
    method: "get",
    url:
      apisJson.ADMIN_USER_LIST +
      `?$filter=RfpNo eq '${_RFP_Number}' and RfpVersion eq '${_RFP_Version}'&$format=json`,
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

// User Task Update Post
router.post("/postAdminUserList", (req, res) => {
  const payload = {
    RfpNo: req.body.RFP_Number,
    RfpVersion: req.body.RFP_Version,
    CurrApprover: req.body.Current_Approver,
  };
  var config = {
    method: "post",
    url: apisJson.ADMIN_TASK_LIST,
    headers: {
      "X-Requested-With": "X",
      Authorization: req.headers.authorization,
      "Content-Type": "application/json",
    },
    data: payload,
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

module.exports = router;
