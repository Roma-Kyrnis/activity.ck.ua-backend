const nodemailer = require('nodemailer');

const { MAIL } = require('../../config');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    type: 'OAuth2',
    user: MAIL.AUTH.USER,
    clientId: MAIL.AUTH.CLIENT_ID,
    clientSecret: MAIL.AUTH.CLIENT_SECRET,
    refreshToken: MAIL.AUTH.REFRESH_TOKEN,
  },
});

async function recoverPassword(email, redirectUrl) {
  await transporter.sendMail({
    from: MAIL.FROM,
    to: email,
    subject: MAIL.MESSAGES.RECOVER_PASSWORD.SUBJECT,
    text: `${MAIL.MESSAGES.RECOVER_PASSWORD.TEXT}\n${redirectUrl}`,
  });
}

async function passwordChanged(email) {
  await transporter.sendMail({
    from: MAIL.FROM,
    to: email,
    subject: MAIL.MESSAGES.PASSWORD_CHANGED.SUBJECT,
    text: MAIL.MESSAGES.PASSWORD_CHANGED.TEXT,
  });
}

module.exports = { recoverPassword, passwordChanged };
