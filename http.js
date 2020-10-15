const express = require('express')
const mongoose = require('mongoose')
const URL = require('./password')
const app = express()

const PORT = process.env.PORT || 3000
async function start(){
    try {
        await mongoose.connect(URL, {useNewUrlParser: true,useUnifiedTopology: true})
        app.listen(3000, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    }catch(err){
        console.log(err)}
}
start()
