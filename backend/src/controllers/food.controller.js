
const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel = require('../models/likes.model');
const saveModel = require('../models/save.model');
const commentModel = require('../models/comment.model');
const { v4: uuid } = require("uuid");

async function createFood(req, res) {

    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());

    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        video: fileUploadResult.url, 
        foodPartner: req.foodPartner._id
    })
    
    res.status(201).json({
        message: "food created successfully",
        food: foodItem,
    })
}

const { getCommentCountsForFoods } = require('../services/comment.service');
const { getSaveCountsForFoods } = require('../services/save.service');
const { getLikeCount } = require('../services/like.service');
// API: GET /api/food/:foodId/likeCount
async function getLikeCountController(req, res) {
    return getLikeCount(req, res);
}

async function getFoodItems(req, res) {
    // Fetch all food items
    const foodItems = await foodModel.find({}).populate("foodPartner");
    const foodIds = foodItems.map(f => f._id);

    // Get like counts (from likeCount field), save counts, and comment counts
    // Like count is already in foodItem.likeCount
    const [saveCounts, commentCounts] = await Promise.all([
        getSaveCountsForFoods(foodIds),
        getCommentCountsForFoods(foodIds)
    ]);

    // Attach counts to each food item
    const foodItemWithCounts = foodItems.map(item => {
        return {
            ...item.toObject(),
            likeCount: item.likeCount || 0,
            saveCount: saveCounts[item._id.toString()] || 0,
            commentCount: commentCounts[item._id.toString()] || 0
        };
    });

    res.status(200).json({
        message: "Food item fetched successfully",
        foodItem: foodItemWithCounts
    });
}

async function likeFood(req, res) {
    const {foodId} = req.body;
    console.log(foodId);
    const user = req.user;

    const isLiked = await likeModel.findOne({food: foodId, user: user._id});

    if(isLiked) {
        await likeModel.deleteOne({food: foodId, user: user._id});

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: {likeCount: -1}
        })

        return res.status(400).json({
            message: "Food already liked"
        })
    }
    const newLike = await likeModel.create({
        food: foodId,
        user: user._id
    });

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: {likeCount: 1}
    })


    res.status(200).json({
        message: "Food liked successfully",
        like: newLike,
        likeCount: await likeModel.countDocuments({_id: foodId}),
    })
}


async function saveFood(req, res) {
    const {foodId} = req.body;
    const user = req.user;
    const isSaved = await saveModel.findOne({foodItemId: foodId, userId: user._id});

    if(isSaved) {
        await saveModel.deleteOne({foodItemId: foodId, userId: user._id});
        return res.status(400).json({
            message: "Food already saved"
        })
    }
    const newSave = await saveModel.create({
        foodItemId: foodId,
        userId: user._id
    });

    res.status(200).json({
        message: "Food saved successfully",
        save: newSave
    })
}

async function getSavedFoods(req, res) {
    const user = req.user;
    const savedItems = await saveModel.find({userId: user._id}).populate({ path: 'foodItemId', populate: { path: 'foodPartner' } });
    const foodItems = savedItems.map(item => item.foodItemId);
    res.status(200).json({
        message: "Saved food items fetched successfully",
        savedItems: foodItems
    });
}

async function commentFood(req, res) {
    const {foodId, comment} = req.body;
    const user = req.user; 

    const cmt = await commentModel.create({
        food: foodId,
        user: user._id,
        comment: comment
    });

    res.status(201).json({
        message: "Comment added successfully",
        comment: cmt
    });
}
 
module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSavedFoods,
    getLikeCount: getLikeCountController,
    commentFood
}