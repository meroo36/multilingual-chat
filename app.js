const express = require("express");
const path = require("path");
const router = express.Router();
const app = express();

require("dotenv").config();

var bodyParser = require("body-parser");
app.use(bodyParser.json());

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.use("/", router);
app.all("*", (req, res) => {
    res.status(404).send("Not Found.");
});

app.listen(process.env.PORT, () => {
    console.log(`Node.Js app listening at http://localhost:${process.env.PORT}`);
});
