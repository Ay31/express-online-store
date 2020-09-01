var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var bodyParser = require('body-parser')

const mongoose = require('mongoose')

let index = require('./routes/index')
let users = require('./routes/users')
const api = require('./routes/api/api')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// mongoose.connect(`mongodb://localhost:27017/test`)

mongoose
    .connect(process.env.MONGO_URI || `mongodb://localhost:27017/store`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASSWORD,
    })
    .then(() => console.log('connect suc'))

app.all('*/', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*') // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    // Set custom headers for CORS
    res.header(
        'Access-Control-Allow-Headers',
        'Content-type,Accept,X-Access-Token,X-Key'
    )
    if (req.method == 'OPTIONS') {
        res.status(200).end()
    } else {
        next()
    }
})
// app.use(logger('dev'))
// app.use(express.json())
// app.use(express.urlencoded({ extended: false }))
// app.use(cookieParser())
// app.use(express.static(path.join(__dirname, 'public')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', index)
app.use('/users', users)
app.use('/api/v1', api)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app
