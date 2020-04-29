var campground=require("../models/campground");
var Comments=require("../models/comment");
var middlewareObj={};

middlewareObj.checkCampgroundOwnership=function (req,res,next){
	if(req.isAuthenticated()){
		campground.findById(req.params.id,function(err, foundCampground){
			if(err){
				console.log(err);
				res.redirect("back");
			}else{
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}else{
					res.redirect("back");
				}
			}
		});
	}else{
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership=function (req,res,next){
	if(req.isAuthenticated()){
		Comments.findById(req.params.comment_id,function(err, foundComment){
			if(err){
				console.log(err);
				res.redirect("back");
			}else{
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					res.redirect("back");
				}
			}
		});
	}else{
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn=function (req,res,next){
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect("/login");
}

//module.exports = middlewareObj;
