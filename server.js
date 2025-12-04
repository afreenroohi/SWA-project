var express = require("express");
const config = require("config");
require("dotenv").config();
var app = express();
var bodyParser = require("body-parser");
const cors = require("cors");
var fs = require("fs");
var http = require("http");
var https = require("https");
const helmet = require("helmet");

// port and hostname
var port = process.env.PORT || config.PORT;
var hostname = config.HOSTNAME;


//* Get the information of logged in user
const getUser = require("./routes/UserInfo/userInfo");

// custom routes - RFP
const createRfp = require("./routes/RFP/createRFP");
const rfpList = require("./routes/RFP/RFPList");
const budgetAlloc = require("./routes/RFP/budgetAllocation");
const admin = require("./routes/RFP/admin");

const coc = require("./routes/COC/create");

const cmtF4 = require("./routes/Commitee/F4help");

const committee = require("./routes/Commitee/CrtUp");
const committeeAdmin = require("./routes/Commitee/admin");

const uploads = require("./routes/FileUpload/upload");

const docUpload = require("./routes/FileUpload/docUpload");

const filenet = require("./routes/FileUpload/filenet");

//*Open committee list, details and create or update the list (POST)
const OcomList = require("./routes/Commitee/BidDetails");

const signature = require("./routes/Commitee/Signature");

//contract process
const contractList = require("./routes/Contract/ContractList");
const contractF4 = require("./routes/Contract/F4Contract");
const contractSignature = require('./routes/Contract/ContractSignature');

// SAP file system
const sapFileUpload = require("./routes/FileUpload/sapFileUpload");

const dashboard = require("./routes/dashboard/dashboard");

global.__basedir = __dirname;

app.use(express.static((__dirname, "/static/assets/uploads")));

// app.use(bodyParser.json())
app.use(bodyParser.json({ limit: "180mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

// Set our api routes
app.use(
  "/api",
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  }),
  [
    rfpList,
    createRfp,
    budgetAlloc,
    admin,
    coc,
    cmtF4,
    committee,
    committeeAdmin,
    uploads,
    OcomList,
    getUser,
    contractList,
    contractF4,
    contractSignature,
    docUpload,
    filenet,
    signature,
    sapFileUpload,
    dashboard
  ]
);

////to serve files as static
app.use("/", express.static(__dirname + "/dist", { redirect: false }));
app.use("*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});


if(hostname === 'localhost' || process.env.PORT){
http.createServer(app).listen(port, function () {
  console.log('Server running on port: ' + port)
})
}
else {
// ssl certificate key
var privateKey = fs.readFileSync(process.env.SSL_CERT_KEY_PATH);
var certificate = fs.readFileSync(process.env.SSL_CERT_PATH);

// run app on ssl
https.createServer({
  key: privateKey,
  cert: certificate
},app).listen(port,hostname,function(){
  console.log('https' + '://' + hostname + ':' + port + '/')
})
}

// 404 Handler
app.use((req, res, next) => {
  next(createError(404));
});
// Base Route
app.get("/", (req, res) => {
  res.send("invaild endpoint");
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err);
});
