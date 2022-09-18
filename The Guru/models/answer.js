const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const answerSchema = new Schema({

    id: {
        type: String,
        require: true
    },
    // question: {
    //     type: String,
    //     require: true
    // },
    answer: {
        type: String,
        require: true
    }

});

module.exports = mongoose.model('Answers', answerSchema);