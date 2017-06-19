var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Note = new Schema({
  title: String,
  content: String,
  owner: ObjectId,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Note', Note);
