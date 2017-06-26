var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: { type: String, unique: true },
    password: String,
    email: {type: String, unique: true }
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
