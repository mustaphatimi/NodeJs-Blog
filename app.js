require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const cookieParser = require('cookie-parser')
const expressLayout = require('express-ejs-layouts')
// const ejsMate = require('ejs-mate')
const session = require('express-session')
const blogRoutes = require('./routes/blogRoutes')
const userRoutes = require('./routes/userRoutes')
const app = express();
const port = 5000 || process.env.port

const sessionConfig = {
    secret: 'kingdom cats',
    resave: true,
    saveUninitialized: true
}


// Templating engine
app.use(expressLayout);
app.set('layout', path.join(__dirname, 'views/layouts/boilerplate'));
app.set('view engine', 'ejs')
// app.engine('ejs', ejsMate)


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session(sessionConfig))
app.use(cookieParser())



const dbUrl = process.env.ATLAS_URI || 'mongodb://localhost:27017/nodejsBlog'

mongoose.connect(dbUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    app.listen(port, () => {
        console.log(`App listening on port ${port}`)
    })
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log('Connection to Database successful')
})

app.use('/', blogRoutes)
app.use('/user', userRoutes)

app.use((err, req, res, next) => {
    const { message = 'Server Error', status = 500 } = err;
    res.send({ error: message, status: status })
})

