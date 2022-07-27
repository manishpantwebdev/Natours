const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

class mail {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = process.env.mailFrom;
  }
  createTransport = function() {
    let transporter;
    if (process.env.NODE_ENV == 'production') {
      transporter = nodemailer.createTransport({
        host: 'smtp.mail.yahoo.com',
        port: 465,
        service: 'yahoo',
        secure: false,
        auth: {
          user: 'pantmanish1996@yahoo.com',
          pass: '*******'
        },
        debug: false,
        logger: true
      });
    }
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    return transporter;
  };

  sendWelcomeMail = async function() {
    await this.sendMail('Welcome', 'Welcome to Natours family');
  };
  sendResetMail = async function() {
    await this.sendMail('passwordReset', 'Reset Password');
  };

  sendMail = async function(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });
    const mailOptions = {
      to: this.to,
      from: this.from,
      subject,
      html,
      text: htmlToText.fromString(html)
    };
    await new this.createTransport().sendMail(mailOptions);
  };
}

module.exports = mail;
