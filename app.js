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
    //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

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

    //Delete all tasks within a tasklist if a tasklist is deleted
    const deleteAllContainigTask = (taskList) => {
        Task.deleteMany({ _taskListId: req.params.tasklistId})
            .then(()=>{return taskList})
            .catch((error)=>{console.log(error)});
    }
    const responsetaskList = TaskList.findOneAndDelete(req.params.tasklistId)
    .then((taskList)=>{
        deleteAllContainigTask(taskList)
        
    })
    .catch((error)=>{console.log(error)});

    res.status(200).send(responsetaskList)
});

/* CRUD operations for Task, a task should always belong to a TasList */
// Get all tasks for 1 TaskList, http://localhost:3000/taskslists/:tasklistId/tasks/:taskId
app.get('/taskslists/:tasklistId/tasks', (req, res)=>{
    Task.find({_taskListId: req.params.tasklistId})
    .then((tasks)=>{
        res.status(200).send(tasks)
    })
    .catch((error)=>{console.log(error)});
});
//Create a task inside a particular Task List
app.post('/taskslists/:tasklistId/tasks', (req, res) =>{
    console.log(req.body);

    let taskObj = { 'title': req.body.title, '_taskListId': req.params.tasklistId};
    Task(taskObj).save()
        .then((task) => {
            res.status(201).send(task);
        })
        .catch((error) => { 
            console.log(error);
            res.status(500);
        });
});

// http://localhost:3000/taskslists/:tasklistId/tasks/:taskId
// Get 1 task inside 1 TaskList
app.get('/taskslists/:tasklistId/tasks/:taskId', (req, res)=>{
    Task.findOne({_taskListId: req.params.tasklistId, _id: req.params.taskId})
    .then((task)=>{
        res.status(200).send(task)
    })
    .catch((error)=>{console.log(error)});
});

//Update 1 task belonging to 1 TaskList
app.patch('/taskslists/:tasklistId/tasks/:taskId', (req, res) =>{
    Task.findOneAndUpdate({ _taskListId: req.params.tasklistId, _id: req.params.taskId},{ $set: req.body})
    .then((task)=>{
        res.status(200).send(task)
    })
    .catch((error)=>{console.log(error)});
});

//Delete 1 task belonging to 1 TaskList
app.delete('/taskslists/:tasklistId/tasks/:taskId', (req, res) =>{
    Task.findOneAndDelete({ _taskListId: req.params.tasklistId, _id: req.params.taskId})
    .then((task)=>{
        res.status(200).send(task)
    })
    .catch((error)=>{console.log(error)});
});


/*app.listen(3000, function(){
    console.log("Server started on port 3000...");
}); */

app.listen(3000, () =>{
    console.log("Server started on port 3000...");
});
