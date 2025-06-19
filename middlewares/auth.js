
//this will handle the Authentication

const {getUser}= require("../service/auth")

async function restrictToLoggedinUserOnly(req, res, next){
       
    // console.log(req);

    const userUid = req.cookies?.uid; //cookie?, here ?-> indicates if cookie is there than only it will work

    if(!userUid) return res.redirect("/login");
   

    const user = getUser(userUid);
    if(!user) return res.redirect("/login");
    

    req.user= user; // here we are forcefully creating a object of "req" as "req.user" and putting "user" inside it
    next()
}

async function checkAuth(req, res, next){
    const userUid = req.cookies?.uid;
    const user = getUser(userUid);
    req.user= user;
    next();
}


module.exports = {
    restrictToLoggedinUserOnly,
    checkAuth,
}