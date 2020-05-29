const express = require("express"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer"),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
app = express();




mongoose.connect("mongodb://localhost:27017/restful_Blog_app",{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


//MONGOOSE MODEL CONFIG
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    Created: {type: Date, default: Date.now}
});

const Blog = mongoose.model("Blog",blogSchema);

//RESTFUL ROUTES

app.get("/",(req,res)=>{
    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs",function(req,res){
    Blog.find({},(err, blogs)=>{
        if(err){
            console.log("ERROR!");
        }else{
            res.render("index",{blogs: blogs});
        }
    });    
});
//NEW ROUTE
app.get("/blogs/new",function(req,res){
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs",function(req,res){
    //create blog
    
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, (err,newBlog)=>{
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id",(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show",{blog: foundBlog});
        }
    })
});

//EDIT ROUTE
app.get("/blogs/:id/edit",(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit",{blog: foundBlog});
        }
    });
    
})

//UPDATE ROUTE
app.put("/blogs/:id",(req,res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog)=>{
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/"+ req.params.id);
        }
    });
});

//DELETE ROUTE

app.delete("/blogs/:id",(req,res)=>{
    Blog.findByIdAndRemove(req.params.id,(err)=>{
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
});



const port = 3000;

app.listen(port,()=>{
    console.log("The Server is running");
});
