const express = require('express');
const app = express();
const mongoose = require('./database/mongoose');

const TaskList = require('./database/models/taskList');
const Task = require('./database/models/task');





/* 
CORS - Cross Origin Request Security
Backend - http://localhost;3000
Frontend -http://localhost;4200
*/
// 3rd party library, app.use(cors());
// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


//Example of middleware
app.use(express.json()); // or 3rd party bodyParser

//Routes of REST API Endpoints or RESFUL webservices Endpoints
/* 
    Tasklist - Create, Update, ReadTaskListById, ReadAllTaskList
    Task - Create, Update, ReadTaskById, ReadAllTask
*/

// Routes or API Endpoints for TaskList model
// Get All Task Lists
// http://localhost:3000/tasklists => [ {TaskList}, {TaskList} ]
// https://www.restapitutorial.com/lessons/httpmethods.html

/*app.get('/tasklists', function(req, res){
    TaskList.find({})
        .then(function(lists) {res.send(lists)})
        .catch(function(error) {console.log(error)});
}); */


app.get('/tasklists', (req, res) => {
    TaskList.find({})
        .then((lists) => {
            res.status(201).send(lists);
        })
        .catch((error) => {
            console.log(error);
            res.status(500);
        });
});

// Route or Endpoint for creating a TaskList
app.post('/tasklists', (req, res) =>{
    //console.log("Hello I am inside post method");
    console.log(req.body);

    let taskListObj = { 'title': req.body.title};
    TaskList(taskListObj).save()
        .then((taskList) => {
            res.status(201).send(taskList);
        })
        .catch((error) => { 
            console.log(error);
            res.status(500);
        });
});

//Endpoint to get One tasklist by tasklistId : http://localhost:3000/tasklists/62de4fee18369fcc45cfb231
app.get(
    '/tasklists/:tasklistId', (req, res) => {
        let tasklistId = req.params.tasklistId;
        TaskList.find({ _id: tasklistId})
            .then((taskList)=>{
                res.status(200).send(taskList)
            })
            .catch((error)=>{
                console.log(error)
            });
    }
);

// update one tasklist

// PUT method full update of object and 
app.put('/tasklists/:tasklistId', (req, res) =>{
    TaskList.findOneAndUpdate({ _id: req.params.tasklistId}, { $set: req.body})
    .then((taskList)=>{
        res.status(200).send(taskList)
     })
    .catch((error)=>{console.log(error)});
});

// Patch is partial update of one field of an object
app.patch('/tasklists/:tasklistId', (req, res) =>{
    TaskList.findOneAndUpdate({ _id: req.params.tasklistId}, { $set: req.body})
    .then((taskList)=>{
        res.status(200).send(taskList)
    })
    .catch((error)=>{console.log(error)});
});

//Delete a tasklist by Id
app.delete('/tasklists/:tasklistId', (req, res) =>{
    TaskList.findOneAndDelete(req.params.tasklistId)
    .then((taskList)=>{
        res.status(201).send(taskList)
    })
    .catch((error)=>{console.log(error)});
});

/*app.listen(3000, function(){
    console.log("Server started on port 3000...");
}); */

app.listen(3000, () =>{
    console.log("Server started on port 3000...");
});
