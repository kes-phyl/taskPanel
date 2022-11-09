const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const _ = require('lodash');

const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static('public'));

//constant title

const day = 'Today';


//connecting to the database... 

mongoose.connect(
    'mongodb+srv://admin-phylbert:Test123@cluster0.uvhdaky.mongodb.net/tasksDB'
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
  const listTitle = req.body.lists;

  const task = new Task({
    item: taskItem
  })

  if(listTitle === 'Today'){
     task.save();
     res.redirect('/');
   }else{
    List.findOne({name: listTitle}, function(err, foundLists){
        foundLists.item.push(task);
        foundLists.save();
        res.redirect('/' + listTitle)
    })
   }


  
})

app.post('/delete', function(req, res){
    const eraseId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === 'Today'){
        Task.findByIdAndRemove(eraseId, function(err){
            if (err){
                console.log(err)
            }else{
                console.log('sucessfully deleted');
                res.redirect('/')
            }
        })
    }else{
        List.findOneAndUpdate({name: listName}, {$pull: {item: {_id: eraseId}}}, function(err, foundList){
            if(!err){
                res.redirect('/' + listName);
            }
        })
    }
  
})


//dynamic route for custom list.......

app.get('/:customListName', function(req, res){
    const customListName = _.capitalize(req.params.customListName);
   

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


app.listen(process.env.PORT || 3000, function(){
    console.log('listening on port 3000')
})