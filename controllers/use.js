const User = require("../models/user");
const {v4:v4uuid} = require('uuid')
const {setUser, getUser} = require("../service/auth");

async function handleUserSignup(req,res) {
    //here name, email, password will be as it is used as name-"" attribute in UI
    const {name, email, password} = req.body;
    await User.create({
        name,
        email,
        password,
    });
    //instead of sending just response, as we are working with ejs, we can do res.render in UI
    // return res.render("home")
    return res.redirect("/");
}
    
async function handleUserLogin(req,res) {
    //here name, email, password will be as it is used as name-"" attribute in UI
    const { email, password} = req.body;
    const currentuser = await User.findOne({
        
        email,
        password,
    });
    
    if(!currentuser)
        return res.render("login",{
            error:"Invalid Username or Password",
        })
    
    const sessionId= v4uuid()
    //now we created the session id , but we need to store this session id with users's object of that particular user, so we will create a function in auth.js


    //now cookie is created and stored in browser, now we will create a middleware, and verify thaat cokkie after every request from client user
    setUser(sessionId, currentuser);
    res.cookie("uid", sessionId); //here "uid"->can be any name

    
    //instead of sending just response, as we are working with ejs, we can do res.render in UI
    return res.redirect("/")
}
    

module.exports = {
    handleUserSignup,
    handleUserLogin,
}