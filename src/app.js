// app.js
const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
var bodyParser = require("body-parser");

require("dotenv").config();
require("./db/config");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(express.json());
app.use(cors());
app.use(
  cors({
    origin: "*",
  })
);

// ======================================================================
console.log("hi");


const user = require("./routes/user");
app.use("/user", user);

// const university = require("./routes/university_routes");
// app.use("/university", university);

// const result = require("./routes/result_routes");
// app.use("/result", result);

app.listen(process.env.PORT || 5000, function () {
  console.log("App running on port 4000.");
});
