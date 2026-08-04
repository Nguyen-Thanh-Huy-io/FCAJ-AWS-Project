const { Resend } = require('resend');
const EmailStrategy = require('../email/email.strategy');

class ResendStrategy extends EmailStrategy {
  constructor() {
    super();
    // Trong ECS/Secret Manager, giá trị sẽ được inject vào process.env,
    // nên không cần phụ thuộc vào file .env khi deploy.
    this.apiKey = process.env.RESEND_API_KEY;
    this.fromEmail = process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM || 'onboarding@resend.dev';
    this.client = this.apiKey ? new Resend(this.apiKey) : null;
  }

  async send(to, subject, text) {
    if (!this.client) {
      console.warn('⚠️ RESEND_API_KEY chưa được cấu hình. Email sẽ được in ra console.');
      console.log('----- DEV EMAIL -----');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(text);
      console.log('---------------------');
      return;
    }

    try {
      const { data, error } = await this.client.emails.send({
        from: this.fromEmail,
        to: [to],
        subject,
        text
      });

      if (error) {
        throw new Error(error.message || 'Resend failed to send email');
      }

      console.log(`✅ Resend email sent successfully to ${to}:`, data?.id);
    } catch (error) {
      console.error(`❌ Failed to send email with Resend to ${to}`, error);
      throw error;
    }
  }
}

module.exports = ResendStrategy;