const { default: mongoose } = require("mongoose");
const { Product } = require("../model/Product");
const path=require ("path")
const postProduct = async (req, res) => {

    // console.log(req.user);
    console.log("body",req.body);
    console.log("file",req.files.image);
    /*  path.resolve() points out the root file*/
    console.log(path.join(path.resolve(),"uploads"));
    let destination =path.join(path.resolve(),"uploads",req.files.image.name)
    // console.log(__dirname);
    // console.log(path.join(__dirname));
    // to move image in the destination
    req.files.image.mv(destination)
    // const product=await Product.create({...req.body,image:req.files})
    // res.sendStatus(200)
    // return
    try {
        const product=await Product.create ({ ...req.body, createdBy: req.user._id,image:req.files.image.name })
        /* or 
        const product=await Product.create({...req.body,createdBy:req.user._id}) */
        // const product = await Product.create({

        //     title,
        //     price,
        //     createdBy
        // })

        res.send("Product Added Sucessfully")
        console.log(product);
    } catch (error) {
        res.status(500).send({ msg: error.message })
        console.log(error.message);
    }

}
const getProduct = async (req, res) => {

    try {
        const searchTerm=req.query.searchTerm
        const priceFrom=parseFloat(req.query.priceFrom )|| 0
        const priceTo=parseFloat(req.query.priceTo )|| 99999999
        const perPage=parseInt(req.query.perPage) || 2
        const page=parseInt(req.query.page) || 1
        // console.log(searchTerm);
        // const product = await Product.find({title:RegExp(searchTerm,"i")})
        //find(filters,select) ,{description:0} to hide description
        let filterOptions={$and:[{price:{$gte:priceFrom}},
            {price:{$lte:priceTo},
        },
        {title:RegExp(searchTerm,"i")}
        ]}
let total=await Product.find(filterOptions).countDocuments()
        const product = await Product.find(filterOptions,{createdBy:0}).skip((page -1)*perPage).limit(perPage)
        res.send({total,page,perPage,product})
        console.log("Product fetched sucessfully...");
    } catch (error) {
        res.status(500).send({
            msg: error.message
        })
        console.log(error.message)
    }
}
const getSingleProduct=async (req,res,next)=>{
    try {
        let product=await Product.findOne({_id:req.params.id}).populate("createdBy")
res.send(product)
    } catch (error) {
        next(error)
    }
}
const deleteProduct = async (req, res, next) => {
    try {
        let isProductExits = await Product.findOne({ _id: req.params.id })
        if (isProductExits) {
            /* req.user._id is from logIn where we have user info */
            /* to check whether the the user trying to delete product is actually the one who have created same product */
            // console.log(req.user._id);
            /* this will give id in the form of new ObjectId('6638c812351fb15957e3013f') as it is stored in this form in mongoose db */
            // console.log(isProductExits.createdBy);
            /* converting into obj */
            isProductExits = isProductExits.toObject()
            /* converting the user id to the string */
            console.log(isProductExits.createdBy.toString());
            //   req.user._id=new mongoose.Types.ObjectId(req.user._id)
            console.log(req.user._id);

            if (req.user._id !== isProductExits.createdBy.toString()) {
                return res.status(403).send({ msg: "Access Denied..." })
                /* 403 is a forbidden so we can use res.sendStatus(403) */
            }
            /* req.params gives an id of the product that is given  */
            // console.log(req.params);
            /* delete */
            else {
                await Product.findByIdAndDelete(req.params.id)
                console.log("deleted");
                return res.sendStatus(204)
            }
            /* in status code 204 we should not send the message */
        }

        res.status(404).send({ msg: "Product not found" })

    } catch (error) {
        res.status(500).send({ msg: error.message })
        next(error)
    }
}

const editProduct = async (req, res, next) => {
    try {
        console.log("editing");
        let isProductExits = await Product.findOne({ _id: req.params.id })
        if (!isProductExits) {
            return res.sendStatus(404)
        }
        if (req.user._id !== isProductExits.toObject().createdBy.toString()) {
            res.sendStatus(403)
        }
        else {
            /* find by id and replace the existing data by the data of the req.body */
            let updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
                /* new:true is for the latest product to be send as respond */
                /* runValidators:true is to run validation of the database */
            })
            console.log("edited");
            return res.send(updatedProduct)
        }
    } catch (error) {
        // res.sendStatus(500)
        next(error)

    }
}
module.exports = { getSingleProduct,postProduct, getProduct, deleteProduct, editProduct }