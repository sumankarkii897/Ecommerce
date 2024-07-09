const express=require("express")
const { logIn, isBuyer } = require("../auth/login")
const { placeOrder, getOrder } = require("../controller/order")

const router=express.Router()
router.post("/api/postOrder",logIn,isBuyer,placeOrder)
router.get("/api/getOrder",logIn,getOrder)
module.exports=router