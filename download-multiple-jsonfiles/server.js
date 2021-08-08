const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
require('dotenv').config();
const jsonMerger = require("json-files-merger");
const targetFolder = "public/uploads";
const mergedJsonObject = jsonMerger.load(targetFolder);

app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));
app.use(express.urlencoded({extended: false}))
app.use(cors())

app.post('/', (req,res) => {
    console.log('res:', req.files)
    console.log('res:', res.data)
    res.json(mergedJsonObject)
})

app.get("/public/uploads", async function(req,res) {
    try {
        const file = await fs.createWriteStream("report.json");
        res.download(file);
    } catch (error) {
       await fs.unlinkSync(targetFolder) 
    }
    
})
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log("Server is listening to port", port)
})