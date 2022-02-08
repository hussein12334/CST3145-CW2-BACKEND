const express = require('express') //express lib
const cors = require('cors') //cors lib
const mongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const path = require("path");
const fs = require("fs");
const app = express();

app.use(express())
app.use(cors())

//connecting to the mongoDB server
let db;
mongoClient.connect('mongodb+srv://hussein:Admin123@webapp.mzzs6.mongodb.net/', (err, client) => {
    db = client.db('WebApp')
})
//get collection name
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    return next()
})

//first page of mongo server
app.get('/', (req, res, next) => {
    res.send('Welcome to MongoDb server. ')
})

//displays the collections from user input on url
app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((error, results) => {
        if (error) return next(error);
        res.send(results)
    })
})

app.use('/images', function (req, res, next) {
    // Uses path.join to find the path where the file should be
    var filePath = path.join(__dirname, 'static', req.url);
    // Built-in fs.stat gets info about a file
    fs.stat(filePath, function (err, fileInfo) {
        if (err) {
            next();
            return;
        }
        if (fileInfo.isFile()) res.sendFile(filePath);
        else next();
    })
})
//posting data
app.post("/collection/:collectionName", (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
      if (e) return next(e)
      //allow different IP address
      res.header("Access-Control-Allow-Origin", "*");
      //allow different header fields
      res.header("Access-Control-Allow-Headers", "*");
      res.header("Access-Control-Allow-Credentials", true);
      res.send(results.ops)
    })
})

//retreives object via id
app.get('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
        if (e) return next(e)
        res.send(result)
    })
})

//replaces objects
app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.update(
    {_id: new ObjectID(req.params.id)},
    {$set: req.body},
    {safe: true, multi: false},
    (e, result) => {
    if (e) return next(e)
    res.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})
    })
})

//deletes objects
app.delete('/collection/:collectionName/:id', (req,res,next) =>{
    req.collection.deleteOne(
        {_id: ObjectID(req.params.id)},
        (e,result)=>{
            if(e) return next(e)
            res.send((result.result.n === 1)? {msg:'success'} : {msg:'error'})
        }
    )
})

const port = process.env.PORT || 3000
app.listen(port)
