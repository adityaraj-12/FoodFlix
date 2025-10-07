const mongoose = require('mongoose');

const saveSchema = new mongoose.Schema({    
    userId: { type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
          required: true },
    foodItemId: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'food', 
         required: true },
}, { timestamps: true });

const saveModel = mongoose.model('Save', saveSchema);

module.exports = saveModel;