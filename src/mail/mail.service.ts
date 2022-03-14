import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MailDto } from './dtos/mail.dto'

@Injectable()
export class MailService {
	constructor(
		private configService: ConfigService,
		private mailerService: MailerService
	) {}

	sendVerificationEmail(mailDto: MailDto) {
		const { from, to, link } = mailDto

		return this.mailerService.sendMail({
			from,
			to,
			text: `Đây là link xác thực tài khoản Yolo Shop của bạn: `,
			html: `<p>
            Đây là link xác thực tài khoản Yolo Shop của bạn: <a href='${link}' target='_blank'>Nhấn vào đây</a>
            <p><strong>Lưu ý:</strong> Link này có hiệu lực trong <strong>6 giờ</strong> kể từ khi nó được gửi!</p>
            </p>`,
		})
	}

	sendResetPasswordEmail(mailDto: MailDto) {}
}
