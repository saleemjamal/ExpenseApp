const   express             = require("express"),
        router              = express.Router(),
        passport            = require("passport"),
        User                = require("../models/user"),
        middleware          = require("../middleware")
   
router.get("/",function(req,res){
    res.render("login");
});
// INDEX ROUTE
router.get("/login",function(req,res){
    res.render("login")
});

// CREATE ROUTE
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/landing",
        failureRedirect: "/login",
        failureFlash:true,
        successFlash:"Welcome to Expense App!"
    }), function(req, res){
});


// INDEX ROUTE
router.get("/register",function(req,res){
    res.render("register");
});

// CREATE ROUTE
router.post("/register",function(req,res){
    try{
        const newUser = new User({username:req.body.username});
        if(req.body.adminCode==='secretcode123') {
            newUser.isAdmin = true;
        }
        User.register(newUser,req.body.password,function(err,user)
        {
            if(err)
            {
                req.flash("error",err.message)
                res.render("register");
            }
            else{
                passport.authenticate("local")(req,res,function(){
                    req.flash("success","You have successfully registered "+req.user.username+"!")
                    res.redirect("/landing");
                })
            }
        })
    } catch(err){
        req.flash("error",err.message);
    }
})

router.get("/landing",middleware.isLoggedIn,function(req,res){res.render("landing")})

router.get("/logout", middleware.isLoggedIn, function(req, res){
    req.logout();
    req.flash("success","You have logged out!")
    res.redirect("/login");
 });
 

module.exports  = router;