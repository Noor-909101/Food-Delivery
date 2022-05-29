require('dotenv').config();
const express=require('express')
const ejs=require('ejs');//template engine
const path=require('path');
const expressLayout=require('express-ejs-layouts');
const mongoose =require('mongoose');
const session=require('express-session'); 
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo');
const passport = require('passport');
const Emitter = require('events')
// MongoDbStore(session);


const app = express();

const PORT=process.env.PORT || 3300;

//Data Base Connection
const url='mongodb://localhost/pizza';
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true,  useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    if (!connection) {
        console.log('connection error');
    }
    else{
        console.log('connection established');
    }
})


// Event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)


// session store
// let mongoStore = new MongoDbStore({
//     mongooseConnection: connection,
//     // collection: 'sessions'
//     collection: 'sessions'
// })
//session config
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    store: MongoDbStore.create({
        client:connection.getClient()
        // mongoUrl:'mongodb://localhost/pizza'
    
    }),
    saveUninitialized:true,
    cookie:{maxAge:1000 * 60 * 60 * 24}// 24 hours
   
}))

// Session config
// app.use(session({
//     secret: process.env.COOKIE_SECRET,
//     resave: false,
//     store: mongoStore,
//     saveUninitialized: false,
//     cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour
// }))

//passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize());
app.use(passport.session());


//express flash
app.use(flash())

//assets
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//global midleware
app.use((req,res,next) => {
    res.locals.session=req.session;
    res.locals.user=req.user;
    next()

})



//set template engine 
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

//routes calling
require('./routes/web')(app);
app.use((req,res)=> {
    res.status(404).send('404 Page Not Found');
})


const server=app.listen(PORT, ()=>{
    console.log("listnening on port 3300");
});

//socket.io
const io = require('socket.io')(server)
io.on('connection', (socket) => {
      // Join the orderId
      socket.on('join', (orderId) => {
         
        socket.join(orderId)
      })
})

// emmitter
eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})
eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})
