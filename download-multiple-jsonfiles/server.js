const express = require('express')
const app = express()
const fs = require('fs')
const cors = require('cors')
const jsonConcat = require('json-concat')

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())

jsonConcat({
    src: './public/uploads',
    dest: './config.js'
}, function(json) {
    console.log(json)
})

app.post('/', (req,res) => {
    try {
        const files = './public/uploads';
        const dir = __filename;
        fs.readFileSync(dir).forEach((file) => {
            files.push(file)
        })
        res.download(files)
    } catch (error) {
        console.log(error)
    }
})

const port = 5000

app.listen(port, () => {
    console.log(`Server is listening to port ${port}`)
})