const nodemailer = require("nodemailer");
async function send(mailTo, subject, mailContent) {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: '"cmcc-forum" <shibao0184@gmail.com>',
      to: `${mailTo}`,
      subject: `${subject}`,
      html: `${mailContent}`,
    });
    console.log("Message sent: %s", info.messageId);
  } catch {
    console.error
  }
}
module.exports = { send }