const express=require ("express")
const { logIn, isSeller, singIn, isBuyer } = require("../auth/login")
const { postProduct, getProduct,deleteProduct, editProduct, getSingleProduct, placeOrder } = require("../controller/product")
const router=express.Router()

router.post("/api/postProduct", logIn,isSeller, postProduct)
router.get("/api/getProduct", singIn, getProduct)
// router.delete("api/deleteProduct",deleteProduct)
router.delete("/api/deleteProduct/:id",logIn,isSeller,deleteProduct)
router.put("/api/editProduct/:id",logIn,isSeller,editProduct)
router.get("/api/getProduct/:id",getSingleProduct)

module.exports=router