const NodemailerStrategy = require('./email/nodemailer.strategy');

class EmailService {
  constructor(strategy = new NodemailerStrategy()) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  async sendOTP(email, otp) {
    await this.strategy.send(
      email,
      'Mã OTP kích hoạt tài khoản PubliCast',
      `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 10 phút.`
    );
  }

  async sendForgotPasswordOTP(email, otp) {
    await this.strategy.send(
      email,
      'Mã OTP đặt lại mật khẩu PubliCast',
      `Mã OTP đặt lại mật khẩu của bạn là: ${otp}. Mã có hiệu lực trong 5 phút.`
    );
  }

  async sendTeamInvitation(email, inviterName, brandName, inviteUrl) {
    await this.strategy.send(
      email,
      `Lời mời gia nhập đội ngũ ${brandName} trên PubliCast`,
      `Chào bạn,\n\n${inviterName} đã mời bạn tham gia thương hiệu "${brandName}" với tư cách thành viên.\n\nVui lòng truy cập liên kết sau để chấp nhận lời mời:\n${inviteUrl}\n\nLiên kết này sẽ hết hạn sau 7 ngày.`
    );
  }
}

module.exports = new EmailService();
