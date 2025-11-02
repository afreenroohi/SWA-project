const express = require("express");
const router = express.Router();
const axios = require("axios");
const api = require("../../api");
var apiJson = {}
apiJson = JSON.parse(api.apiList());


router.get("/sap-file", (req, res) => {

    var config = {
        method: "get",
        url: apiJson.SAP_FILE + `?$filter=(Fileid eq '${req.query.fileid}')&$format=json`,
        headers: {
            "Authorization": req.headers.authorization,
            "X-Requested-With": "x"
        }
    }

    axios(config).then((resp) => {
        res.status(200).json(resp.data);
    }, (err) => {
        res.status(500).json({error: err.message});
    }).catch((err) => {
        console.log(err);
        res.status(500).json({error: err.message});
    })
    
});

router.post("/sap-file", (req, res) => {

    var config = {
        method: "post",
        url: apiJson.SAP_FILE,
        headers: {
            "Authorization": req.headers.authorization,
            "X-Requested-With": "x"
        },
        data: req.body
    }

    axios(config).then((resp) => {
        res.status(200).json(resp.data);
    }, (err) => {
        res.status(500).json({error: err.message})
    }).catch((err) => {
        res.status(500).json({error: err.message})
    })

});

router.delete("/sap-file", (req, res) => {

    var config = {
        method: "delete",
        url: apiJson.SAP_FILE + `(Fileid='${req.query.fileid}')?`,
        headers: {
            "Authorization": req.headers.authorization,
            "X-Requested-With": "x"
        }
    }

    axios(config).then((resp) => {
        res.status(200).json(resp.data);
    }, (err) => {
        res.status(500).json({error: err});
    }).catch((err) => {
        res.status(500).json({error: err.message});
    })

});

module.exports = router;
