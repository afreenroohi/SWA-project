const express = require('express');
const router = express.Router();
const axios = require("axios");
const api = require('../../api');

var apisJson = {};

apisJson = JSON.parse(api.apiList());

//* Upload Signature
router.post('/CONT_ADD_SIGNATURE_INITIAL', (req, res) => {
  var data = JSON.stringify(req.body);
  var config = {
    method: 'post',
    url: apisJson.CONT_ADD_SIGNATURE_INITIAL,
    headers: { 
      'X-Requested-With': 'X',
      'Authorization': req.headers.authorization,
      'Content-Type': 'application/json',
    },
    data : data
  };

  axios(config)
  .then(response => {
      res.status(200).json(response.data);
  })
  .catch((err) => {
      res.status(500).json({ message: err });
  });
});

//* Get Signature
router.post('/CONT_GET_SIGNATURE_INITIAL', (req, res) => {
  const UserName = req.body.UserName;
  var config = {
    method: 'get',
    url: apisJson.CONT_GET_SIGNATURE_INITIAL + `(UserId='`+UserName+`')`,
    headers: { 
      'Authorization': req.headers.authorization,
    }
  };

  axios(config)
  .then(response => {
      res.status(200).json(response.data);
  })
  .catch((err) => {
      res.status(500).json({ message: err });
  });
});

module.exports = router;