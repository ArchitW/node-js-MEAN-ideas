const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const app= express();
const port = 5000;

//Mongoose Connection
mongoose.connect('mongodb://localhost/vid-db',{
    //useMongoClient:true //deprecated careful...
})
    .then(()=> console.log('Connection Success'))
    .catch(error=>console.log(err));
//test connection , use promise .then()...

//use created model
require('./models/Idea');
const Idea = mongoose.model('ideas');

app.engine('handlebars',exphbs({
    defaultLayout:'main'
}));
app.set('view engine','handlebars');

/* Middle Ware Example
    app.use(function(req,res,next){
        console.log(Date.now());
        next();
    });
*/


app.get('/',(req,res)=> {
   res.render('index');
});
app.get('/about',(req , res)=> {
    res.render('about');
});

app.listen(port,()=>{

   console.log(`server started at port ${port}`);
});
