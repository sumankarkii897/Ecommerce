const express=require("express")
const { login, singup } = require("../controller/auth")
const router=express.Router()

router.post("/api/logIn", login)
router.post("/api/userSignUp", singup)
module.exports=router