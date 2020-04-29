var express=require("express");
var router= express.Router({mergeParams:true});
var campground=require("../models/campground");
var Comments=require("../models/comment");
var middleware= require("../middleware");


router.get("/new",isLoggedIn,function(req,res){
	campground.findById(req.params.id,function(err, campground){
		if(err){
			console.log(err);
		}else
			res.render("comments/new",{campground:campground});
	});
	
});

router.post("/",isLoggedIn,function(req,res){
	campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}else{
			Comments.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
				}else{
					comment.author.id= req.user._id;
					comment.author.username=req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success","new comment created");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

router.get("/:comment_id/edit",checkCommentOwnership, function(req,res){
	Comments.findById(req.params.comment_id,function(err, foundComment){
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit",{campground_id:req.params.id, comment: foundComment});

		}
	})
});

router.put("/:comment_id",checkCommentOwnership, function(req,res){
	Comments.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err ,updatedComment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/" +req.params.id);
		}
	});
});

router.delete("/:comment_id",checkCommentOwnership,function(req,res){
	Comments.findByIdAndRemove(req.params.comment_id ,function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success","comment successfully deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

function checkCommentOwnership(req,res,next){
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
		req.flash("error","You don't have the authority to do that");
		res.redirect("back");
	}
}

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}
	req.flash("error","You need to login!");
	res.redirect("/login");
}


module.exports=router;