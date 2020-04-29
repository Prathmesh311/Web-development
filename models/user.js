var mongoose=require("mongoose");
var passpordLocalMongoose=require("passport-local-mongoose");

var UserSchema=new mongoose.Schema({
	username: String,
	password:String
});

UserSchema.plugin(passpordLocalMongoose);

module.exports= mongoose.model("User",UserSchema);