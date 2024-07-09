const { User } = require("../model/User")
const Joi = require("joi")
const bcrypt=require("bcrypt")
const saltRounds = 10;
const jwt=require("jsonwebtoken")
const loginSchema = Joi.object({
        email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string()
})
const singUpSchema = Joi.object({
        email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string()
})
const login=async (req,res,next)=>{
    // res.send("loged in ")
try {
    const { error:err }=loginSchema.validate(req.body,{abortEarly:false,stripUnknown:true})
    if(err){
        next(err)
        return
    }
//   let user=await User.findOne({email:req.body.email})
  /* for select:false in password */
  let user=await User.findOne({email:req.body.email}).select({"+password":1})
  /* + password is for password visible this user contain password of the user */
  console.log(user);
  
  if(user){
    const match=await bcrypt.compare (req.body.password,user.password)
    if(match){
        console.log(`Welcome ${user.name} `)
        /* user.toObject() is used to convert into object as user first in mongoose's object */
        const User=user.toObject()
        delete User.password
     /*    if User is not converted to obj // var token = jwt.sign(User.toObject(), 'shhhhh'); */
     /* as in line 37 we have converted user to object */
         var token = jwt.sign(User, 'shhhhh',{expiresIn:"7d"});
       return res.status(200).send({
           msg:"Loggin Sucessful ...",
           user:{
            email:user.email,
            name:user.name
           },
           token
        
        })
    }
    // else{
    //     res.status(400).send({msg:"Password Invalid"})
    // }

  }
  else{
    res.status(400).send({
        msg:"Invalid credential"
    })
    console.log("either email or password is invalid ...");
  }
  


} catch (error) {
    // if(err){
        console.log(error);
  next(error)
    
}
   
//    if(err)
//   {  let errors=err.details.map(el=>{
//         return {
//             msg:el.message,
//             params:el.context.key
//         }
      
//     })
//     console.log(errors)
// return res.send(errors)
//   }
  /* to find user */
 

}
const singup= async (req, res,next) => {
    // const{name,email,password}=req.body;
    let hashedPassword;
  
    try {
        
        const validate =  singUpSchema.validate(req.body,{abortEarly:false,stripUnknown:true})
        /* abortEarly is used to send all error at once */
        
        let err=validate.error
        if(err)
        {
            let errors=err.details.map(el=>{
            return {
                msg:el.message,
                params:el.context.key
            }
        })}
        /* it can be done with the help of the mongoose custom validation in schema of the User schema or Signup Schema */
    //    const userCheck=await User.findOne({email:req.body.email})
    //     if(userCheck){
    //         console.log("into userCheck");
    //         return res.status(400).send({
    //             msg:"User already exists"
    //         })
    //     }
       
            console.log("user checked...");
            if(req.body.password)
           {  hashedPassword=await bcrypt.hash(req.body.password, saltRounds)
        console.log(hashedPassword)}
        let user=await User.create({...req.body,password:hashedPassword});
       
        console.log(user);
        /* to hide password and in user schema make select:false*/
        let userObj=user.toObject()
        delete userObj.password
        console.log(userObj);
        return res.send({ msg: "User Created Sucessfully..." })
         
    } catch (err) {
        // res.status(500).send({msg:error.message})
        console.log(err.message);
       next(err)

    }
}
const getUserData=async (req, res) => {

    try {
        const user = await User.find()
        res.send(user)
        console.log("User fetched sucessfully...");
    } catch (error) {
        res.status(500).send({
            msg: error.message
        })
        console.log(error.message)
    }
}
module.exports={
    login,
    singup,
    getUserData
}