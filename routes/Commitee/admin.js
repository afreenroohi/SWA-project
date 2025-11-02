const express = require("express");
const router = express.Router();
const axios = require("axios");
const api = require("../../api");

var apisJson = {};
apisJson = JSON.parse(api.apiList());

// * Current Member list
router.get("/getCommitteeMemberList", (req, res) => {
  axios({
    method: "get",
    url: apisJson.ADMIN_COM_MEMBER_MAINT + `?$format=json`,
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

// * Committee Type list
router.get("/getCommitteeTypeList", (req, res) => {
  axios({
    method: "get",
    url: apisJson.F4_CMTYPE + `?$format=json`,
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

// * Committee Role list
router.get("/getCommitteeRoleList", (req, res) => {
  axios({
    method: "get",
    url: apisJson.F4_CMT_USER_ROLE + `?$format=json`,
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

// * Committee User list
router.get("/getCommitteeUserList", (req, res) => {
  axios({
    method: "get",
    url: apisJson.F4_CMT_USER_DTS + `?$format=json`,
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

// * Post Maintain Committee Member post
router.post("/maintainCommitteeMember", (req, res) => {
  const data = JSON.stringify(req.body);
  const config = {
    method: "post",
    url: apisJson.ADMIN_COM_MEMBER_MAINT,
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

module.exports = router;
