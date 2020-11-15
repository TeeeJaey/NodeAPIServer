
//#region "Imports"

const express = require('express');     // Middleware to handle HTTP REST API  
const helmet = require('helmet');       // Secures the app with various HTTP headers
const morgan = require('morgan');       // Logs HTTP Reuests
const config = require('config');       // Make ap configurable using JSON config files

const contacts = require('./routes/contacts');     
const home = require('./routes/home');     

//#endregion

var app = express();

app.set('view engine', 'pug');          // set view templating engine
app.set('views', './views');            // default view folder

//#region "Routing"
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});
app.use('/api/contacts', contacts);   //direct to a contacts router
app.use('/', home);                     //direct to a home router

//#endregion

//#region "Middlewares"

app.use(express.json());
app.use(helmet());

const env = process.env.NODE_ENV || "development";  // Get environment from Environment variable
if(env == "development")
{
    app.use(morgan('tiny'))
    console.log("Morgan Logging enabled")
}

app.use(express.static('static'));                  // show static files

//#endregion

//#region "Configuration"

console.log("Application Name : " + config.get('name'));
console.log("Mail server : " + config.get('mail.host'));
//console.log("Mail password : " + config.get('mail.password'));  // env variable - password

//#endregion

//#region  "Open PORT : 3000"
const port = process.env.PORT || 3000;  // Take port number from Environment variable
app.listen(port, function()
{
    console.log(`Listening to port ${port} ...`);
});
//#endregion