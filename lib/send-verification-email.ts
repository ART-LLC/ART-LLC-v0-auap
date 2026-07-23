import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

  try {
    const result = await resend.emails.send({
      from: `AUAPW <noreply@${process.env.RESEND_EMAIL_DOMAIN || 'auapw.com'}>`,
      to: email,
      subject: 'Verify your email - AUAPW',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
          <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #2563eb; margin-bottom: 20px;">Verify Your Email</h2>
            <p style="color: #666; line-height: 1.6;">Hi there,</p>
            <p style="color: #666; line-height: 1.6;">
              Thank you for creating an account with AUAPW! Please verify your email address by clicking the button below.
            </p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="display: inline-block; padding: 12px 30px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Email</a>
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
              If the button doesn't work, copy and paste this link in your browser:<br/>
              <span style="word-break: break-all; color: #666;">${verificationUrl}</span>
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 15px;">
              This link expires in 24 hours.
            </p>
          </div>
        </div>
      `,
    });

    if (result.error) {
      console.error('[v0] Failed to send verification email:', result.error);
      throw new Error('Failed to send verification email');
    }

    return result;
  } catch (error) {
    console.error('[v0] Email sending error:', error);
    throw error;
  }
}
