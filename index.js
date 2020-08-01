const express = require('express');
const env = require('./config/enviornment');
const logger = require('morgan');
// cookie
const cookieParser = require('cookie-parser');
const app = express();
require('./config/view-helpers')(app);

const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db= require('./config/mongoose');
// used for sesion cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
// it needs an extra argument which is session(because we need to store session information into the database)
const MongoStore = require('connect-mongo')(session);

const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');

const path = require('path');

if(env.name == 'development'){
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, '/scss'),
        dest: path.join(__dirname, env.asset_path, '/css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
    }));
}


app.use(express.urlencoded({extended: false}));


app.use(cookieParser());

// static files
app.use(express.static(env.asset_path));

// make the upload path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options));

// before routes
app.use(expressLayouts);

// extraxt style and script form subpages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);



//set up the view engine
app.set('view engine','ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db
// to use express session
app.use(session({
    // name of cookie
    name: 'codeial',
    // TODO change the secret before deployment in production mode

    // whenever encryption happens there is a key to code and decode it
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup ok ');
        }
    )
    

}));

app.use(passport.initialize());
app.use(passport.session());

// whenever this function is called it will check whether a session cookie is present or not
app.use(passport.setAuthenticatedUser);

// we need to use flash after the session cookie is being used
// because this uses session cookie
app.use(flash());
app.use(customMware.setFlash);


// use express router
app.use('/', require('./routes/index'));


app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`server is running on port : ${port}`);
});