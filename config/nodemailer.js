const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const env = require('./enviornment');



// defines a path , how communication is going to take place
let transporter = nodemailer.createTransport(env.smpt);

// render template defines file(  that we'll be using ejs)
// relative path is the place where from which this function is being called
let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template){
            if(err){console.log('error in rendering template'); return}
            mailHTML= template;
        }
    )

    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}