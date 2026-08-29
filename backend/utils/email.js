import dotenv from 'dotenv'

dotenv.config()

export const sendEmail = async (options) => {
  let nodemailer;
  try {
    // Attempt dynamic import in case npm install failed due to network
    const nodemailerModule = await import('nodemailer');
    nodemailer = nodemailerModule.default || nodemailerModule;
  } catch (e) {
    nodemailer = null;
  }

  // If no SMTP credentials exist OR if nodemailer is missing, use a mocked transport for testing
  let transporter
  if (nodemailer && process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  } else {
    // Ethereal mock email for local dev if keys aren't set or if package is missing
    console.warn('⚠️ Using mock email output (SMTP credentials or nodemailer package missing)')
    transporter = {
      sendMail: async (mailOptions) => {
        console.log('\n======================================')
        console.log('MOCK EMAIL INTERCEPTED')
        console.log(`To: ${mailOptions.to}`)
        console.log(`Subject: ${mailOptions.subject}`)
        console.log(`Text: ${mailOptions.text}`)
        console.log('======================================\n')
      }
    }
  }

  const mailOptions = {
    from: `"LMS Talentraa" <${process.env.EMAIL_FROM || 'noreply@lmstalentraa.com'}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  }

  await transporter.sendMail(mailOptions)
}
