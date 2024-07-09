var jwt = require('jsonwebtoken');
const { SELLER, BUYER } = require('../constants/role');

const logIn = (req,res, next) => {
    try {
        console.log("checking ...");
        // console.log(req.headers.authorization);
        let token=req.headers.authorization?.replace("Bearer ","")
        /* gives only the token and ? is an optional chaining */
        console.log("this is token");
        console.log(token);
        let  logIn = false
try {
    var decoded = jwt.verify(token, 'shhhhh');
    console.log(decoded);
    logIn=true;
    req.user=decoded
} catch (error) {
    console.log(error.message);
}
       
      
        if (!logIn) {
            console.log("not logged in...");
            console.log("unauthorized...");
            return res.status(401).send({
                msg: "unauthorized ..."
            })

        }
        console.log("logged in");
        next()
    } catch (error) {
        console.log("into catch");
console.log(error.message);
res.status(500).send({msg:error.message})
    }
}
const singIn = (req, res, next) => {
    try {
        console.log("Checking ...");
        
        const singIn = true;
        if (!singIn) {
            console.log("not signed  in...");
            console.log("unauthorized...");
            return res.status(401).send({
                msg: "unauthorized"
            })
        }
        console.log("SingIn..");
        next()
    } catch (error) {
        console.log(error.message);
        res.send(error.message)
    }
}
const isSeller=(req,res,next)=>{
    if(req.user.role===SELLER){
        next()
    }
    else{
        res.status(403).send({
            msg:"Access Denied .only for seller"
        })
    }
}
const isBuyer=(req,res,next)=>{
    if(req.user.role===BUYER){
        next()
    }
    else{
        res.status(403).send({
            msg:"Access Denied .only for seller"
        })
    }
}
module.exports = { logIn, singIn,isSeller,isBuyer }