const express = require("express");
const router = express.Router();
const axios = require("axios");
const api = require("../../api");
const utility = require("../../utilities/utility");

var apisJson = {};

apisJson = JSON.parse(api.apiList());

var conuntryListMaster;

//* To get the common list of contracts
router.post("/getCommonListSet", (req, res) => {
  let status = req.body.status;
  let userName = req.body.userName;
  axios({
    method: "get",
    url:
      apisJson.CONT_GETLIST +
      `/ContHdrSet?$filter=Flag eq 'ALL' and UserName eq '` +
      userName +
      `'&$format=json`,
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

//* To get the list of contracts based on status
router.post("/getListSet", (req, res) => {
  let status = req.body.status;
  let userName = req.body.userName;
  axios({
    method: "get",
    url:
      apisJson.CONT_GETLIST +
      `/ContHdrSetstat?$filter=Flag eq 'ASSING' and ContreqStatus eq '` +
      status +
      `' and UserName eq '` +
      userName +
      `' &$format=json `,
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

// To get the details of a particular contract
router.post("/getDetails", (req, res) => {
  let award_number = req.body.award_number;
  let userName = req.body.userName;
  axios({
    method: "get",
    url:
      apisJson.CONT_GETLIST +
      `/ContHdrSet(Flag='ASSING',AwardNum='` +
      award_number +
      `',UserName='` +
      userName +
      `')`,
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

// To get the list of officer to be assinged
router.post("/getOfficerList", (req, res) => {
  let officer = req.body.officer;
  axios({
    method: "get",
    url:
      apisJson.CONT_GETLIST +
      `/F4UsrListSet?$filter=RoleId eq '` +
      officer +
      `'`,
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

// To assign the contract unit officer
router.post("/assignOfficer", (req, res) => {
  var data = JSON.stringify(req.body.data);
  var AwardNum = req.body.AwardNum;
  let userName = req.body.userName;
  var config = {
    method: "put",
    url:
      apisJson.CONT_GETLIST +
      `/ContHdrSet(Flag='ASSING',AwardNum='` +
      AwardNum +
      `',UserName='` +
      userName +
      `')`,
    headers: {
      "X-Requested-With": "X",
      Authorization: req.headers.authorization,
      "Content-Type": "application/json",
    },
    data: req.body.data,
  };
  axios(config)
    .then(function (response) {
      res.status(200).json(response.status);
    })
    .catch(function (error) {
      res.status(500).json({ message: error });
      console.log(error);
    });
});

//get the checked text areas
router.post("/getPDFText", (req, res) => {
  let award_number = req.body.award_number;
  axios({
    method: "get",
    url:
      apisJson.CONT_GETLIST +
      `/ContFormViewSet(AwardNum='` +
      award_number +
      `')`,
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

//get the dynamic text
router.post("/getDynamicText", (req, res) => {
  let award_number = req.body.award_number;
  axios({
    method: "get",
    url:
      apisJson.CONT_GETLIST +
      `/ConContSet(ContractNumber='` +
      award_number +
      `')?$format=json`,
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

// get contract master list selected
router.post("/getDeptConBased", (req, res) => {
  let AwardNum = req.body.AwardNum;
  axios({
    method: "get",
    url:
      apisJson.CONT_GETLIST +
      `/ContractDepartmentsSet?$filter=awardNumber eq '` +
      AwardNum +
      `'&$format=json`,
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

//update department for copy to be sent
router.post("/putDeptCopy", (req, res) => {
  var data = req.body;

  var config = {
    method: "post",
    url: apisJson.CONT_GETLIST + `/ContractDepartmentsHdrSet`,
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

// get department list for copy of contract
router.post("/getDeptList", (req, res) => {
  axios({
    method: "get",
    url: apisJson.CONT_GETLIST + `/DepartmentMasterSet?$format=json`,
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

// text areas to be dynamic
router.post("/addDynTextInPDF", (req, res) => {
  var data = JSON.stringify(req.body.data);

  var config = {
    method: "post",
    url: apisJson.CONT_GETLIST + `/ConContSet`,
    headers: {
      "X-Requested-With": "X",
      Authorization: req.headers.authorization,
      "Content-Type": "application/json",
    },
    data: data,
  };
  axios(config)
    .then(function (response) {
      res.status(200).json(response.status);
    })
    .catch(function (error) {
      res.status(500).json({ message: error });
      console.log(error);
    });
});

// text areas to be printed
router.post("/addTextInPDF", (req, res) => {
  var data = JSON.stringify(req.body.data);
  var AwardNum = req.body.AwardNum;

  var config = {
    method: "put",
    url: apisJson.CONT_GETLIST + `/ContFormViewSet('` + AwardNum + `')`,
    headers: {
      "X-Requested-With": "X",
      Authorization: req.headers.authorization,
      "Content-Type": "application/json",
    },
    data: data,
  };
  axios(config)
    .then(function (response) {
      res.status(200).json(response.status);
    })
    .catch(function (error) {
      res.status(500).json({ message: error });
      console.log(error);
    });
});

// get contractor evaluation
router.post("/getContEvaluation", (req, res) => {
  let award_number = req.body.award_number;
  axios({
    method: "get",
    url:
      apisJson.CONT_GETLIST +
      `/ConEvalPeriodSet?$filter=AwardNum eq '` +
      award_number +
      `'`,
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

// * Contractor's Evaluation post
router.post("/putContEvaluation", (req, res) => {
  var data = req.body;

  var config = {
    method: "post",
    url: apisJson.CONT_GETLIST + `/ConEvalPeriodHdrSet`,
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

// man power list
router.post("/getManPower", (req, res) => {
  let award_number = req.body.award_number;
  axios({
    method: "get",
    url:
      apisJson.CONT_GETLIST +
      `/ConMpwSet?$filter=AwardNum eq '` +
      award_number +
      `'&$format=json`,
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

// * Man power post
router.post("/putManPower", (req, res) => {
  var data = req.body;

  var config = {
    method: "post",
    url: apisJson.CONT_GETLIST + `/ConMpwHdrSet`,
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

//get the list of country
router.post("/getCountryList", (req, res) => {
  if (conuntryListMaster) {
    console.log('local');
    res.status(200).json(conuntryListMaster);
  } else {
    axios({
      method: "get",
      url: apisJson.CONT_GETLIST + `/F4CntryListSet?$format=json`,
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization,
      },
    })
      .then((response) => {
        conuntryListMaster = response.data;
        res.status(200).json(response.data);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  }
});

// To get the details of Contract Payment Schedule
router.post("/getContractPayment", (req, res) => {
  let award_number = req.body.award_number;
  axios({
    method: "get",
    url:
      apisJson.CONT_GETLIST +
      `/ContPaymentScheduleSet?$filter=ContractNo eq '` +
      award_number +
      `' `,
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

// * Payment post
router.post("/putPayment", (req, res) => {
  var data = req.body;

  var config = {
    method: "post",
    url: apisJson.CONT_GETLIST + `/ContPaymentScheduleHdrSet`,
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

// get Comment Array
router.post("/getComments", (req, res) => {
  let award_number = req.body.award_number;
  axios({
    method: "get",
    url:
      apisJson.CONT_GETLIST +
      `/ContCmtsSet?$filter=AwardNum eq '` +
      award_number +
      `'`,
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

// update comment array
router.post("/addComment", (req, res) => {
  var data = JSON.stringify(req.body.data);
  var AwardNum = req.body.AwardNum;

  var config = {
    method: "post",
    url: apisJson.CONT_GETLIST + `/ContCmtsSet`,
    headers: {
      "X-Requested-With": "X",
      Authorization: req.headers.authorization,
      "Content-Type": "application/json",
    },
    data: data,
  };
  axios(config)
    .then(function (response) {
      res.status(200).json(response.status);
    })
    .catch(function (error) {
      res.status(500).json({ message: error });
      console.log(error);
    });
});

//* get pdf & download pdf
router.post("/getPdf", (req, res) => {
  let AwardNum = req.body.award_number;
  axios({
    method: "get",
    url:
      apisJson.CONT_GETLIST +
      `/VendorContractSet(ContractId='` +
      AwardNum +
      `')/$value`,
    headers: {
      "Content-Type": "application/pdf",
      Authorization: req.headers.authorization,
    },
  })
    .then((response) => {
      // res.contentType('application/pdf');
      res.status(200).send(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

//* OTP service
router.post("/OTP", (req, res) => {
  var data = req.body;

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

// download contract pdf
router.post("/downloadPDF", (req, res) => {
  var data = req.body;
  axios({
    method: "get",
    url:
      apisJson.CONT_DOWNLOAD +
      `/VendorContractSet(ContractId='` +
      data.AwardNum +
      `',Type='` +
      data.ContractType +
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

// download contract pdf as base64
router.post("/downloadPDFBase64", (req, res) => {
  var data = req.body;
  axios({
    method: "get",
    url:
      apisJson.CONT_DOWNLOAD +
      `/VendorContractSet(ContractId='` +
      data.AwardNum +
      `',Type='` +
      data.ContractType +
      `')?$format=json`,
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

//* Attachment get call
router.post("/getAttachment", (req, res) => {
  let award_number = req.body.award_number;
  axios({
    method: "get",
    url:
      apisJson.CONT_GETLIST +
      `/ContAttachSet?$filter=AwardNum eq '` +
      award_number +
      `'`,
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

// * Attachment post call
router.post("/postAttachment", (req, res) => {
  var data = req.body;

  var config = {
    method: "post",
    url: apisJson.CONT_GETLIST + `/ContAttachSet`,
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

router.get("/get-bank-list", (req, res) => {
  axios({
    method: "get",
    url: apisJson.bankList + "?$format=json",
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    }
  }).then(async (response) => {
    const bankList = await utility.deleteMeta(response.data.d.results);
    res.status(200).json(bankList);
  }).catch((err) => {
    console.log(err);
    res.status(500).json({message: err});
  })
});

router.get('/coc-form-list', (req, res)=>{
  axios({
    method: "get",
    url: apisJson.CocFormList + "?$format=json",
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    }
  }).then(async (response) => {
    const formList = await utility.deleteMeta(response.data.d.results);
    res.status(200).json(formList);
  }).catch((err) => {
    console.log(err);
    res.status(500).json({message: err});
  })
})

router.get('/coc-form-download', (req, res) => {
  const id = req.query.id; // Retrieve the `id` from pthe request query
  const formType = req.query.formtype
  const url = `${apisJson.CocFormDownload}/${formType}(Id='${id}')?$format=json`;

  axios({
    method: "get",
    url: url,
 
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization, // Forward the Authorization header
    },
  })
    .then(async (response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to fetch data", error: err.message });
    });
});

router.get('/contract-PR-list', (req, res) => {
  
  const url = apisJson.CONTRACT_PRLIST_FETCH+ "?$format=json";
  axios({
    method: "get",
    url: url,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then(async (response) => {
      const userList = await utility.deleteMeta(response.data.d.results);
      res.status(200).json(userList);
    })
    .catch((err) => {
      console.dir(err.response)
      res.status(500).json({ message: "Failed to fetch data", error: err.message });
    });
});

router.get('/details-for-contract-creation', async (req, res) => {
  try {
    let PRNumber = req.query.PRNumber; // Assuming it's a query parameter
    
    if (!PRNumber) {
      return res.status(400).json({ message: "PRNumber is required" });
    }

    const url = apisJson.DETAILS_FOR_CONTRACT_CREATION + 
            "/PR_HeaderSet" + 
            `?$filter=PurchaseRequest eq '${PRNumber}'&$expand=Item_overview,Service_line_item,Account_Assignment&$format=json`;

    
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization,
      },
    });

    const contractCreationDetails = await utility.deleteMeta(response.data.d.results);
    
    res.status(200).json(contractCreationDetails);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Failed to fetch data", error: err.message });
  }
});

router.post("/create-contract", async (req, res) => {
  try {
    var data = req.body;
    let url = apisJson.CREATE_CONTRACT + `/PR_HeaderSet`;
    console.log(url);
// Commented CRSF Token as it was needed(based on backend suggestion)
    // // Step 1: Fetch CSRF Token
    // let csrfResponse = await axios({
    //   method: "get",
    //   url: apisJson.CREATE_CONTRACT, // Base URL
    //   headers: {
    //     "X-CSRF-Token": "Fetch",
    //     Authorization: req.headers.authorization, // Pass existing auth if required
    //   },
    // });

    // let csrfToken = csrfResponse.headers["x-csrf-token"]; // Extract the CSRF token

    // Step 2: Make POST request with CSRF Token
    let config = {
      method: "post",
      url: url,
      headers: {
        "X-Requested-With": "X",
        Authorization: req.headers.authorization,
        "Content-Type": "application/json",
        // "X-CSRF-Token": csrfToken, // Include CSRF Token
        // Cookie: csrfResponse.headers["set-cookie"], // Maintain session
      },
      data: data,
    };

    let response = await axios(config);
    let deleteMetadata = utility.deleteMeta(response.data)
    res.status(200).json(deleteMetadata);
  } catch (error) {
    console.error(error);
    res.status(400).json({ ErMessage: error.message });
  }
});



router.get('/coc-user-list', (req, res) => {
  
  const url = apisJson.CocuserList+ "?$format=json";
  
  
  axios({
    method: "get",
    url: url,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then(async (response) => {
      const userList = await utility.deleteMeta(response.data.d.results);
      res.status(200).json(userList);
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to fetch data", error: err.message });
    });
});

router.get('/coc-filtered-user-list', (req, res) => {
  
  const url = apisJson.CocFilteredUserList+ "?$filter=(CocRole eq 'OF')&$format=json";
  
  
  axios({
    method: "get",
    url: url,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    },
  })
    .then(async (response) => {
      const userList = await utility.deleteMeta(response.data.d.results);
      res.status(200).json(userList);
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to fetch data", error: err.message });
    });
});



module.exports = router;
