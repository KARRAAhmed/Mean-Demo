const jwt = require("jsonwebtoken") ;
module.exports = (req , res , next) =>
{
   try{
      const token = req.headers.authorization.split(" ")[1] ;
      const decodeedToken = jwt.verify(token,"secret_this_should_be_longer") ;
      req.userData = {email : decodeedToken.email , userId :decodeedToken.userId } ;
      next() ;
    }catch(error) {
    res.status(401).json({message : "You are not authenticated !"}) ;
}
};
