//factory function is simple function wich is return an object (it helps to create object / )
const Menu=require("../../models/menu")
function homeController() {
    return {
        async index(req,res){

            const pizzas=await Menu.find()
            // console.log(pizzas)
            return  res.render('home',{pizzas:pizzas});
            // Menu.find().then(function(pizzas){
            //     console.log(pizzas );
            //     return  res.render('home',{pizzas:pizzas});
            // })
           
        }
    }
}
module.exports = homeController;
