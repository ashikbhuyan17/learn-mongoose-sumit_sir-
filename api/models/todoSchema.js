const mongoose = require('mongoose')

const todoSchema = mongoose.Schema({  //create schema
    title: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ["active", "inactive"]
    },
    date: {
        type: Date,
        default: Date.now
    }

})
module.exports = todoSchema


// const mongoose = require('mongoose')
// const valid = require('validator')
// const Schema = mongoose.Schema

// const todoSchema = Schema({  //create schema
//     title: {
//         type: String,
//         required:true
//     },
//     description:String,
//     status:{
//         type: String,
//         enum:["active","inactive"]
//     },
//     date:{
//         type:Date,
//         default:Date.now
//     }

// })

// const Todo = mongoose.model('Todo', todoSchema)  //create model
// module.exports = Todo