var express=require("express");
var router= express.Router();
var mongoose=require("mongoose");
var campground=require("../models/campground");
var middleware= require("../middleware");


router.get("/",function(req,res){
	
	campground.find({},function(err,allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds:allCampgrounds});
		}
	});
});

router.post("/",isLoggedIn,function(req,res){
	var name= req.body.name;
	var image=req.body.image;
	var description=req.body.description;
	var author={
		id:req.user._id,
		username: req.user.username
	};
	var newcampground={name: name, image:image ,description:description,author:author};
	campground.create(newcampground,function(err,newlyCreated){
		if(err){
			console.log(err);
		}else{
			req.flash("success","New campground created!");
			res.redirect("/campgrounds");

		}
	});
});

router.get("/new",isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});

router.get("/:id",function(req,res){
	campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground);
			res.render("campgrounds/show",{campgrounds: foundCampground});
		}
	});
});

router.get("/:id/edit",checkCampgroundOwnership,function(req,res){
		campground.findById(req.params.id,function(err, foundCampground){
			res.render("campgrounds/edit",{campground:foundCampground});
		});
});

router.put("/:id",checkCampgroundOwnership,function(req,res){
	campground.findByIdAndUpdate(req.params.id,req.body.campground, function(err,UpdatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			req.flash("success","campground successfully updated!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/:id",checkCampgroundOwnership,function(req,res){
	campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			req.flash("success","campground delete");
			res.redirect("/campgrounds");
		}
	});
});

function checkCampgroundOwnership(req,res,next){
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
		req.flash("error", "You don't have the authority to do that");
		res.redirect("back");
	}
}

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}
	req.flash("error","Please Login First!");
	res.redirect("/login");
}

module.exports=router;
