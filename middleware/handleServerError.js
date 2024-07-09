 const handleServerError=(err,req,res,next)=>{
    console.log(err.message);
    if (err.name === "ValidationError") {
        // error:err.details for server and err.errors for the database
        return res.status(400).send({
            msg: "Bad Request",
         
            error:err.errors
          
        })
    }
   return res.status(500).send({msg:err.message})
}
module.exports={handleServerError}
