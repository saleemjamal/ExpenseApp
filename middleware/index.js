const   middlewareObj           = {},
        Category                = require("../models/category"),
        Expense                 = require("../models/expense");

middlewareObj.isLoggedIn= function(req,res,next){
    if(req.isAuthenticated()){return next();}
    req.flash("error","Please Login First!")
    res.redirect("/login");
}

middlewareObj.checkUserExpense = function(req,res,next){
    if(req.isAuthenticated()){
        Expense.findById(req.params.id,function(err,expense){
            if(expense.author.id.equals(req.user._id) || req.user.isAdmin)
            {next();}
            else{
                res.redirect("/expense");
            }
        })
    }else{
        res.redirect("/logins")
    }
}

middlewareObj.checkUserAdmin = function(req,res,next){
    if(req.isAuthenticated()){
        if(req.user.isAdmin){
            next();}
        else{
            res.redirect("/category")}
    } else {
        res.redirect("/login");
    }
}


module.exports = middlewareObj;
