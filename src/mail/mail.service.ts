import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { MailDto } from './dtos/mail.dto'

@Injectable()
export class MailService {
	constructor(private mailerService: MailerService) {}

	sendVerificationEmail(mailDto: MailDto) {
		const { from, to, link } = mailDto

		return this.mailerService.sendMail({
			from,
			to,
			subject: 'Xác thực tài khoản Yolo-Shop',
			text: `Đây là link xác thực tài khoản Yolo Shop của bạn: `,
			html: `<p>
            Đây là link xác thực tài khoản Yolo Shop của bạn: <a href='${link}' target='_blank'>Nhấn vào đây</a>
            <p><strong>Lưu ý:</strong> Link này có hiệu lực trong <strong>6 giờ</strong> kể từ khi nó được gửi!</p>
            </p>`,
		})
	}

	sendResetPasswordEmail(mailDto: MailDto) {
		const { from, to, link } = mailDto

		return this.mailerService.sendMail({
			from,
			to,
			subject: 'Khôi phục mật khẩu Yolo-Shop',
			text: `Đây là link khôi phục mật khẩu Yolo Shop của bạn: `,
			html: `<p>
            Đây là link khôi phục mật khẩu Yolo Shop của bạn: <a href='${link}' target='_blank'>Nhấn vào đây</a>
            <p><strong>Lưu ý:</strong> Link này có hiệu lực trong <strong>6 giờ</strong> kể từ khi nó được gửi!</p>
            </p>`,
		})
	}
}
