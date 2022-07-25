const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
// const Todo = require('../models/todoSchema')
const todoSchema = require('../models/todoSchema')
const userSchema = require('../models/User.Model')
const Todo = new mongoose.model("Todo", todoSchema)
const User = new mongoose.model("User", userSchema)

const checkLogin = require("../middlewares/checkLogin");





// get all the todo
router.get('/', async (req, res) => {
    await Todo.find({})
        // .populate({ path: 'user', select: 'name' })
        .populate("user", "name username -_id")
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



router.get('/all', async (req, res) => {
    let query = [
        {
            $lookup:
            {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user"
            }
        },
        // just show object format data
        { $unwind: '$user' },

        // which data i see
        // { $project: { "_id": 1, "title": 1, "description": 1, "status": 1, "user._id": 1, "user.username": 1, "user.name": 1 } }

        // which data i can't see
        { $project: { "user.todos": 0, "user.password": 0, "user.__v": 0 } }

    ]
    if (req.query.keyword && req.query.keyword != '') {
        query.push({
            $match: {
                $or: [
                    {
                        title: { $regex: req.query.keyword }
                    },
                    {
                        'user.username': { $regex: req.query.keyword }
                    }
                ]
            }
            // $match: { title: { $regex: req.query.keyword } }
        })
    }

    // multiple query
    if ((req.query.status && req.query.status != '') && (req.query.username && req.query.username != '')) {
        console.log(req.query.status, req.query.username);
        query.push({
            $match: {
                $and: [
                    {
                        status: { $regex: req.query.status }
                    },
                    {
                        'user.username': { $regex: req.query.username }
                    }
                ]
            }
            // $match: { title: { $regex: req.query.keyword } }
        })
    }

    // query by status
    if (req.query.status) {
        query.push({
            $match: {
                'status': req.query.status,
            }
        });
    }

    let users = await Todo.aggregate(query)
    return res.status(200).json({
        data: users,
        message: "Success"
    });
})
// callback function and async await eksathe use korthe hoi na, jekono ekta use korley hoi

// this is the call back function
// router.get('/', (req, res) => {
//     Todo.find({ status: "active" })
//         .select({
//             _id: 0,
//             __v: 0,
//             date: 0
//         })
//         .limit(3)
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


// get a todo by id
// Find the todo with the given `id`, or `null` if not found
// this is the async await
router.get('/:id', async (req, res) => {
    try {
        const data = await Todo.findOne({ _id: req.params.id })
        res.status(200).json({
            data: data
        })
    } catch (error) {
        res.status(500).json({
            error: "there are a server side error."
        })
    }
    // .exec((err, data) => {
    //     if (err) {
    //         res.status(500).json({
    //             error: "there are a server side error."
    //         })
    //     }
    //     if (data) {
    //         res.status(200).json({
    //             data: data
    //         })
    //     }

    // })
})


// get todo and filter by status
router.get('/:status', (req, res) => {
    Todo.find({ status: req.params.status })
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
router.get('/:status/:title', (req, res) => {
    Todo.find({ status: req.params.status, title: req.params.title })
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

// POST A TODO
router.post("/", checkLogin, async (req, res) => {
    const newTodo = new Todo({
        ...req.body,
        user: req.userId
    });

    try {
        const todo = await newTodo.save();

        // one user multiple todos
        await User.updateOne({
            _id: req.userId
        }, {
            $push: {
                todos: todo._id
            }
        });

        res.status(200).json({
            message: "Todo was inserted successfully!",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
});



// post multiple todo
router.post('/all', (req, res) => {
    Todo.insertMany(req.body, (err) => {
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

router.put('/:id', (req, res) => {
    const id = req.params.id
    Todo.findByIdAndUpdate({ _id: id }, {
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
router.delete('/:id', (req, res) => {
    const id = req.params.id
    Todo.deleteOne({ _id: id }, (err) => {
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
router.delete('/', (req, res) => {
    const id = req.params.id
    Todo.deleteMany({ status: "active" }, (err) => {
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