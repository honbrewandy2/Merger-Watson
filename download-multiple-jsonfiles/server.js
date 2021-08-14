const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();
const jsonConcat = require('json-concat');

app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cors())
app.use(express.static(__dirname + '/public'))

const files = [];

const theDir = __dirname
fs.readdirSync(theDir).forEach((file) => {
    try {
       const sendJson = JSON.parse(file)
       if(sendJson && typeof sendJson === "object") {
           files.push(sendJson)
           console.log('response data?', sendJson)
       }
    } catch(error) {
        console.log("Error happened here")
        console.error(error)
    }
    return false
})
jsonConcat({
    src: files,
    dest: './result.json'
}, function(json) {
    console.log(json)
})

app.post('/', (req,res) => {
    res.json(req.files)
    console.log(jsonConcat)
})

app.get('/', async function(req,res) {
    try {
        const file = await fs.createWriteStream("result.json");
        res.download(file);
    } catch (error) {
       await fs.unlinkSync()
       console.log(error)
    }
    
})

app.use(function(req,res,next){
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
})

app.use(function(err,req,res,next){
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error')
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log("Server is listening to port", port)
})