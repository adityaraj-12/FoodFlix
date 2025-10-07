const foodPartnerModel = require("../models/foodpartner.model");
const foodModel = require("../models/food.model");

async function getFoodPartnerProfile(req, res) {
    const foodPartnerId = req.params.id;
    const foodPartner = await foodPartnerModel.findById(foodPartnerId);
    const foodItems = await foodModel.find({ foodPartner: foodPartnerId });
    if (!foodPartner) {
        return res.status(404).json({ message: "Food partner not found" });
    }
    res.status(200).json({
        name: foodPartner.name,
        address: foodPartner.address,
        // avatar: foodPartner.avatar || null,
        totalMeals: foodItems.length,
        // customerServed: foodItems.reduce((sum, item) => sum + (item.servedCount || 0), 0),
        videos: foodItems.map(item => ({ id: item._id, label: item.video || 'video' })), 
    });
}

module.exports = {
    getFoodPartnerProfile,
    
}