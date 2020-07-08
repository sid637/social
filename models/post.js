const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        // this type is a reference to a user schema
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

},{
   timestamps: true 
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;