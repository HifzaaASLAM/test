const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_PORT === '465',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

exports.sendLeadThankYou = async (lead, rep) => {
  if (!lead.email || !process.env.SMTP_HOST) return;

  const bookingLine = rep && rep.calendlyUrl
    ? `<p>You can pick a time that suits you here: <a href="${esc(rep.calendlyUrl)}">Book an appointment</a></p>`
    : `<p>Please reply to this email with the time that works best for you.</p>`;

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: lead.email,
    subject: 'Thank you for your enquiry - AFZ Prestige',
    html: `
      <p>Dear ${esc(lead.customerName)},</p>
      <p>Thank you for your enquiry about ${esc(lead.serviceRequired)}. We have received your request${rep ? ` and ${esc(rep.name)} from our team will be in touch shortly` : ''}.</p>
      <p>What time would you like to schedule an appointment with us?</p>
      ${bookingLine}
      <p>Kind regards,<br>AFZ Prestige Corporate Services</p>
    `,
  });
};