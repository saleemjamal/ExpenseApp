const   express             = require("express"),
        router              = express.Router(),
        passport            = require("passport"),
        User                = require("../models/user"),
        Category            = require("../models/category"),
        middleware          = require("../middleware"),
        Expense            = require("../models/expense");

// INDEX ROUTE
router.get("/category",middleware.isLoggedIn,function(req,res){
    Category.find({},function(err,allCategorys){
        if(err){console.log(err.message)}
        else{
           res.render("category/index",{categorys:allCategorys,currentUser:req.user})
        }
    })
});

// NEW ROUTE
router.get("/category/new",middleware.isLoggedIn,middleware.checkUserAdmin,function(req,res){
    res.render("category/new");
});

// CREATE ROUTE
router.post("/category",middleware.isLoggedIn,middleware.checkUserAdmin,function(req,res){
    // Getting the category straight from the form
    const newCategory = new Category({name:req.body.name,description:req.body.description});
    Category.create(newCategory,function(err,createdCategory){
        if(err){console.log(err.message);}
        else{
            res.redirect("/category");
        }
    })
});

// SHOW ROUTE
router.get("/category/:id",middleware.isLoggedIn,function(req,res,next){
    Category.findById(req.params.id).populate("expenses").exec(function(err,category){
        if(err){console.log(err.message);}
        else{
            res.render("category/show",{category:category});
        }
    });
});

// EDIT ROUTE
router.get("/category/:id/edit",middleware.isLoggedIn,middleware.checkUserAdmin,function(req,res){
    Category.findById(req.params.id,function(err,category)
    {
        if(err){console.log(err.message);}
        else{
            res.render("category/edit",{category:category})
        }
    })
});

// UPDATE ROUTE
router.put("/category/:id",middleware.isLoggedIn,middleware.checkUserAdmin,function(req,res){
    Category.findByIdAndUpdate(req.params.id,req.body.category,function(err,category){
        if(err){console.log(err.message);}
        else{
            console.log(req.body.category)
            res.redirect("/category/"+req.params.id)}
    });
});

// DELETE ROUTE
router.delete("/category/:id",middleware.isLoggedIn,middleware.checkUserAdmin,function(req,res){
    Category.findById(req.params.id,function(err,category){
        if(err){console.log(err.message)}
        else{
            category.expenses.forEach((expense)=>{
                Expense.findByIdAndRemove(expense._id,function(err){
                    if(err){console.log(err.message);}
                })
            })
        }
    });
    Category.findByIdAndRemove(req.params.id,function(err){
        if(err){console.log(err.message)}
        else{res.redirect("/category");}
    })
});

module.exports = router;