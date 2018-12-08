const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Idea = new Schema({
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('ideas', Idea);