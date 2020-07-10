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
    },
    // include the array of ids of all comments in this post schema itself
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]

},{
   timestamps: true 
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;