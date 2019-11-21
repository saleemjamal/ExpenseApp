const   mongoose            = require("mongoose"),
        passLocalMongoose   =require("passport-local-mongoose");

var ExpenseSchema = new mongoose.Schema({
    // Narration: What the expense means
    narration:String,
    // Amount: Expense amount
    amount: Number,
    // Owner: Who has made the expense - Staff member - Default: Manager
    owner: {type:String,default:"Manager"}, 
    // Vendor: In case the expense has been towards a particular vendor         
    vendor: {type:String,default:"Self"},
    // Author: Who has inputed the expense. 
    author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String
    },
    category:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },
        name: String
    },
    // Beginning the approval route
    isApproved:{type: Boolean, default:false}
});

module.exports = mongoose.model("Expense",ExpenseSchema)

