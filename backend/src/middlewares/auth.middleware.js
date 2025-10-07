const foodPartnerModel = require("../models/foodpartner.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function authFoodPartnerMiddleware(req, res, next) {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message: "Please login first",
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const foodPartner = await foodPartnerModel.findOne({_id: decoded.id});
        req.foodPartner = foodPartner;

        next();

    }catch(err){
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}

async function authUserMiddleware(req, res, next) {
    
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message: "please log in first"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findOne({_id: decoded.id});

        req.user = user;

        next();

    }catch(err){
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}

module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware
}