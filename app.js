	var express          = require("express"),
	methodOverride   = require("method-override"),
	expressSanitizer = require("express-sanitizer"),
    app              = express(),
    bodyParser       = require("body-parser"),  
    mongoose         = require("mongoose");

//APP CONFIG
mongoose.connect("mongodb://localhost/blog_app", { useNewUrlParser: true });
mongoose.set('useUnifiedTopology', true);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
	title  : String,
	image  : String,
	body   : String, 
	created: {type: Date, default: Date.now}
    });

var blog = mongoose.model("blog", blogSchema);

// blog.create({
// 	title : "siberian husky",
// 	image : "https://www.gettyimages.in/detail/photo/close-up-of-siberian-husky-royalty-free-image/650013915",
// 	body  : "Best friends of mankind"
// });


//RESTFUL ROUTES

app.get("/", function(req, res){
	res.redirect("/blogs");
})

//INDEX ROUTE
app.get("/blogs", function(req, res){
	blog.find({}, function(err, blogs){
		if(err){
			console.log(err);
		}else{
			res.render("index", {blogs: blogs});
		}
	});
	
});

//NEW ROUTE
app.get("/blogs/new", function(req, res){
	res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res){
	//CREATE BLOG
	req.body.blog.body = req.sanitize(req.body.blog.body);
	blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		}else{
		//THEN,REDIRECT TO INDEX
			res.redirect("/blogs");
		}
		
	});
	
})

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
	blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show", {blog: foundBlog});
		}
	});
});
	
//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
	blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit", {blog: foundBlog});
		}
	});
	
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
	//DESTROY BLOG	
	blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
	//REDIRECT SOMEWHERE
});





app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("blogApp server has started!!!");
});