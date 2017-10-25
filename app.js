var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
var app = express()
var moment = require('moment')
var dotenv = require('dotenv')
dotenv.load()


// Port configuration
var port = process.env.PORT;

app.set('view engine', 'hjs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(function(req, res, next) {
  res.locals = {
    baseUrl: process.env.BASE_URL,
  };
  next()
})


app.use('/', require('./routes/home'))

app.get('*', function(req, res) {
  res.status(404).render('404', {
    title: "Page Not Found"
  });
});

app.listen(port)

console.log(`Switcher App at ${port}`);


