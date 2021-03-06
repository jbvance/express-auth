const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

//Define the model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

//On Save Hook, encrypt password
//Before saving a model, urn t his function
userSchema.pre('save', function(next){
  //get access to the user model
  const user = this;

  //generate a salt then run callback
  bcrypt.genSalt(10, function(err, salt){
    if (err) { return next(err); }

    //hash password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash){
      if (err) { return next(err); }

      //overwrite plain text password with encrypted password
      user.password = hash;
      //go ahead and save the user
      next();
    });
  });
});

// Whatever is at userSchema.methods will be available as a method
// when you use userSchema
userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch)=> {
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
};

//Create the model class
const ModelClass = mongoose.model('user', userSchema);


//Export the model
module.exports = ModelClass;
