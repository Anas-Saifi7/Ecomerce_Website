import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html, text }) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn('Email not sent: SMTP_HOST, SMTP_USER, and SMTP_PASS must be configured.');
    return { queued: false, logged: false };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: SMTP_FROM || SMTP_USER,
    to,
    subject,
    html,
    text,
  });

  return { queued: true, logged: false };
};

export default sendEmail;
