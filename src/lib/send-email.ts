import { Resend } from 'resend';

let resendInstance: Resend | null = null;

function getResend(): Resend | null {
  if (resendInstance) return resendInstance;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  resendInstance = new Resend(key);
  return resendInstance;
}

export async function sendOtpEmail(to: string, otp: string, name?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResend();

    if (!resend) {
      // No API key configured — skip sending, OTP will be returned in dev mode
      console.log(`[EMAIL SKIP] RESEND_API_KEY not set. OTP for ${to}: ${otp}`);
      return { success: false, error: 'RESEND_API_KEY not configured' };
    }

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'TestWaleChacha <onboarding@resend.dev>',
      to: [to],
      subject: `Your Password Reset OTP: ${otp}`,
      html: `
        <div style="max-width: 480px; margin: 0 auto; font-family: 'Segoe UI', Arial, sans-serif; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1C1C84, #2525A0); padding: 32px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800;">TestWaleChacha</h1>
            <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 14px;">Password Reset Verification</p>
          </div>

          <!-- Body -->
          <div style="padding: 32px 24px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
              ${name ? `Hi <strong>${name}</strong>,` : 'Hello,'}
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
              We received a request to reset your password. Use the OTP below to verify your identity:
            </p>

            <!-- OTP Box -->
            <div style="background: linear-gradient(135deg, #f0f4ff, #e8edff); border: 2px dashed #1C1C84; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 24px;">
              <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px;">Your OTP Code</p>
              <p style="color: #1C1C84; font-size: 36px; font-weight: 800; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">${otp}</p>
            </div>

            <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0 0 24px;">
              ⏰ This OTP is valid for <strong>5 minutes</strong>. If you didn't request this, you can safely ignore this email.
            </p>

            <!-- CTA -->
            <div style="text-align: center; margin: 0 0 24px;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Go back to the app and enter this OTP to continue resetting your password.
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f9fafb; padding: 20px 24px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0 0 4px;">
              © ${new Date().getFullYear()} TestWaleChacha — India's #1 Mock Test Platform
            </p>
            <p style="color: #d1d5db; font-size: 11px; margin: 0;">
              SSC, UPSC, Banking, Railways & more
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('[EMAIL ERROR]', error);
      return { success: false, error: error.message };
    }

    console.log(`[EMAIL SENT] OTP sent to ${to}`);
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[EMAIL ERROR]', msg);
    return { success: false, error: msg };
  }
}
