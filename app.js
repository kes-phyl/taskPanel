const express = require('express');
const bodyParser = require('body-parser');
const newItems = ['Buy Food', 'Cook Food', 'Eat Food'];
const date = require(__dirname + '/date.js')
const newWorkActivity = ['learn coding'];

const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static('public'));

app.get('/', function(req, res){
   const day = date.getDate();
   res.render('lists', {kindOfDay: day, newActivity: newItems});
})

//creating a post route

app.post('/', function(req, res){
    console.log(req.body)
    const items = req.body.newItem;
    if(req.body.lists === 'Thursday'){
        newWorkActivity.push(items) 
        res.redirect('/work');
    }else{
        newItems.push(items) 
        res.redirect('/');
    }
   
   
})


app.get('/work', function(req, res){
    
    const day = date.getDay();
    res.render('lists', {kindOfDay: day, newActivity: newWorkActivity })
})


app.listen(3000, function(){
    console.log('listening on port 3000')
})