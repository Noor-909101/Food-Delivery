const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const adminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')
//midlewares
const guest = require('../app/http/midlewares/guest')
const auth = require('../app/http/midlewares/auth')
const admin = require('../app/http/midlewares/admin')

function initRoutes(app) {
    //HOME
    app.get('/', homeController().index)
    // (req, res)=>{
    //     res.render('home')
    // }
    //LOGIN
    // (req, res)=>{
    //     res.render('auth/login')
    // }
    app.get('/login',guest, authController().login)
    app.post('/login', authController().postLogin)
    //REGISTER
    // (req, res)=>{
    //     res.render('auth/register')
    // }
    app.get('/register',guest, authController().register)
    app.post('/register', authController().postRegister)
    //logout
    app.post('/logout', authController().logout)
    //cart
    app.get('/cart', cartController().index)
    //update cart
    app.post('/update-cart', cartController().update)
    
    //customers route
    // orders
    app.post('/orders',auth, orderController().store)
    app.get('/customer/orders',auth, orderController().index)
    app.get('/customer/orders/:id', auth, orderController().show)
    // admin route
    app.get('/admin/orders',admin, adminOrderController().index)
    app.post('/admin/order/status', admin, statusController().update)

}


module.exports = initRoutes;