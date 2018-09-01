const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

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
//Method Override
app.use(methodOverride('_method'));

//

//body parser middle ware
app.use(bodyParser.urlencoded({extend:false}));
app.use(bodyParser.json());


app.get('/',(req,res)=> {
   res.render('index');
});
app.get('/about',(req , res)=> {
    res.render('about');
});
app.get('/ideas/add', (req,res)=>{
   res.render('./ideas/add');
});
app.get('/ideas',(req,res)=>{
    Idea.find({})
        .sort({date:'desc'})
        .then(ideas=>{
            res.render('./ideas/index', {
                ideas:ideas
            });
        });

});
//Process form
app.post('/ideas/', (req,res)=>{

    let errors=[];
    if(!req.body.title){
        errors.push({text:'Please add title'});
    }
    if(!req.body.details){
        errors.push({text:'Please add Details'});
    }

    console.log(errors.length);
    if(errors.length > 0 ) {
        //if errors, send it to same form
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details:  req.body.details
        });
    }
    else{

        const data = {
            title: req.body.title,
            details:  req.body.details
        };
new Idea(data)
    .save()
    .then(idea =>{
        res.redirect('/ideas');
    });

    }
   // res.send('Ok');
});

app.get('/ideas/edit/:id', (req,res)=>{
    Idea.findOne({
        '_id':req.params.id
    })
        .then(idea => {
        res.render('ideas/edit',{idea:idea
        });
});
});

// Edit Form process
app.put('/ideas/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            // new values
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    res.redirect('/ideas');
                })
        });
});

// Edit Form process
app.delete('/ideas/:id', (req, res) => {
    Idea.remove({_id: req.params.id})
        .then(() => {res.redirect('/ideas');
        });
    });


    app.listen(port,()=>{

   console.log(`server started at port ${port}`);
});
