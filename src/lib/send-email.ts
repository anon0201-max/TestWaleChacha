import nodemailer from 'nodemailer';

type EmailResult = { success: boolean; error?: string };

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter;

  const email = process.env.SMTP_EMAIL;
  const password = process.env.SMTP_PASSWORD;

  if (!email || !password) return null;

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: email, pass: password },
  });

  return transporter;
}

export async function sendOtpEmail(to: string, otp: string, name?: string): Promise<EmailResult> {
  try {
    const transport = getTransporter();

    if (!transport) {
      // No SMTP credentials — skip sending (dev mode, OTP returned in API response)
      console.log(`[EMAIL SKIP] SMTP not configured. OTP for ${to}: ${otp}`);
      return { success: false, error: 'SMTP not configured' };
    }

    await transport.sendMail({
      from: process.env.SMTP_EMAIL!,
      to,
      subject: `Your Password Reset OTP: ${otp}`,
      html: `
        <div style="max-width: 480px; margin: 0 auto; font-family: 'Segoe UI', Arial, sans-serif; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #1C1C84, #2525A0); padding: 32px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800;">TestWaleChacha</h1>
            <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 14px;">Password Reset Verification</p>
          </div>
          <div style="padding: 32px 24px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
              ${name ? `Hi <strong>${name}</strong>,` : 'Hello,'}
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
              We received a request to reset your password. Use the OTP below to verify your identity:
            </p>
            <div style="background: linear-gradient(135deg, #f0f4ff, #e8edff); border: 2px dashed #1C1C84; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 24px;">
              <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px;">Your OTP Code</p>
              <p style="color: #1C1C84; font-size: 36px; font-weight: 800; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">${otp}</p>
            </div>
            <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0 0 24px;">
              This OTP is valid for <strong>5 minutes</strong>. If you didn't request this, you can safely ignore this email.
            </p>
            <div style="text-align: center; margin: 0 0 24px;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Go back to the app and enter this OTP to continue resetting your password.
              </p>
            </div>
          </div>
          <div style="background: #f9fafb; padding: 20px 24px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0 0 4px;">
              &copy; ${new Date().getFullYear()} TestWaleChacha &mdash; India's #1 Mock Test Platform
            </p>
            <p style="color: #d1d5db; font-size: 11px; margin: 0;">SSC, UPSC, Banking, Railways &amp; more</p>
          </div>
        </div>
      `,
    });

    console.log(`[EMAIL SENT] OTP sent to ${to}`);
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[EMAIL ERROR]', msg);
    return { success: false, error: msg };
  }
}
