
// const {nanoid} = require("nanoid")

const shortid = require("shortid")
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res){
   const body = req.body;
   if(!body.url) {
    return res.status(400).json({error : 'url is required'})
   } 
    const shortID = shortid()
    // shortID= generateId.toLowerCase();
    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory:[],
        createdBy: req.user ? req.user._id:null,
    })
    // return res.json({id: shortID})
    //during input in postman we are giving "url" : "https://youtube.com", here key is given as "url" because above we mentioned (body.url) to acess it...

    return res.render("home",{
        id: shortID,
        host: req.get("host"),
        protocol: req.protocol,
    })

}


async function handleGetAnalytics(req,res){
     const shortId = req.params.shortId;
    const result = await URL.findOne({shortId});
    return res.json({
        totalClick: result.visitHistory.length, 
        analytics:result.visitHistory,
    })
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
}
