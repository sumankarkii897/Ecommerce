const { required, func } = require("joi");
const { default: mongoose, set } = require("mongoose");
const { SELLER, BUYER } = require("../constants/role");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
  name:{
    type:String,
    required:true
  
  },
  email:{
    type:String,
    required:true,
    //for unique email 
    /* unique:true */
    /*  mongoose custom validation  */
    validate:{
validator:async function(value){
  //value will get the email given by the user 
  console.log(value);
  /* mongoos.models.User is done to interact with the db User table */
  let oldUser=await mongoose.models.User.findOne({email:value})
  if(oldUser){
    return false
  }
/* falsy value =false ,null,zero ,empty string ,nan */
  return true
},
message:"email already used"
    }
  
  },
  password:{
    type:String,
    required:true,
    /* to hide password we use select:false  to compare we need password we use .select({password:1}) 0 is false ,1 is true*/
    select:false
  
  },
  role:{
    required:true,
    type:String,
    // enum:["seller","buyer"]
    set:function (value) {
      console.log(value);
    return value.toLowerCase()
    },
    enum:[SELLER,BUYER]
  }
});
const User=mongoose.model("User",UserSchema)
module.exports={User}
