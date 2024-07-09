const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image:String,
  /* /upload/mouse.jpg */
  createdBy: {
    // name: String,
    ref:"User",
    type:ObjectId

    // email:String
  }
});
const Product = mongoose.model("Product", productSchema)
module.exports = { Product }
