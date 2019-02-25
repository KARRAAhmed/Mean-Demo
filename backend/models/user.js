var mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator") ;
  var Schema = mongoose.Schema;

  var userSchema = new Schema({
     email: { type: String, required :true , unique : true },
     password: { type: String, required :true }
  });
  userSchema.plugin(uniqueValidator) ;
module.exports = mongoose.model('User',userSchema) ;
