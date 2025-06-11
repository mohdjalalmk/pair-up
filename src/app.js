const express = require('express')
const { adminAuth, userAuth } = require('./middlewares/auth')

const app = express()

app.use("/admin",adminAuth)

app.get("/user",userAuth,(req,res)=>{
    let userid=req.query.userid
    res.send(`user id is ${userid}`)
})

app.listen(3000,()=>{
    console.log("server is running");
    
})