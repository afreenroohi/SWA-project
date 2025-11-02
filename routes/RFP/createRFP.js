const express = require("express");
const router = express.Router();
const axios = require("axios");
const utility = require("../../utilities/utility");
const api = require("../../api");

var apisJson = {};

apisJson = JSON.parse(api.apiList());

// get project
router.post("/F4ProjIdSet", (req, res) => {
  axios({
    method: "get",
    url:
      apisJson.projsGet +
      `?$filter=(ProjId eq '${req.body.ProjId}' and CostCenter eq '${req.body.CostCenter}' and ControllingArea eq '${req.body.ControllingArea}')&$format=json`,
    headers: {
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

// get Budget types
router.get("/getBudgetTypes", (req, res) => {
  axios({
    method: "get",
    url:
      apisJson.budgetTypeGet +
      `?$format=json`,
    headers: {
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

// get matgrp
router.post("/F4MatGrpSet", (req, res) => {
  var data = req.body;
  axios({
    method: "get",
    url:
      apisJson.F4MatGrpSet +
      `?$filter=(MatGrpId eq '' and DocTypeId eq '${data.DocTypeId}')` +
      `&$format=json`,
    headers: {
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

// get project
router.post("/RfpEstmPriceSet", (req, res) => {
  let RfpNo = req.body.RfpNo
  let RfpVersion = req.body.RfpVersion
  
  axios({
    method: "get",
    url:
      apisJson.RfpEstmPriceSet +
      `(RfpNo='${RfpNo}',RfpVersion='${RfpVersion}')` +
      `?$format=json`,
    headers: {
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

// get purgrp
router.post("/F4PurGrpSet", (req, res) => {

  let userName = req.body.userName
  
  axios({
    method: "get",
    url: apisJson.F4PurGrpSet +  `?$filter=(Username eq '${userName}')` +
    `&$format=json`,
    headers: {
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

// get purgrp
router.post("/F4UomSet", (req, res) => {
  let Uom = req.body.Uom;
  axios({
    method: "get",
    url: apisJson.F4UomSet,
    headers: {
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

// get department
router.post("/F4DeptSet", (req, res) => {
  let userid = req.body.UserName;
  axios({
    method: "get",

    url:
      apisJson.F4DeptSet + `?$filter=(UserId eq '${userid}')` + "&$format=json",
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

// get department
router.post("/F4TechSet", (req, res) => {
  let userid = req.body.userid;
  axios({
    method: "get",
    url: apisJson.F4TechSet + "('" + userid + "')" + "?$format=json",
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

// get estimated id
router.post("/F4EstmSet", (req, res) => {
  let projid = req.body.projid;
  let price = req.body.price;
  let rfpno = req.body.RfpNo;
  let RfpVersion = req.body.RfpVersion;

  // console.log(apisJson.F4EstmSet+`(ProjId='${projid}',TotPrice='${price}',RfpNo='${rfpno}',RfpVersion='${RfpVersion}')`+`?$format=json`)
  axios({
    method: "get",
    url:
      apisJson.F4EstmSet +
      `(ProjId='${projid}',TotPrice='${price}',RfpNo='${rfpno}',RfpVersion='${RfpVersion}')` +
      `?$format=json`,
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

// get finance eval criteria

router.post("/F4FinEvalSet", (req, res) => {
  axios({
    method: "get",
    url: apisJson.F4FinEvalSet,
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

// submit/save rfp
router.post("/RfpHeaderSet", (req, res) => {
  var data = JSON.stringify(req.body);
  
  var config = {
    method: "post",
    url: apisJson.RfpHeaderSet,
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

// cancel rfp
router.post("/RfpCancel", (req, res) => {
  var data = JSON.stringify(req.body);
  var config = {
    method: "post",
    url: apisJson.RfpHeaderSet,
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

// get user list
router.post("/F4UsrListSet", (req, res) => {
  var data = req.body;
  axios({
    method: "get",
    url:
      apisJson.F4UsrListSet +
      `?$filter=(UserId eq '${data.userid}' and DeptId eq '${data.DeptId}')` +
      `&$format=json`,
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

// get cost center
router.post("/F4CostCntrSet", (req, res) => {
  var data = req.body;
  axios({
    method: "get",
    url:
      apisJson.F4CostCntrSet +
      `?$filter=(UserId eq '${data.userid}' and DeptId eq '${data.DeptId}')` +
      `&$format=json`,
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

// get unit of measure
router.post("/F4UomSet", (req, res) => {
  var uom = req.body.uom;
  axios({
    method: "get",
    url:
      apisJson.F4UomSet +
      `?$filter=(Uom eq '${data.userid}')` +
      `&$format=json`,
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

// GET RFP comments
router.post("/RfpCmts", (req, res) => {
  var data = req.body;
  axios({
    method: "get",
    url:
      apisJson.RfpCommentsSet +
      `?$filter=(RfpNo eq '${data.RfpNo}' and RfpVersion eq '${data.RfpVersion}')` +
      `&$format=json`,
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
        console.log(error);
        res.sendStatus(400).json({ ErMessage: error.message });
      }
    )
    .catch(function () {});
});

// * Post Qualification Finance Criteria
router.post("/RfpFinSet", (req, res) => {
  var data = JSON.stringify(req.body);

  var config = {
    method: "post",
    url: apisJson.RfpFinSet,
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


router.post('/getChecklist',(req,res)=>{
  var data = req.body
  axios({
    method: 'get',
    url: apisJson.RFP_IT_CHECKLIST+`?$filter=(checklist_type eq '${data.checklist_type}')`+ `&$format=json&$expand=to_ChkLstDts`,
    headers: { 
      'Content-Type': 'application/json',
      "Authorization" : req.headers.authorization
    },
  })
  .then(response => {
    res.status(200).json(response.data);
  })
  .catch((err) => {
    res.status(500).json({ message: err });
  });
})

// * Get F4 Commitment Types
router.get("/F4CommitmentTypes", (req, res) => {
  axios({
    method: "get",
    url:
      apisJson.F4CommitmentItem +
      `?$format=json`,
    headers: {
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

// * Get Commitment Items List
router.get("/get-commitment-items", (req, res) => {

  axios({
    method: "get",
    url: apisJson.commitmentItems + "?$filter=(FMArea eq '1000')&$format=json",
    headers: {
      Authorization: req.headers.authorization
    }
  }).then((response) => {
    res.status(200).json(response.data);
  }).catch((err) => {
    res.status(500).json({message: err});
  });


});

// * Update Commitment Item for RFP
router.post("/set-commitment-item", (req, res) => {

  axios({
    method: "post",
    url: apisJson.setCommitmentItem,
    headers: {
      Authorization: req.headers.authorization,
      "X-Requested-With": "X"
    },
    data: req.body 
  }).then((response) => {
    res.status(200).json(response.data);
  }).catch((err) => {
    res.status(500).json({ message: err });
  });


});


// * Get Internal Order List
router.get("/get-internal-orders", (req, res) => {

  axios({
    method: "get",
    url: apisJson.internalOrders 
    + `?$filter=(CommitmentItem eq '${req.query.commitment_id}')&$format=json`,
    headers: {
      Authorization: req.headers.authorization
    }
  }).then((response) => {
    res.status(200).json(response.data);
  }).catch((err) => {
    res.status(500).json({message: err});
  });

})


//* get qualification dropdown 
router.get("/qualification-list", (req, res) => {
  
  
  axios({
    method: "get",
    url: apisJson.F4QualSet + "?$format=json",
    headers: {
      Authorization: req.headers.authorization
    }
  }).then((response) => {  // Changed 'res' to 'response'
    res.status(200).json(response.data);  // Use 'response.data' here
  }).catch((err) => {
    res.status(500).json({ message: err.message || "An error occurred" });  // Improved error handling
  });
});

// * set procurement details
router.post("/set-procurement-details", (req, res) => {
  axios({
    method: "post",
    url: apisJson.setProcurementDetails,
    headers: {
      Authorization: req.headers.authorization,
      "X-Requested-With": "X"
    },
    data: req.body 
  }).then((response) => {
    res.status(200).json(response.data);
  }).catch((err) => {
    res.status(500).json({ message: err });
  })
});

// * RFP Creator List
router.get("/rfp-creators", (req, res) => {
  axios({
    method: "get",
    url: apisJson.rfpCreatorsList + "?$format=json",
    headers: {
      Authorization: req.headers.authorization
    }
  }).then(async (response) => {
    const userList = await utility.deleteMeta(response.data.d.results);
    res.status(200).json(userList);
  }).catch((err) => {
    res.status(500).json({ message: err });
  })
})

// * Get Available Budget
router.get("/get-available-budget", (req, res) => {
  const { commitment_id, internal_order, year } = req.query;

  const url = `${apisJson.availableBudget}(CommitmentItem='${commitment_id}',InternalOrder='${internal_order}',Year='${year}')?$format=json`;

  axios({
    method: "get",
    url,
    headers: {
      Authorization: req.headers.authorization
    }
  })
  .then((response) => {
    res.status(200).json(response.data);
  })
  .catch((err) => {
    res.status(500).json({ message: err.message || err });
  });
});


module.exports = router;