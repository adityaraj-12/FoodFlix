const mongoose = require('mongoose');


function connectDB(){
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log('database connected')
    })
    .catch((err)=>{
        console.log('database connection error:', err)
    })
}

module.exports = connectDB;