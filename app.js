const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js')
const newWorkActivity = ['learn coding'];
const mongoose = require('mongoose')

const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static('public'));




//connecting to the database... 

mongoose.connect(
    'mongodb://127.0.0.1:27017/tasksDB'
  )
  .then(()=>console.log('connected'))
  .catch(e=>console.log(e));


// const connectDB = async ()=>{
//     try{
//         await mongoose.connect('mongodb://localhost:27017/tasksDB');
//         console.log('connected successfully..!');
//     }catch(err){
//         console.log('failed to connect')
//     }
// }




const taskSchema = {
    name: String
}

const Task = mongoose.model('task', taskSchema);


const firstTask = new Task({
    name: 'Welcome to the task app'
})
// firstTask.save(function(err){
//     if(err){
//         console.log(err)
//     }else{
//         console.log('succesffully added..')
//     }
// })
const secondTask = new Task({
    name: 'Hit the + button to add a new task.'
})
const thirdTask = new Task({
    name: '<--- Hit this to delete an item'
})

const newTasks = [firstTask, secondTask, thirdTask];
// Task.insertMany(newTasks, function(err){
//     if(err){
//         console.log(err)
//     }else{
//         console.log('saved sucessfully');
//     }
// });



app.get('/', function(req, res){

    const day = date.getDate();
    Task.find({}, function(err, foundTasks){
    if(foundTasks.length === 0 ){
        Task.insertMany(newTasks, function(err){
          
    if(err){
        console.log(err)
    }else{
        console.log('saved sucessfully');
       res.redirect('/')
    }
});
    }else{
        res.render('lists', {kindOfDay: day, newActivity: foundTasks})

    }
    
   })
 })




//creating a post route

app.post('/', function(req, res){
  const taskItem = req.body.newItem;

  const task = new Task({
    name: taskItem
  })

  task.save();
  res.redirect('/');
   
})

app.post('/delete', function(req, res){
    const eraseId = req.body.checkbox;
    Task.findByIdAndRemove(eraseId, function(err){
        if (err){
            console.log(err)
        }else{
            console.log('sucessfully deleted');
            res.redirect('/')
        }
    })
})


app.get('/work', function(req, res){
    
    const day = date.getDay();
    res.render('lists', {kindOfDay: day, newActivity: newWorkActivity })
})


app.listen(3000, function(){
    console.log('listening on port 3000')
})