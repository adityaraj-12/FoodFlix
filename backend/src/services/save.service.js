const Save = require('../models/save.model');

// Get save count for each food item
async function getSaveCountsForFoods(foodIds) {
  const counts = await Save.aggregate([
    { $match: { foodItemId: { $in: foodIds } } },
    { $group: { _id: '$foodItemId', count: { $sum: 1 } } }
  ]);
  // Map to {foodId: count}
  const map = {};
  counts.forEach(c => { map[c._id.toString()] = c.count; });
  return map;
}

module.exports = { getSaveCountsForFoods };