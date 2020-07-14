const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    }
},{
    // user created at and update at
    timestamps: true
});

let storage = multer.diskStorage({
    // The destination options determine within which folder the uploaded files should be stored.

    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },
    filename: function (req, file, cb) {
        //Date.now() method returns the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.
      cb(null, file.fieldname + '-' + Date.now());
    }
  })
   
//   static methods
// made publically available by defining them static
userSchema.statics.uploadedAvatar = multer({storage: storage}).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model('User', userSchema);

module.exports = User;