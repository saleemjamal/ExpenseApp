const   express             = require("express"),
        router              = express.Router(),
        passport            = require("passport"),
        User                = require("../models/user"),
        middleware          = require("../middleware"),
        Expense             = require("../models/expense"),
        Category            = require("../models/category");
    

// TO DO: CREATE EXPENSE ROUTES WITH CATEGORY PREFIX!
// EG. /EXPENSE SHOULD BECOME /CATEGORY/:ID/EXPENSE, ETC. 

// INDEX ROUTE
router.get("/expense",middleware.isLoggedIn,function (req,res) {
  if(typeof req.query.search !== 'undefined'){
    const regex = new RegExp(escapeRegex(req.query.search),'gi')
    Expense.find({narration:regex},function(err,allExpenses){
      if(err){console.log(err.message)}
      else{res.render("expense/index",{expenses:allExpenses,currentUser:req.user})}
    });
  }
  else{
    Expense.find({},function(err,allExpenses){
      if(err){console.log(err.message)}
      else{res.render("expense/index",{expenses:allExpenses,currentUser:req.user})}
    })
  }});

// NEW ROUTE
router.get("/expense/new",middleware.isLoggedIn,function(req,res){
  Category.find({},function(err,categorys){
    if(err){console.log(err.message)}
    else{
      res.render("expense/new",{categorys:categorys})
    }
  })
})

// CREATE ROUTE
router.post("/expense",middleware.isLoggedIn,function(req,res){
  // Finding a category to attach to
  Category.findOne({name:req.body.expense.category},function(err,foundCategory){
    if(err){console.log(err.message)}
    else{
        // Creating the expense
        const narration = req.body.expense.narration,
              amount    = req.body.expense.amount,
              owner     = req.body.expense.owner,
              vendor    = req.body.expense.vendor,
              author    = {
                id :req.user._id,
                username : req.user.username
              },
              category  = {
                id :foundCategory.id,
                name:foundCategory.name
              };
        const newExpense = {narration:narration,amount:amount,owner:owner,vendor:vendor,author:author,category:category};
        Expense.create(newExpense,function(err,createdExpense){
        if(err){console.log("Here"+err.message)}
        else{
          foundCategory.expenses.push(createdExpense);
          foundCategory.save();
          res.redirect("/expense");
        }
      });
    }
  });
});

// EDIT ROUTE
router.get("/expense/:id/edit",middleware.isLoggedIn,function(req,res){
  Category.find({},function(err,categorys){
    if(err){console.log(err.message)}
    else{
    Expense.findById(req.params.id,function(err,editExpense){
      if(err){console.log(err.message)}
      else{
        res.render("expense/edit",{expense:editExpense,categorys:categorys})}
    });
  }});
});

// UPDATE ROUTE
router.put("/expense/:id",middleware.isLoggedIn,middleware.checkUserExpense,function(req,res){
  Expense.findByIdAndUpdate(req.params.id,req.body.expense,function(err,updatedExpense){
    if(err){console.log(err.message)}
    else{
      res.redirect("/expense")
    }
  })

});

// DELETE ROUTES
router.delete("/expense/:id",middleware.isLoggedIn,middleware.checkUserExpense,function(req,res){
  Expense.findByIdAndRemove(req.params.id,function(err){
    if(err){console.log(err.message)}
    else{
      res.redirect("/expense");
    }
  })
});
module.exports = router;


function escapeRegex (text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}