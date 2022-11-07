const express = require('express');
const bodyParser = require('body-parser');
const newWorkActivity = ['learn coding'];
const mongoose = require('mongoose')

const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static('public'));

//constant title

const day = 'Today';


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
    item: String
}

const Task = mongoose.model('task', taskSchema);



//creating a new database schema and model for every dynamic list 

const listSchema = {
    name: String,
    item: [taskSchema]
}

const List = mongoose.model('list', listSchema);





//default items added to the database......

const firstTask = new Task({
    item: 'Welcome to the task app'
})

const secondTask = new Task({
    item: 'Hit the + button to add a new task.'
})
const thirdTask = new Task({
    item: '<--- Hit this to delete an item'
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
    Task.find({}, function(err, foundTasks){
    if(foundTasks.length === 0 ){
        Task.insertMany(newTasks, function(err){
          
    if(err){
        console.log(err)
    }else{
        console.log('saved sucessfully')
       res.redirect('/')
    }
});
    }else{
        res.render('lists', {kindOfDay: day, newActivity: foundTasks})

    }
    
   })
 })




//creating a post route, that catches the input of the form and add item to the desired database

app.post('/', function(req, res){
  const taskItem = req.body.newItem;
  const listName = req.body.lists;

  const task = new Task({
    item: taskItem
  })

  if(listName === 'Today'){
     task.save();
     res.redirect('/');
   }else{
    List.findOne({name: listName}, function(err, foundLists){
        foundLists.item.push(task);
        foundLists.save();
        res.redirect('/' + listName)
    })
   }


  
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


//dynamic route for custom list.......

app.get('/:customListName', function(req, res){
    const customListName = req.params.customListName;

    List.findOne({name: customListName}, function(err, foundList){
        if(!err){
            if(!foundList){
                const list = new List({
                name: customListName,
                item: newTasks
            })
            list.save();
            res.redirect('/'+ customListName)
            }else{
                res.render('lists', {kindOfDay: foundList.name, newActivity: foundList.item})
            }
        }
        
    })
})


app.listen(3000, function(){
    console.log('listening on port 3000')
})