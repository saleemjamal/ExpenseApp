// const search = document.getElementById('search')
// const Expense = require("../../models/expense")

// const searchExpenses = async searchText => {
//     const res = await Expense.find({});
//     console.log(res.json());
// }

// search.addEventListener('input',()=> searchExpenses(search.value));

$(function(){
    $("#search").autocomplete({
        source:function(req,res){
            $.ajax({
                url:"/autocomplete/",
                dataType: "jsonp",
                type:"GET",
                data:req,
                success: function(data){
                    res(data)
                },
                error:function(err){
                    console.log(err.message);
                }
            });
        },
        minLength:1,
        select: function(event,ui){
            if(ui.item){
                $("search").text(ui.item.label)
            }
        }
    })
});