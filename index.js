const express = require("express")
const { singIn, logIn, isSeller } = require("./auth/login")
const { handleServerError } = require("./middleware/handleServerError")
const { postProduct, getProduct } = require("./controller/product")
const {  getUserData } = require("./controller/auth")
const authRoutes=require("./routes/auth")
const { Mongoose } = require("./config/db")
const productRoutes=require("./routes/product")
const orderRoutes=require("./routes/order")
const fileUpload=require ("express-fileupload")
const app = express()
app.use(express.json())
app.use(fileUpload())
app.use(express.static('uploads'))
app.use(authRoutes)
app.use(productRoutes)
app.use(orderRoutes)
app.get("/api/userSignUp", getUserData)
app.use((req, res) => {
    res.status(404).send({
        msg: "resource not found"
    })
})
app.use(handleServerError)
app.listen(8000, () => {
    console.log("server started")
})

