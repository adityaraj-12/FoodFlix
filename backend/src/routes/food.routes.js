const express = require('express');
const foodController = require('../controllers/food.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');
const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
})

// POST API FOOD protected
router.post('/', authMiddleware.authFoodPartnerMiddleware, upload.single("video"), foodController.createFood)

// Get / api/food/ protected
router.get("/", authMiddleware.authUserMiddleware, foodController.getFoodItems );

//Post /api/food/like protected
router.post("/like", authMiddleware.authUserMiddleware, foodController.likeFood);

//Get /api/food/:foodId/likeCount protected
router.get("/:foodId/likeCount", authMiddleware.authUserMiddleware, foodController.getLikeCount);



//save
router.post("/save", authMiddleware.authUserMiddleware, foodController.saveFood);

// Get saved food items for user
router.get("/save", authMiddleware.authUserMiddleware, foodController.getSavedFoods);

//comment
router.post("/comment", authMiddleware.authUserMiddleware, foodController.commentFood);



module.exports = router;