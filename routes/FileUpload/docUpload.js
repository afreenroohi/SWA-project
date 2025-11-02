const express = require('express');
const router = express.Router();
const multer = require('multer')
const fs = require("fs");
const path = require('path');
const _l = require("lodash");
const axios = require("axios");
const api = require('../../api');
const { v4: uuidv4 } = require('uuid');
var apisJson = {};
apisJson = JSON.parse(api.apiList());

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'application/zip': 'zip',
    'application/msword': 'docs',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/pdf': "pdf",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.ms-excel": "xls"
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');
        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'static/assets/uploads');
    },
    filename: function (req, file, cb) {
        fileNameTrucn = Buffer.from(file.originalname, 'latin1').toString('utf8',)

        const nameWithoutExt = path.parse(fileNameTrucn).name;

        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${nameWithoutExt}--pp${uuidv4()}.${extension}`);
        // cb(null, `${nameWithoutExt}--pp${Date.now()}.${extension}`);
    },
    limits: {
        fieldNameSize: 300,
        fileSize: 10048576, // 10 Mb
        // fileSize: 2 * 1024 * 1024 * 1024 //2MB max file(s) size
    },
});


const uploadOptions = multer({ storage: storage });

// upload file
router.post('/uploaddoccmt', uploadOptions.array('files[]'), async (req, res) => {
    const files = req.files;
    let imagesPaths = [];
    let filenames = []
    let fileDetailsList = [];
    let reqBody = req.body;
    const basePath = __basedir + "/static/assets/uploads"
    if (files) {
        files.map((file) => {
            imagesPaths.push(`${basePath}${file.filename}`);

            const fileFullName = file.filename;
            let fileUniqId = fileFullName?.split('--pp')[fileFullName?.split('--pp')?.length - 1]?.split('.')[0]
            var isoDateString = new Date()?.toISOString()?.split('.')[0]

            var fileDetails = {
                FileName: file.filename,
                HeaderKey: _l.get(reqBody, 'HeaderKey', ''),
                ItemKey: _l.get(reqBody, 'ItemKey', ''),
                EntityId: _l.get(reqBody, 'EntityId', ''),
                EntityName: _l.get(reqBody, 'EntityName', ''),
                RelatedEntityName: _l.get(reqBody, 'RelatedEntityName', ''),
                RelatedEntityId: _l.get(reqBody, 'RelatedEntityId', ''),
                DefId: _l.get(reqBody, 'DefId', ''),
                DocName: _l.get(file, 'filename', ''), //<from filenet res>
                FileNetId: fileUniqId ? fileUniqId : '', //<from filenet res>
                Origin: _l.get(reqBody, 'Origin', ''),
                UploadedBy: _l.get(reqBody, 'UploadedBy', ''),
                UploadedOn: isoDateString ? isoDateString : '', //<from filenet res>
                MimeDocType: _l.get(file, 'mimetype', ''), //<from filenet res>
                Operation: _l.get(reqBody, 'Operation', ''),
                GuiId: fileUniqId ? fileUniqId : '',
                ContentSize: _l.get(file, 'size', ''), //<from filenet res>
                DocPath: _l.get(file, 'path', ''),
            };
            fileDetailsList.push(fileDetails)


        });
    }
    if (!imagesPaths) return res.status(500).json({ messageId: "E" })

    res.status(200).json({ MessType: "S", documentList: fileDetailsList });
});


router.post('/documentDetailsPost', (req, res) => {

    var data = JSON.stringify(req.body)

    var config = {
        method: 'post',
        url: apisJson.uploadDocumentByDocumentId,
        headers: {
            'X-Requested-With': 'X',
            'Authorization': req.headers.authorization,
            'Content-Type': 'application/json',
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            res.status(200).json(_l.get(response, "data.d", {}))
        }, function (error) {
            res.status(400).json({ ErMessage: error.message })

        }).catch(function () {
            res.status(500).json({ "MessType": "E", "MessText": "Internal Server error!" });
        });

});

// get file
router.post('/documentDetailsGet', async (req, res) => {

    const params = req.body;

    // let url = apisJson.documentDetailsGet
    const getUrl = encodeURI(apisJson.documentDetailsGet
        .replace('$HeaderKey', params.HeaderKey)
        .replace('$ItemKey', params.ItemKey)
        .replace('$EntityId', params.EntityId)
        .replace('$EntityName', params.EntityName)
        .replace('$RelatedEntityName', params.RelatedEntityName)
        .replace('$RelatedEntityId', params.RelatedEntityId)
        .replace('$DefId', params.DefId))

    axios({
        method: 'get',
        url: getUrl,
        headers: {
            "Authorization": req.headers.authorization
        },
    })
        .then(response => {
            res.status(200).json(_l.get(response, "data.d", {}))
        }, function (error) {
            res.status(400).json({ ErMessage: error.message });

        }).catch(function () {
            res.status(500).json({ "MessType": "E", "MessText": "Internal Server error!" });
        })

});


// download file
// router.get('/downloadfile/:filename', async (req, res) => {
//     const fileName = req.params.filename;
//     const directoryPath = __basedir + "/static/assets/uploads/";

//     res.download(directoryPath + fileName, (err) => {
//         if (err) {
//             res.status(500).send({
//                 message: "Could not read the file. " + err,
//             })
//         }
//     })
// })

// delete file
// router.post('/deletefilecmt', async (req, res) => {
//     const fileName = req.body.DocName;
//     const directoryPath = __basedir + "/static/assets/uploads/";

//     fs.unlink(directoryPath + fileName, (err) => {
//         if (err) {
//             res.json(500).send({
//                 MessType: "E",
//                 MessText: "Could not delete the file. " + err,
//             })
//         }
//         res.status(200).send({
//             MessType: "S",
//             MessText: "File deleted successfully"
//         })
//     })
// })


module.exports = router;