
var express = require("express");
var app = express();
var cors = require('cors')
var bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://hussein:Admin123@webapp.mzzs6.mongodb.net/";

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// connect to CST3145 database which contains multiple collections (lessons/users/orders placed)
let database
mongoClient.connect(uri, function(err,client){
    database = client.db('cst3145')
})

// parameter blueprint
app.param('collectionName', function(req,res,next,collectionName){
  req.collection = database.collection(collectionName)
  return next()
})

//get Database data of the appropriate collection name
app.get('/collection/:collectionName',function(req,res,next){
  req.collection.find({}).toArray(function(err,results){
      if (err){
          return next(err)
      }
      else{
          res.send(results)
      }
  })
})

//saves new order to the placedOrdersDB database
app.post('/collection/:collectionName',function(req,res,next){
  req.collection.insertOne(req.body,function(err,result){
      if (err){
          return next(err)
      }
      else{
          res.send("success")
      }
  })
})

//updates number of spaces
app.put('/collection/:collectionName',function(req,res,next){
  console.log(req.body);
  let i = 0;
  req.body.lesson_ID.forEach(element => {
    console.log(element);
    console.log(req.body.spaces[i]);
    req.collection.updateOne({
      id: element
    }, {
      $set: {
        spaces: req.body.spaces[i]
      }
    })
    i++
  });
})

// search database by either location or subject (full-text only)
app.get('/collection/:collectionName/:value',function(req,res,next) {  
  let value = req.params.value
  
  req.collection.find({$text: {$search: value}}).toArray(function(err,result) {
    if (err){
      return next(err)
    }
    else{
      console.log(result);
      res.send(result)
    }
  })
})


//logger
app.use(function(req,res,next){
  console.log("Request ID: "+req.url)
  console.log("Request Date: "+ new Date())
  next()
})

// returning a 404 error when path is not found
app.use(function (request, response) {
  response.status(404).send("page not found");
});

const port = process.env.PORT || 3000
app.listen(port)
