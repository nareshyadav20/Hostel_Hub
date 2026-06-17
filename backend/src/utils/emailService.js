/**
 * emailService.js
 * Nodemailer wrapper for transactional emails.
 * Reads SMTP config from environment variables (see .env.example).
 *
 * Required env vars:
 *   SMTP_HOST     – e.g. smtp.gmail.com
 *   SMTP_PORT     – e.g. 587
 *   SMTP_USER     – your Gmail / SMTP username
 *   SMTP_PASS     – app password (not your Gmail login password)
 *   FROM_EMAIL    – sender address, e.g. noreply@livora.com
 *
 * Falls back to Ethereal (fake SMTP) in development when vars are missing.
 */

const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: parseInt(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log('📧 [EMAIL] Using configured SMTP:', process.env.SMTP_HOST);
  } else {
    // Dev fallback: Ethereal (emails are captured, not actually sent)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    console.log('📧 [EMAIL] ⚠️  No SMTP config found — using Ethereal test account:', testAccount.user);
    console.log('📧 [EMAIL] Preview URL will be logged per email at https://ethereal.email');
  }

  return transporter;
};

/**
 * Send a forgot-password OTP email.
 */
exports.sendPasswordResetOTP = async ({ to, name, otp }) => {
  try {
    const t = await getTransporter();
    const info = await t.sendMail({
      from: `"Livora Hostel Hub" <${process.env.FROM_EMAIL || 'noreply@livora.com'}>`,
      to,
      subject: '🔑 Your Livora Password Reset OTP',
      html: `
        <div style="font-family:Inter,sans-serif;max-width:480px;margin:auto;background:#f8fafc;border-radius:16px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#00A859,#059669);padding:32px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800;">Livora</h1>
            <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:13px;letter-spacing:0.1em;">HOSTEL HUB</p>
          </div>
          <div style="padding:32px;">
            <h2 style="color:#1A1C1E;font-size:20px;margin:0 0 8px;">Hi ${name || 'there'},</h2>
            <p style="color:#64748B;font-size:15px;line-height:1.6;margin:0 0 24px;">
              We received a request to reset your password. Use the OTP below — it expires in <strong>15 minutes</strong>.
            </p>
            <div style="background:#fff;border:2px solid #00A859;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px;">
              <p style="color:#64748B;font-size:13px;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.1em;">Your OTP</p>
              <p style="font-size:40px;font-weight:900;letter-spacing:8px;color:#00A859;margin:0;">${otp}</p>
            </div>
            <p style="color:#94A3B8;font-size:13px;line-height:1.5;">
              If you didn't request a password reset, you can safely ignore this email.
              Your password will remain unchanged.
            </p>
          </div>
          <div style="padding:16px 32px;border-top:1px solid #E2E8F0;text-align:center;">
            <p style="color:#CBD5E1;font-size:12px;margin:0;">© ${new Date().getFullYear()} Livora Hostel Hub</p>
          </div>
        </div>
      `,
    });

    // Log Ethereal preview URL in dev
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('📧 [EMAIL] Preview URL:', previewUrl);
    }

    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('📧 [EMAIL] Failed to send OTP email:', err.message);
    throw err;
  }
};
