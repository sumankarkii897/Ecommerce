const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const OrderSchema = new Schema({
//   title: {
//     type: String,
//     required: true
//   },
//   price: {
//     type: Number,
//     required: true
//   },
products:{
  type:[{
    title:{
        type:String,
        require:true
    },
    quantity:{
        type:Number,
        require:true,
        min:1
    },
    unitPrice:{
        type:Number,
        require:true,
        min:0
    }
}],
validate:{
  validator:function (products){
    if(products.length==0){
      return false
    }
  },
  message:"atleast one product required ..."
}

},
  createdBy: {
    // name: String,
    ref:"User",
    type:ObjectId

    // email:String
  }
});
const Order = mongoose.model("Order", OrderSchema)
module.exports = { Order }
