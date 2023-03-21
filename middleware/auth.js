const config=require('../config.env')
const jwt=require('jsonwebtoken')
const dotenv=require("dotenv")

function auth(req,res,next){
    dotenv.config({path:"../config.env"})

    const token=req.header("photome-token")

    if(!token){
        return res.status(401).json({msg:"No token found"})
    }

    try{
        const decoded=jwt.verify(token,process.env.secret)
        req.PhoToUser=decoded
        next()
    } catch(err){
        res.status(400).json({msg:"Token is invalid"})
    }
}

module.exports=auth