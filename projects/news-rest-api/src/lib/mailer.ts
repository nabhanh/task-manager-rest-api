// create reusable transporter object using the default SMTP transport

// Path: projects/news-rest-api/src/lib/nodemailer.ts

import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendMail = async (to: string, subject: string, text: string) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    text
  };

  await transporter.sendMail(mailOptions);
};

export default sendMail;
