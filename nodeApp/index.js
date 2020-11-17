
//#region "Imports"

const express = require('express');     // Middleware to handle HTTP REST API  
const contacts = require('./routes/contacts');     
const home = require('./routes/home');         

//#endregion

var app = express();

//#region "Routing"

app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});
app.use('/api/contacts', contacts);   //direct to a contacts router
app.use('/', home);                     //direct to a home router

//#endregion

//#region  "Open PORT : 3000"
const port = process.env.PORT || 3000;  // Take port number from Environment variable
app.listen(port, function()
{
    console.log(`Listening to port ${port} ...`);
});
//#endregion