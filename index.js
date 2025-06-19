const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const {connectToMongoDB} = require('./connect')
const {restrictToLoggedinUserOnly, checkAuth} =  require("./middlewares/auth")
const URL = require("./models/url")
const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter')
const userRoute = require('./routes/user')


const app = express();

const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url').then(()=>{
    console.log("MongoDB Connected for SHORT-URL")
})

app.set("views", path.resolve("./views"))
app.set('view engine', 'ejs')


app.use(express.json()); // middleware to parse incomming bodies...
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
//-----------------manual server side rendering-----------------
// app.get("/test", async (req,res)=>{
//     const allUrls = await URL.find({});
//     return res.end(`
//         <html> 
//            <head> </head>
//              <body>
//                 <ol>
//                     ${allUrls.map(url=> `<li>${url.shortId} - ${url.redirectURL} - ${url.visitHistory.length} </li>`).join('')}
//                 </ol>
//              </body>
//         </html>
//         `
//     )
// })

//-------------------------------------------------------------------

//------------rendeRing using ejs--------------------------
// app.get("/test", async(req,res)=>{
//     const allUrls= await URL.find({});
//     // return res.render('home')
//     return res.render('home',{
//         urls: allUrls,
//     })

// })

//----------------------------------------------------------
app.use('/url', restrictToLoggedinUserOnly, urlRoute);
app.use("/", checkAuth, staticRoute);
app.use("/user", userRoute)

app.get('/url/:shortId', async(req, res)=>{
    const shortId = req.params.shortId;
    // console.log("Requested redirectURL:", req.params.redirectURL)
    // console.log("Requested Short ID:", shortId)
    const entry = await URL.findOneAndUpdate(
        
    {
        shortId,
    }, 
    { $push:
        {
        visitHistory:  
        {
            timestamp: Date.now(),
        },
    },

    } )
    // console.log("Entry from URL:", entry);
    if (!entry) {
        return res.status(404).send('Short URL not found');
    }
     res.redirect(entry.redirectURL)
})

app.listen(PORT, ()=>{
    console.log(`Server Started at PORT ${PORT}`)
})
