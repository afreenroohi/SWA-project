const express = require('express');
const router = express.Router();
const axios = require("axios");
const api = require('../../api');

var apisJson = {};

apisJson = JSON.parse(api.apiList());

//* To get the list of bids
router.post('/GET_LOGGED_USER_INFO', (req, res) => {
    //  console.log("Hi there")
    const UserName = req.body.UserName;
    // console.log(UserName);
    // console.log(apisJson.GET_USER_DETAILS + `(P_LOGDUSR='`+UserName+`')/Set?$format=json`)
    // (P_LOGDUSR='CON_ABAP')/Set?$format=json
    axios({
        method: 'get',
        url: apisJson.GET_USER_DETAILS + `(P_LOGDUSR='` + UserName + `')/Set?$filter=DefaultRole eq 'X'  &$format=json`,
        headers: {
            'Content-Type': 'application/json',
            "Authorization": req.headers.authorization
        },
    })
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch((err) => {
            res.status(500).json({ message: err });
        });
});


// * User Details
router.get('/get-user-details', (req, res) => {
    
    const userID = req.query.userid;

    axios({
        method: 'get',
        url: apisJson.userDetails + `?$filter=(UserId eq '${userID}')&$format=json`,
        headers: {
            'Content-Type': 'application/json',
            "Authorization": req.headers.authorization
        }
    }).then((response) => {
        res.status(200).json(response.data);
    }).catch((error) => {
        res.status(500).json({message: error});
    })

});

// * Login User Details by userId
router.get('/LoginUserDetails/:userId', (req, res) => {
    const userId = req.params.userId;
    
    axios({
        method: 'get',
        url: apisJson.LoginUserDetails + `('${userId}')`,
        headers: {
            'Content-Type': 'application/json',
            "Authorization": req.headers.authorization
        }
    }).then((response) => {
        res.status(200).json(response.data);
    }).catch((error) => {
        res.status(500).json({message: error});
    })
});

module.exports = router;
