const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
// const Todo = require('../models/todoSchema')
const todoSchema = require('../models/todoSchema')
const Todo = new mongoose.model("Todo", todoSchema)


// get all the todo
router.get('/', async (req, res) => {

})

// get a todo by id
router.get('/:id', async (req, res) => {

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
router.put('/:id', async (req, res) => {

})


// delete todo
router.delete('/:id', async (req, res) => {

})


module.exports = router