const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
// const Todo = require('../models/todoSchema')
const todoSchema = require('../models/todoSchema')
const Todo = new mongoose.model("Todo", todoSchema)






// get all the todo
// router.get('/', async (req, res) => {
//     await Todo.find({})
//         .exec((err, data) => {
//             if (err) {
//                 res.status(500).json({
//                     error: "there are a server side error."
//                 })
//             }
//             if (data) {
//                 res.status(200).json({
//                     data: data
//                 })
//             }

//         })
// })


router.get('/', async (req, res) => {
    await Todo.find({ status: "active" })
        .select({
            _id: 0,
            __v: 0,
            date: 0
        })
        .limit(3)
        .exec((err, data) => {
            if (err) {
                res.status(500).json({
                    error: "there are a server side error."
                })
            }
            if (data) {
                res.status(200).json({
                    data: data
                })
            }

        })
})


// get a todo by id
// Find the todo with the given `id`, or `null` if not found
router.get('/:id', async (req, res) => {
    await Todo.find({ _id: req.params.id })
        .exec((err, data) => {
            if (err) {
                res.status(500).json({
                    error: "there are a server side error."
                })
            }
            if (data) {
                res.status(200).json({
                    data: data
                })
            }

        })
})


// get todo and filter by status
router.get('/:status', async (req, res) => {
    await Todo.find({ status: req.params.status })
        .exec((err, data) => {
            if (err) {
                res.status(500).json({
                    error: "there are a server side error."
                })
            }
            if (data) {
                res.status(200).json({
                    data: data
                })
            }

        })
})


// get todo and multiple filter by status,title
router.get('/:status/:title', async (req, res) => {
    await Todo.find({ status: req.params.status, title: req.params.title })
        .exec((err, data) => {
            if (err) {
                res.status(500).json({
                    error: "there are a server side error."
                })
            }
            if (data) {
                res.status(200).json({
                    data: data
                })
            }

        })
})

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
// router.put('/:id', async (req, res) => {
//     const id = req.params.id
//     const status = req.params.status
//     await Todo.updateOne({ _id: id, status: status })
// })

// delete a todo
router.delete('/:id', async (req, res) => {
    const id = req.params.id
    await Todo.deleteOne({ _id: id }, (err) => {
        if (err) {
            res.status(500).json({
                error: "there are a server side error."
            })
        } else {
            res.status(200).json({
                message: "delete successfully"
            })
        }
    })

})

// delete multiple todo
router.delete('/', async (req, res) => {
    const id = req.params.id
    await Todo.deleteMany({ status: "active" }, (err) => {
        if (err) {
            res.status(500).json({
                error: "there are a server side error."
            })
        } else {
            res.status(200).json({
                message: "delete multiple todo successfully"
            })
        }
    })

})


module.exports = router