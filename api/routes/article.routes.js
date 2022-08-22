const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const article = require('../models/articles.Model')
const Article = new mongoose.model("Article", article)
const path = require('path')
const shortid = require('shortid')
const multer = require('multer')


// const storage = multer.diskStorage({
//     destination:(req,file,callback)=>{
//         callback(null."./")
//     }
// })
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, shortid.generate() + '-' + file.originalname)
    }
})
const upload = multer({ storage })


router.get('/', function (req, res) {
    res.send('POST request to the homepage')
})


router.post('/', upload.single("articleImage"), async (req, res) => {
    // console.log(req.body, req.file.originalname);
    try {
        const article = new Article({
            title: req.body.title,
            article: req.body.article,
            articleImage: req.file.originalname
        })
        // console.log("..........", article)

        await article.save()
        res.status(200).json({
            message: "article successfully inserted",
        });

    } catch (error) {
        res.status(500).json({ err: "server side error" })
    }
})

module.exports = router