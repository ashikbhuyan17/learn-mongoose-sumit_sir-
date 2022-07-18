const express = require('express')
const route = express.Router()
const app = express()
const port = 5000

//middleware
const cors = require('cors')
const morgan = require('morgan')

// mongoose for database
const mongoose = require('mongoose');



// parse application/json
// app.use(bodyParser.json())
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

// database collection
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/mongoose-todo', {    //contacts-db => documents     and table = collection
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("database connection done"))
    .catch((err) => console.log(err))
// const db = mongoose.connection
// db.on('error', (err) => {
//     console.log(err);
// })
// db.once('open', () => {
//     console.log("database connection done  ");
// })


// GET method route
app.get('/', (req, res) => res.send('Hello World!'))


// import router
const userRoute = require('./api/routes/user.route')
const todoHandle = require('./api/routes/todoHandle')
app.use('/user', userRoute)
app.use('/todo', todoHandle)




//server 
app.listen(5000, () => {
    console.log("listing on port 5000 ");
})
