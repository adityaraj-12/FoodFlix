const express = require('express');
const { authFoodPartnerMiddleware } = require('../middlewares/auth.middleware');
const foodPartnerController = require('../controllers/food-partner.controller');
const router = express.Router();

// api/food/food-partner/id
router.get('/:id', authFoodPartnerMiddleware, foodPartnerController.getFoodPartnerProfile);


module.exports = router; 
