const express = require('express')
const { adminAuth, userAuth } = require('./middlewares/auth')

const app = express()

app.use("/admin",adminAuth)

app.get("/user",userAuth,(req,res)=>{

    let userid=req.query.userid
    res.send(`user id is ${userid}`)
    
})

app.use("/",(err,req,res,next)=>{
    if(err){
        console.log(err);
        
        res.status(500).send("Something went wrong")
    }
})

app.listen(3000,()=>{
    console.log("server is running");
    
})