const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "application/msword": "docs",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "application/pdf": "Pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-excel": "xls",
};

// const fileSizeLimitErrorHandler = (err, req, res, next) => {
//     if (err) {
//         res.status(500).send({
//             Id: "E",
//             message: "File size is greater " + err,
//         })

//     } else {
//       next()
//     }
// }

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "static/assets/uploads");
  },
  filename: function (req, file, cb) {
    fileNameTrucn = Buffer.from(file.originalname, "latin1").toString("utf8");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileNameTrucn}-${Date.now()}.${extension}`);
  },
  limits: {
    fieldNameSize: 300,
    fileSize: 10048576, // 10 Mb
    // fileSize: 2 * 1024  //2MB max file(s) size
  },
});

const uploadOptions = multer({ storage: storage });

// upload file
router.post("/uploadfile", uploadOptions.array("files[]"), async (req, res) => {
  const files = req.files;
  let imagesPaths = [];
  let filenames = [];
  const basePath = __basedir + "/static/assets/uploads";
  // if(err){
  //     console.log("cs " + err);
  //     return res.status(500).json({ messageId: "err" })
  // }
  if (files) {
    files.map((file) => {
      imagesPaths.push(`${basePath}${file.filename}`);
      filenames.push(file.filename);
    });
  }
  if (!imagesPaths) return res.status(500).json({ messageId: "E" });

  res.status(200).json({ messageId: "S", paths: filenames });
});

// get file
router.post("/getfile", async (req, res) => {
  const fileName = req.body.name;
  const directoryPath = __basedir + "/static/assets/uploads/";

  fs.readFile(directoryPath + fileName, { encoding: "base64" }, (err, file) => {
    if (err) {
      res.status(500).send({
        message: "Could not read the file. " + err,
      });
    }
    let fileInfo = [];

    fileInfo.push({
      name: file,
      url: __basedir + "/static/assets/uploads/" + `${fileName}`,
    });
    res.status(200).send(fileInfo);
  });
});

// download file
// router.get("/downloadfile/:filename", async (req, res) => {
//   const fileName = req.params.filename;
//   const directoryPath = __basedir + "/static/assets/uploads/";

//   res.download(directoryPath + fileName, (err) => {
//     if (err) {
//       res.status(500).send({
//         message: "Could not read the file. " + err,
//       });
//     }
//   });
// });

// delete file
// router.post("/deletefile1", async (req, res) => {
//   const fileName = req.body.name;
//   const directoryPath = __basedir + "/static/assets/uploads/";

//   fs.unlink(directoryPath + fileName, (err) => {
//     if (err) {
//       res.status(500).send({
//         Id: "S",
//         message: "Could not delete the file. " + err,
//       });
//     }
//     res.status(200).send({
//       message: "File deleted successfully",
//     });
//   });
// });

module.exports = router;
