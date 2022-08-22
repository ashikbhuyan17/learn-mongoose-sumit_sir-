const mongoose = require('mongoose')

const article = mongoose.Schema({  //create schema
    title: {
        type: String,
        required: true
    },
    article: String,
    articleImage: {
        type: String,
        // require: true
    }

})
module.exports = article