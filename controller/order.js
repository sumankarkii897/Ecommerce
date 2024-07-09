const { Order } = require("../model/Order");
const { Product } = require("../model/Product");

const placeOrder=async (req,res,next)=>{
    try {
        let products=[]
       /* async await inside forEach doesnot wait for task outside the forEach
        req.body.products.forEach(async (product) => {
            let db_product=await Product.findOne({_id:product._id})
            console.log(db_product);
            products.push({...db_product,
                quantity:product.quantity
            })
        }); */
        for (let index = 0; index < req.body.products.length; index++) {
           let element=req.body.products[index] 
           let db_product=await Product.findOne({_id:element._id})
           console.log(db_product);
           products.push({
            /* or ...db_product.toObject() */
            ...db_product,
            unitPrice:db_product.price,
            quantity:element.quantity
           })
            
        }
        // const {products,createdBy}={...req.body,createdBy:req.user._id}
        const order=await Order.create({
            products:products,
            createdBy:req.user._id
        })
        console.log("Order placed sucessfully...");
        res.send(order)
    } catch (error) {
        next(error)
    }
}
const getOrder=async (req,res,next)=>{
   try {
    const order=await Order.find({createdBy:req.user._id}).populate("createdBy","name email")
    res.send(order)
    console.log("Order fetched sucessfully...");
   } catch (error) {
    next(error)
   }
}
module.exports={placeOrder,getOrder}