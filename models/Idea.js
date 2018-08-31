const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ideaSchema = new Schema({
   title:{
       type:String,
       required:true
   } ,
    details:{
       type:String,
        required:false
    },
    date:{
       type : Date,
        default:Date.now()
    }
});
mongoose.model('ideas', ideaSchema);