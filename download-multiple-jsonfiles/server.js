const express = require('express')
const app = express()
const cors = require('cors')
const jsonConcat = require("json-concat");
require('dotenv').config();
jsonConcat({
    src: ["appVars.json", "userVars.json"],
    dest: "./config.json"
}, function (json) {
    console.log(json);
});

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())

app.post("/", (req,res) => {
    try {
        res.status(200)
    } catch (error) {
        console.log(error)
    }
})
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log("Server is listening to port", port)
})