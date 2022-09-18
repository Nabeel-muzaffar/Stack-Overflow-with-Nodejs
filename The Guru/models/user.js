const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const questionSchema = new Schema ({

    question:{
        type:String,
        require:true
    },
    language:{
        type:String,
        require:true
    },
    user:{
        type:String,
        require:true 
    }

});

module.exports = mongoose.model('Question' , questionSchema);