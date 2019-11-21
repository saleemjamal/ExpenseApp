const   mongoose                = require("mongoose"),
        passportLocalMongoose   = require("passport-local-mongoose");  

var CategorySchema = new mongoose.Schema({
    name: String,
    description: String,
    expenses:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Expense"
        }
    ]
});


module.exports = mongoose.model("Category",CategorySchema);