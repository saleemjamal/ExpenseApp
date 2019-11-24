const   express                 = require("express"),
        app                     = express(),
        mongoose                = require("mongoose"),
        passport                = require("passport"),
        passportLocalMongoose   = require("passport-local-mongoose"),
        User                    = require("./models/user"),
        bodyParser              = require("body-parser"),
        LocalStrategy           = require("passport-local"),
        methodOverride          = require("method-override"),
        flash                   = require("connect-flash"),
        category                = require("./models/category");

const   authRoutes              = require("./routes/index"),
        categoryRoutes          = require("./routes/category"),
        expenseRoutes           = require("./routes/expense"),
        approvalRoutes          = require("./routes/approval");
        
mongoose.connect("mongodb://localhost/expenseappdb",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log("DB Connected"))
.catch(err=>{console.log(err.message)});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(require("express-session")({
    secret:"hithere!",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})
app.use(authRoutes);
app.use(categoryRoutes);
app.use(expenseRoutes);
app.use(approvalRoutes);

app.listen(3000,()=>{
    console.log("Expense App Server Listening!")
});

