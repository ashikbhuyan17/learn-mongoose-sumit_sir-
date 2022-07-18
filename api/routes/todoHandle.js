const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
// const Todo = require('../models/todoSchema')
const todoSchema = require('../models/todoSchema')
const Todo = new mongoose.model("Todo", todoSchema)




// post a todo
router.post('/', async (req, res) => {
    const newTodo = new Todo(req.body)
    await newTodo.save((err) => {
        if (err) {
            res.status(500).json({
                error: "there are a server side error."
            })
        } else {
            res.status(201).json({
                message: "todo was inserted successfully."
            })
        }
        // if(data){
        //     res.status(201).json({
        //         message:"todo was inserted successfully."
        //     })
        // }
    })
})


// post multiple todo
router.post('/all', async (req, res) => {
    await Todo.insertMany(req.body, (err) => {
        if (err) {
            res.status(500).json({
                error: "there are a server side error."
            })
        } else {
            res.status(201).json({
                message: "todo was inserted successfully."
            })
        }
    })
})

// put  todo
// router.put('/:id', async (req, res) => {
//     const id = req.params.id
//     await Todo.updateOne({_id:id},{
//         $set:{
//             status:'active'
//         }
//     },(err)=>{
//         if (err) {
//             res.status(500).json({
//                 error: "there are a server side error."
//             })
//         } else {
//             res.status(201).json({
//                 message: "todo was updated successfully."
//             })
//         }
//     })
// })

router.put('/:id', async (req, res) => {
    const id = req.params.id
    await Todo.findByIdAndUpdate({ _id: id }, {
        $set: {
            status: 'active'
        }
    }, {
        new: true,
        useFindAndModify: false
    }
        , (err, data) => {
            if (err) {
                res.status(500).json({
                    error: "there are a server side error."
                })
            } else {
                res.status(200).json({
                    message: "todo was updated successfully.",
                    data: data
                })
            }
        })
})


// multiple filter
router.put('/:id', async (req, res) => {
    const id = req.params.id
    const status = req.params.status
    await Todo.updateOne({ _id: id, status: status })
})

// delete todo
router.delete('/:id', async (req, res) => {

})


module.exports = router