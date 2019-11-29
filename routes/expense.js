const   express             = require("express"),
        router              = express.Router(),
        passport            = require("passport"),
        User                = require("../models/user"),
        middleware          = require("../middleware"),
        Expense             = require("../models/expense"),
        Category            = require("../models/category");
    

// INDEX ROUTE
router.get("/expense",middleware.isLoggedIn,function (req,res) {
  var isApproved = false;
  console.log(req.query.approvedRadio)
  const searchQuery = req.query.search;
  const status = req.query.approvedRadio;
  
  if(typeof req.query.search !== 'undefined'){
    const regex = new RegExp(escapeRegex(req.query.search),'gi')
    if(typeof req.query.approvedRadio === 'undefined' || req.query.approvedRadio === "All")
    { 
      Expense.find({narration:regex},function(err,allExpenses){
        if(err){req.flash("error",err.message);}
        else{res.render("expense/index",{expenses:allExpenses,currentUser:req.user})}
      });
    } else if(req.query.approvedRadio==="Approved"){
        isApproved=true;
        Expense.find({narration:regex,isApproved:isApproved},function(err,allExpenses){
          if(err){req.flash("error",err.message);}
          else{res.render("expense/index",{expenses:allExpenses,currentUser:req.user})}
        });
    } else{
      Expense.find({narration:regex,isApproved:isApproved},function(err,allExpenses){
        if(err){req.flash("error",err.message);}
        else{res.render("expense/index",{expenses:allExpenses,currentUser:req.user})}
      });
    }
  }
  else{
    if(typeof req.query.approvedRadio === 'undefined' || req.query.approvedRadio === "All")
    { 
      Expense.find(function(err,allExpenses){
        if(err){req.flash("error",err.message);}
        else{res.render("expense/index",{expenses:allExpenses,currentUser:req.user})}
      });
    } else if(req.query.approvedRadio==="Approved"){
        isApproved=true;
        Expense.find({isApproved:isApproved},function(err,allExpenses){
          if(err){req.flash("error",err.message);}
          else{res.render("expense/index",{expenses:allExpenses,currentUser:req.user})}
        });
    } else{
      Expense.find({isApproved:isApproved},function(err,allExpenses){
        if(err){req.flash("error",err.message);}
        else{res.render("expense/index",{expenses:allExpenses,currentUser:req.user})}
      });
    }
  }});

// NEW ROUTE
router.get("/expense/new",middleware.isLoggedIn,function(req,res){
  Category.find({},function(err,categorys){
    if(err){req.flash("error",err.message);}
    else{
      res.render("expense/new",{categorys:categorys})
    }
  })
})

// CREATE ROUTE
router.post("/expense",middleware.isLoggedIn,function(req,res){
  // Finding a category to attach to
  Category.findOne({name:req.body.expense.category},function(err,foundCategory){
    if(err){req.flash("error",err.message);}
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
        if(err){req.flash("error",err.message);}
        else{
          foundCategory.expenses.push(createdExpense);
          foundCategory.save();
          req.flash("success","Expense has been successfully created!")
          res.redirect("/expense");
        }
      });
    }
  });
});

// EDIT ROUTE
router.get("/expense/:id/edit",middleware.isLoggedIn,function(req,res){
  Category.find({},function(err,categorys){
    if(err){req.flash("error",err.message);}
    else{
    Expense.findById(req.params.id,function(err,editExpense){
      if(err){req.flash("error",err.message);}
      else{
        res.render("expense/edit",{expense:editExpense,categorys:categorys})}
    });
  }});
});

// UPDATE ROUTE
router.put("/expense/:id",middleware.isLoggedIn,middleware.checkUserExpense,function(req,res){
  Expense.findByIdAndUpdate(req.params.id,req.body.expense,function(err,updatedExpense){
    if(err){req.flash("error",err.message);}
    else{
      req.flash("success","Edited expense has been successfully updated!")
      res.redirect("/expense")
    }
  })

});

// DELETE ROUTES
router.delete("/expense/:id",middleware.isLoggedIn,middleware.checkUserExpense,function(req,res){
  Expense.findByIdAndRemove(req.params.id,function(err){
    if(err){req.flash("error",err.message);}
    else{
      req.flash("success","Expense has been successfully deleted!")
      res.redirect("/expense");
    }
  })
});
module.exports = router;

router.get("/autocomplete/",function(req,res,next){
  const regex = new RegExp(req.query["term"],'i');
  const expenseFilter = Expense.find({narration:regex},{'narration':1}).limit(3);
  expenseFilter.exec(function(err,data){
    var result = [];
    if(!err){
      if(data && data.length && data.length>0)
      {
        data.forEach(expense=>{
          let obj = {
            id:expense._id,
            label: expense.narration
          };
          result.push(obj)
        });
      }
    }
    res.jsonp(result);
    })
});


function escapeRegex (text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}