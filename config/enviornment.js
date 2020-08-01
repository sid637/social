const fs = require('fs');
const rfs = require("rotating-file-stream");
const path = require('path');

// defines where log will be stored
const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});


const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'blahsomething',
    db: 'codeial_development',
    smpt: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        // authenticate user
        auth: {
            user: 'sidsharma637@gmail.com',
            pass: 'sanskrit.......'
        }
    },
    google_client_id: "469209458720-0j8isc2sqjoq1v0k589aa3pp4pr45bjf.apps.googleusercontent.com",
    google_client_secret: "PCvLwuHcCmJ_MtybWenwvdFY",
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'codeial',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}

const production = {
    name: 'production',
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
    db: process.env.CODEIAL_DB,
    smpt: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        // authenticate user
        auth: {
            user: process.env.CODEIAL_GMAIL_USERNAME,
            pass: process.env.CODEIAL_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.CODEIAL_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }

}

module.exports = eval(process.env.CODEIAL_ENVIORNMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIORNMENT);
// module.exports = development;