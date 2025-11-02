const express = require("express");
const router = express.Router();
const axios = require("axios");
const api = require("../../api");

var apisJson = {};

let projectTypes;
let StatusList;
let Roles;
let CuoList;

apisJson = JSON.parse(api.apiList());

//* Contranct Login API call
router.post("/ContractLogin", (req, res) => {
  axios({
    method: "get",
    url:
      apisJson.CONT_GETLIST +
      `/UserLoginSet(UserId='` +
      req.body.UserName +
      `')?$format=json`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then((response) => {
      const responseObj = deleteMeta(response.data.d);
      res.status(200).json(responseObj);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

//* To get the project types for contract
router.get("/F4ProjectType", (req, res) => {
  if (projectTypes != null) {
    res.status(200).json(projectTypes);
  } else {
    axios({
      method: "get",
      url: apisJson.CONT_GETLIST + `/ZC_P2P_CONT_F4_PROJ_TYPE?$format=json`,
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization,
      },
    })
      .then((response) => {
        let responseObj = deleteMeta(response.data.d.results);
        responseObj.sort((responseA, responseB)=> responseA.PrjTypeDescEN.localeCompare(responseB.PrjTypeDescEN));
        // * Caching the response object for project types
        projectTypes = responseObj;

        res.status(200).json(responseObj);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  }
});

//* To get the status for contract
router.get("/F4Status", (req, res) => {
  if (StatusList != null) {
    res.status(200).json(StatusList);
  } else {
    axios({
      method: "get",
      url: apisJson.CONT_GETLIST + `/ZC_P2P_CONT_F4_STATUS?$format=json`,
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization,
      },
    })
      .then((response) => {
        let responseObj = deleteMeta(response.data.d.results);
        responseObj.sort((responseA, responseB)=> responseA.StatusDescEN.localeCompare(responseB.StatusDescEN));
        // * Caching the response object for project types
        StatusList = responseObj;

        res.status(200).json(responseObj);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  }
});

//* To get the roles for contract
router.get("/F4Roles", (req, res) => {
  if (Roles != null) {
    res.status(200).json(Roles);
  } else {
    axios({
      method: "get",
      url: apisJson.CONT_GETLIST + `/ZC_P2P_CONT_F4_ROLE?$format=json`,
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization,
      },
    })
      .then((response) => {
        let responseObj = deleteMeta(response.data.d.results);
        responseObj.sort((responseA, responseB)=> responseA.RoleDescEN.localeCompare(responseB.RoleDescEN));
        // * Caching the response object for project types
        Roles = responseObj;

        res.status(200).json(responseObj);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  }
});

//* To get the list of contract unit officer
router.get("/CUOList", (req, res) => {
  if (CuoList != null) {
    res.status(200).json(CuoList);
  } else {
    axios({
      method: "get",
      url: apisJson.CONT_GETLIST + `/F4UsrListSet?$filter=RoleId eq 'CO'`,
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization,
      },
    })
      .then((response) => {
        let responseObj = deleteMeta(response.data.d.results);
        responseObj.sort((responseA, responseB)=> responseA.EmpName.localeCompare(responseB.EmpName));
        // * Caching the response object for project types
        CuoList = responseObj;

        res.status(200).json(responseObj);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  }
});

router.get('/v2/contract-login', (req, res) => {
  axios({
    method: "get",
    url:
      apisJson.contractLogin +
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

// * Delete the meta data in response object
deleteMeta = function (array) {
  if (array.length > 0) {
    array.forEach((item) => {
      delete item.__metadata;
    });
  }
  delete array.__metadata;
  return array;
}

module.exports = router;
