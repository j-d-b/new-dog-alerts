const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

const { NEW_DOGS_RECIPIENTS, ERROR_RECIPIENTS } = process.env;

const mgTransporter = nodemailer.createTransport(mg({
  auth: {
    api_key: process.env.MG_API_KEY,
    domain: process.env.MG_DOMAIN
  }
}));

const mgSend = async mailOptions => {
  await mgTransporter.sendMail(mailOptions)
    .then(message => console.log(message))
    .catch((err) => console.log(err));
};

const createNewDogsEmailOptions = newDogs => ({
  from: `New Dog Alerts 🐕 <${process.env.MG_FROM_EMAIL}>`,
  to: NEW_DOGS_RECIPIENTS,
  subject: 'NEW DOGS FOUND!',
  template: {
    name: 'new-dogs.hbs',
    engine: 'handlebars',
    context: { newDogs }
  }
});

const createErrorEmailOptions = err => ({
  from: `New Dog Alerts 🐕 <${process.env.MG_FROM_EMAIL}>`,
  to: ERROR_RECIPIENTS,
  subject: 'An Error Occurred',
  template: {
    name: 'error.hbs',
    engine: 'handlebars',
    context: { err }
  }
});

module.exports.sendNewDogsEmail = async newDogs => mgSend(createNewDogsEmailOptions(newDogs));

module.exports.sendErrorEmail = async err => mgSend(createErrorEmailOptions(err));