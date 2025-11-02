const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const _l = require("lodash");
const axios = require("axios");
const api = require("../../api");
const { v4: uuidv4 } = require("uuid");
var apisJson = {};
apisJson = JSON.parse(api.apiList());

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "application/zip": "zip",
  "application/msword": "docs",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-excel": "xls",
};

const FILENET_AUTH_TOKEN = process.env.FILENET_AUTH_TOKEN;

const FILENET_TARGETFOLDER_GUID_DEV = '{07929D2A-70AF-C274-84AE-8B420F400000}';
const FILENET_TARGETFOLDER_GUID_PRD = '{A6D07589-DB03-CD70-87C9-8DE3C9100000}';

router.post("/filenetuploadfile", (req, res) => {

  if(!FILENET_AUTH_TOKEN) {
    res.status(401).send('Auth token is undefined !');
  }

  var config = {
    method: "post",
    url: req.body.createDocWithContent.url + "createDocWithContent",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Basic ${FILENET_AUTH_TOKEN}`,
      "x-Gateway-APIKey": "2206f208-d77c-4102-85e2-3dbee250e4b3",
    },
    data: {
      createDocWithContent: {
        PT_RFPNo: '20',
        clientSystem: 'SAP',
        docClass: req.body.createDocWithContent.url.indexOf('takamu') > -1 ? 'Munafasat' : 'DC_LMSCRMDocuments',
        objectStoreName: 'SIDF Documents',
        targetFolderGUID: req.body.createDocWithContent.url.indexOf('takamu') > -1 ? FILENET_TARGETFOLDER_GUID_PRD : FILENET_TARGETFOLDER_GUID_DEV,
        docName: req.body.createDocWithContent.docName,
        file: req.body.createDocWithContent.file,
        mimeType: req.body.createDocWithContent.mimeType
      }
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  };

  axios(config)
    .then(
      function (response) {
        res.status(200).send(response.data);
      },
      function (error) {
        console.error(error.message);
        res.status(400).json({ ErMessage: error.message });
      }
    )
    .catch(function () {
      res
        .status(500)
        .json({ MessType: "E", MessText: "Internal Server error!" });
    });
});

router.post("/filenetdownloadfile", (req, res) => {
  var config = {
    method: "post",
    url: req.body.getDocumentWithContent.url + "getDocumentWithContent",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Basic ${FILENET_AUTH_TOKEN}`,
      "x-Gateway-APIKey": "2206f208-d77c-4102-85e2-3dbee250e4b3",
    },
    data: {
      getDocumentWithContent: {
        objectStoreName: 'SIDF Documents',
        clientSystem: 'SAP',
        docID: req.body.getDocumentWithContent.docID
      }
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  };

  axios(config)
    .then(
      function (response) {
        res.status(200).send(response.data);
      },
      function (error) {
        res.status(400).json({ ErMessage: error.message });
      }
    )
    .catch(function () {
      res
        .status(500)
        .json({ MessType: "E", MessText: "Internal Server error!" });
    });
});

router.post("/filenetdeletefile", (req, res) => {
  var config = {
    method: "post",
    url: req.body.deleteDocumentByID.url + "deleteDocumentByID",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Basic ${FILENET_AUTH_TOKEN}`,
      "x-Gateway-APIKey": "2206f208-d77c-4102-85e2-3dbee250e4b3",
    },
    data: {
      deleteDocumentByID: {
        objectStoreName: 'SIDF Documents',
        clientSystem: 'SAP',
        docID: req.body.deleteDocumentByID.docID
      }
    },
  };

  axios(config)
    .then(
      function (response) {
        res.status(200).send(response.data);
      },
      function (error) {
        res.status(400).json({ ErMessage: error.message });
      }
    )
    .catch(function () {
      res
        .status(500)
        .json({ MessType: "E", MessText: "Internal Server error!" });
    });
});

module.exports = router;
