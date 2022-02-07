//console.log('hello world');
const port = process.env.PORT || 3000 //server port
const express = require('express') //express lib
const cors = require('cors') //cors lib
const mongoClient = require('mongodb').MongoClient;
//const http = require('http');
app.use(express.json())
app.use(cors())

//connecting to the mongoDB server
let db;
mongoClient.connect('mongodb+srv://hussein:Admin123@webapp.mzzs6.mongodb.net/', (err,client) => {
    db = client.db('WebApp')
})

// app.use(function (request, response, next) {
//     console.log('Income request for ' + request.url)
//     //response.end('hello from express middleware')
//     next()


app.get('/',(req, res, next) => {
    res.send('Welcome to MongoDb server. ')
})

app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((error, results) => {
        if(error) return next(error)
        res.send(results)
    })
})

app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    return next()
})
app.listen(port)

// })
// modules needed
// var path = require("path");
// var fs = require("fs");
// const { connect } = require('http2');

// app.use(function (req, res, next) {
//     // Uses path.join to find the path where the file should be
//     var filePath = path.join(__dirname,"static", req.url);
//     // Built-in fs.stat gets info about a file
//     fs.stat(filePath, function (err, fileInfo) {
//         if (err) {
//             next();
//             return;
//         }
//         if (fileInfo.isFile()) res.sendFile(filePath);
//         else next();
//     });
// });



// app.use(function (request, response) {
    
//     response.end(' the pass is sword fish.')
// })
// There is no 'next' argument because this is the last middleware.
// app.use(function(req, res) {
//     // Sets the status code to 404
//     res.status(404);
//     // Sends the error "File not found!”
//     res.send("File not found!");
//     });
    


// //http.createServer(app).listen(3000)
// app.listen(3000, function () {
//     console.log('server started')
// })