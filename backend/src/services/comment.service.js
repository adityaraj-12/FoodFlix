const Comment = require('../models/comment.model');
const Food = require('../models/food.model');

// Get comment count for each food item
async function getCommentCountsForFoods(foodIds) {
  const counts = await Comment.aggregate([
    { $match: { food: { $in: foodIds } } },
    { $group: { _id: '$food', count: { $sum: 1 } } }
  ]);
  // Map to {foodId: count}
  const map = {};
  counts.forEach(c => { map[c._id.toString()] = c.count; });
  return map;
}

module.exports = { getCommentCountsForFoods };