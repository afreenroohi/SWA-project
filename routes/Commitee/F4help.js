const express = require("express");
const router = express.Router();
const axios = require("axios");
const api = require("../../api");
const { default: b64toBlob } = require("b64-to-blob");

var apisJson = {};

apisJson = JSON.parse(api.apiList());

// F4 member list
router.post("/F4_MEMBERS", (req, res) => {
  const data = {
    Id: req.body.Id,
    TndrId: req.body.TndrId,
  };
  axios({
    method: "get",
    url:
      apisJson.F4_MEMBERS +
      `?$filter=CommitteeId eq '${data.Id}' and TenderId eq '${data.TndrId}'` +
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

router.post("/PASSING_RATE", (req, res) => {
  axios({
    method: "get",
    url: apisJson.PASSING_RATE + `?$format=json`,
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

router.post("/QUAL_CHKLST", (req, res) => {
  axios({
    method: "get",
    url: apisJson.QUAL_CHKLST + `?$format=json`,
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

router.post("/F4_CMT_VENDORS", (req, res) => {
  axios({
    method: "get",
    url:
      apisJson.F4_CMT_VENDORS +
      `?$filter=TenderId eq '${req.body.TenderId}'` +
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

// F4 member list with filter
router.post("/F4_MEMBERSFILTER", (req, res) => {
  const data = {
    Id: req.body.Id,
  };
  axios({
    method: "get",
    url:
      apisJson.F4_MEMBERS +
      `?$filter=CommitteeId eq '${data.Id}' and (CommitteeRole ne 'CH' and CommitteeRole ne 'OF')` +
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

router.post("/F4_MEMBERS_SECRETARY", (req, res) => {
  const data = {
    Id: req.body.Id,
    TndrId: req.body.TndrId,
  };
  axios({
    method: "get",
    url:
      apisJson.F4_MEMBERS +
      `?$filter=CommitteeId eq '${data.Id}' and TenderId eq '${data.TndrId}' and CommitteeRole eq 'OF'` +
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

//f4 selected member
router.post("/F4_MEMBERS_COM", (req, res) => {
  const data = {
    Id: req.body.Id,
    TndrId: req.body.TndrId,
  };
  // console.log(apisJson.F4_MEMBERS_COM + `?$filter=CommitteeId eq '${data.Id}' and TenderId eq '${data.TndrId}' and ( SelectedMbr eq 'M' or SelectedMbr eq 'B' )` + `&$format=json`)
  axios({
    method: "get",
    url:
      apisJson.F4_MEMBERS_COM +
      `?$filter=CommitteeId eq '${data.Id}' and TenderId eq '${data.TndrId}' and ( SelectedMbr eq 'M' or SelectedMbr eq 'B' )` +
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

//SIDFNGDEV.sidf.gov.sa:4430/sap/opu/odata/sap/ZMM_CMT_PRCS_SRV/ZI_P2P_CMT_REQ_MEMBERS?$filter=CommitteeId eq '02' and TenderId eq '0000000100'

// get check list
https: router.get("/F4_CHKLST_TYPE", (req, res) => {
  axios({
    method: "get",
    url: apisJson.F4_CHKLST_TYPE + `?$format=json`,
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

// get committee type
router.get("/F4_CMTYPE", (req, res) => {
  axios({
    method: "get",
    url: apisJson.F4_CMTYPE + `$format=json`,
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

//  get tendertype
router.get("/F4_TNDRTYPE", (req, res) => {
  axios({
    method: "get",
    url: apisJson.F4_TNDRTYPE + `?$format=json`,
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

//  get Dashboard
router.get("/Dash_List", (req, res) => {
  axios({
    method: "get",
    url: apisJson.Dash_List + `?$format=json`,
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

// rfp head details read
router.post("/F4_RFPREAD", (req, res) => {
  // console.log(req.body)
  var data = req.body;
  axios({
    method: "get",
    url:
      apisJson.F4_RFPREAD +
      `?$filter=RfpNo eq '${data.RfpNo}'& $sort=RfpVersion desc &$top=1` +
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

//  get F4_RFP list
router.get("/F4_RFP", (req, res) => {
  axios({
    method: "get",
    url:
      apisJson.F4_RFPREAD +
      `?$filter=IsRFPAlreadyUsed eq 'N'&$orderby=RfpNo asc&$format=json`,
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

// qualification criteria get
router.post("/F4_QUALCRIT", (req, res) => {
  // console.log(req.body)
  var data = req.body;
  axios({
    method: "get",
    url:
      apisJson.F4_RFPREAD +
      `?$filter=RfpNo eq '${data.RfpNo}'&$expand=to_RFPQualCrt&$format=json`,
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

// Technical  criteria get
router.post("/F4_TechCRIT", (req, res) => {
  // console.log(req.body)
  var data = req.body;
  axios({
    method: "get",
    url:
      apisJson.F4_RFPREAD +
      `?$filter=RfpNo eq '${data.RfpNo}'&$expand=to_RFPTechCrt/to_tcritosubcri,to_RFPTechReq&$format=json`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then((response) => {
      // console.log(response.data)
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

// GET OPT
router.post("/OTP", (req, res) => {
  var data = req.body;

  //console.log(apisJson.GET_OTP+`?$filter=(Usrid eq '${data.UserId}' and MailInd eq 'X' and SmsInd eq 'X')&$format=json`)
  axios({
    method: "get",
    url:
      apisJson.GET_OTP +
      `?$filter=(Usrid eq '${data.UserId}' and MailInd eq 'X' and SmsInd eq 'X')&$format=json`,
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

// download MOM
router.post("/downloadMOM", (req, res) => {
  var data = req.body;
  data.Identifier = data.Identifier ?? "";
  axios({
    method: "get",
    url:
      apisJson.GET_MOM +
      `(RqstdCmtMomDownload='` +
      data.CommitteeID +
      `',TenderId='` +
      data.TndrID +
      `',LgdInUsr='` +
      data.LoggedInID +
      `',LgdInUsrCmt='` +
      data.LoggedCmt +
      `',LgdInUsrCmtRole='` +
      data.Role +
      `',Identifier='` +
      data.Identifier +
      `')?$format=json`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
      "X-Requested-With": "X",
    },
  })
    .then((response) => {
      res.set({
        "Content-Disposition": "attachment; filename=sample.pdf",
        "Content-Type": "application/pdf",
      });
      res.send(Buffer.from(response.data.d.FileBase64, 'base64'));
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

/// get comments
// GET OPT
router.post("/GET_CMTS", (req, res) => {
  const { CommitteeId, TenderId, VendorId } = req.body;
  const FINAL_APPROVAL_COMMITTEE_ID = "05";
  let CommitteeIDFilter = ``;
  if (CommitteeId) {
    CommitteeIDFilter = `( CommitteeId eq '${FINAL_APPROVAL_COMMITTEE_ID}'  or CommitteeId eq '${CommitteeId}' ) and `;
  }
  axios({
    method: "get",
    url:
      apisJson.GET_CMTS +
      `?$filter=${CommitteeIDFilter}TenderId eq '${TenderId}' and  VendorId eq '${VendorId}'` +
      `&$orderby=CmntdDate desc&$format=json`,
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

// GET BOQS
// qualification criteria get
router.post("/F4_BOQ", (req, res) => {
  var data = req.body;
  // console.log(apisJson.F4_RFPREAD + `?$filter=RfpNo eq '${data.RfpNo}'&$expand=to_RFPBOQDts&$format=json`)
  axios({
    method: "get",
    url:
      apisJson.F4_RFPREAD +
      `?$filter=RfpNo eq '${data.RfpNo}'&$expand=to_RFPBOQDts,to_RFPBUDDts&$format=json`,
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
//GET comments for Tender level
router.post("/GET_TND_CMTS", (req, res) => {
  var data = req.body;
  axios({
    method: "get",
    url:
      apisJson.GET_CMTS +
      `?$filter=TenderId eq '${data.TenderId}' and  VendorId eq '${data.VendorId}' and CommitteeId eq '${data.CommitteeId}'` +
      `&$format=json`,
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

//POST comments
router.post("/POST_CMTS", (req, res) => {
  var data = req.body;
  axios({
    method: "post",
    url: apisJson.POST_CMTS,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
      "X-Requested-With": "X",
    },
    data: data,
  })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

// * Get the Committee Constants
router.get("/F4_CMT_CONSTANTS", (req, res) => {
  axios({
    method: "get",
    url: apisJson.F4_CMT_CONST + `?$format=json`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
      "X-Requested-With": "X",
    },
  })
    .then((response) => {
      const responseData = deleteMeta(response.data.d.results);
      res.status(200).json(responseData);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

// * Get Technical Requirement from RFP
router.post("/GET_CMT_TECHREQ", (req, res) => {
  var data = req.body;
  axios({
    method: "get",
    url:
      apisJson.F4_RFPREAD +
      `?$filter=RfpNo eq '${data.RfpNo}'&$expand=to_RFPTechReq&$format=json`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
      "X-Requested-With": "X",
    },
  })
    .then((response) => {
      const responseData = deleteMeta(response.data.d.results);
      const technicalRequirement = deleteMeta(
        responseData[0].to_RFPTechReq.results
      );
      res.status(200).json(technicalRequirement);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

// * Get Technical Requirement Status
router.get("/F4_TechStatus", (req, res) => {
  axios({
    method: "get",
    url: apisJson.F4_CMT_TECH_REQ_STS + `?$format=json`,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
      "X-Requested-With": "X",
    },
  })
    .then((response) => {
      const responseData = deleteMeta(response.data.d.results);
      res.status(200).json(responseData);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

//* To get the Financial Evaluation Criteria (Qualification committee)
router.post("/F4_FINEVAL_CRIT", (req, res) => {
  console.log(req.body);
  axios({
    method: "get",
    url:
      apisJson.F4_RFPREAD +
      `?$filter=RfpNo eq '${req.body.RfpNo}'&$expand=to_RFPQualFinEval&$format=json`,
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

// * Delete the meta data in response object
deleteMeta = function (array) {
  array.forEach((item) => {
    delete item.__metadata;
  });
  return array;
};

module.exports = router;
