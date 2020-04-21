const mongoose = require('mongoose')

var UserSchema = new mongoose.Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    }
},
{
    collection: 'users'
});

mongoose.model('user', UserSchema);