//to create authentication , we also requred different set of routes

const express = require("express")
const {handleUserSignup,handleUserLogin} = require("../controllers/use");

const router = express.Router();

router.post('/',handleUserSignup)
router.post('/login',handleUserLogin)

module.exports = router;