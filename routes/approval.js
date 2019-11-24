const   express             = require("express"),
        router              = express.Router(),
        passport            = require("passport"),
        User                = require("../models/user"),
        Category            = require("../models/category"),
        middleware          = require("../middleware"),
        Expense            = require("../models/expense");

// INDEX ROUTE
router.get("/approval",middleware.isLoggedIn,middleware.checkUserAdmin,function(req,res){
    const searchQuery = req.query.search;
    if(typeof searchQuery === 'undefined')
    {
        Expense.find({isApproved:false},function(err,pendingExpense){
            if(err){console.log(err)}
            else{res.render("approval/index",{expenses:pendingExpense,currentUser:req.user});}
        });
    }
    else{
        const regex = new RegExp(escapeRegex(req.query.search),'gi')
        Expense.find({narration:regex,isApproved:false},function(err,pendingExpense){
            if(err){console.log(err.message)}
            else{res.render("approval/index",{expenses:pendingExpense,currentUser:req.user})}
        });
    }
});

// UPDATE ROUTE
router.put("/approval/:id",middleware.isLoggedIn,middleware.checkUserExpense,function(req,res){
    Expense.findByIdAndUpdate(req.params.id,{isApproved:true},function(err,updatedExpense){
      if(err){console.log(err.message)}
      else{
        res.redirect("/approval")
      }
    })
  });
  

module.exports = router;