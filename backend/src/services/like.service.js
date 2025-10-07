const likeModel = require('../models/likes.model');
const foodModel = require('../models/food.model');

async function getLikeCount(req, res) {
    const {foodId} = req.params;
    const food = await foodModel.findById(foodId);
    const likeCount = food.likeCount;   
    res.status(200).json({ likeCount });
}

module.exports = { getLikeCount };