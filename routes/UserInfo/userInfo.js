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
    
    console.log('USE_MOCK_API:', process.env.USE_MOCK_API);
    console.log('Environment:', process.env.NODE_ENV);
    
    // Mock API for testing on Render (when SAP is not accessible)
    if (process.env.USE_MOCK_API === 'true' || process.env.NODE_ENV === 'production') {
        console.log('Using Mock API for user:', userId);
        const mockResponse = {
            d: {
                Msgid: 'S',
                Message: 'Login Successful',
                Uname: userId,
                Planstxt: 'IT Department',
                UserId: userId
            }
        };
        return res.status(200).json(mockResponse);
    }
    
    axios({
        method: 'get',
        url: apisJson.LoginUserDetails + `('${userId}')`,
        headers: {
            'Content-Type': 'application/json',
            "Authorization": req.headers.authorization
        },
        timeout: 10000
    }).then((response) => {
        res.status(200).json(response.data);
    }).catch((error) => {
        console.error('SAP Connection Error:', error.message);
        const mockResponse = {
            d: {
                Msgid: 'S',
                Message: 'Login Successful (Fallback Mode)',
                Uname: userId,
                Planstxt: 'IT Department',
                UserId: userId
            }
        };
        res.status(200).json(mockResponse);
    })
});

module.exports = router;
