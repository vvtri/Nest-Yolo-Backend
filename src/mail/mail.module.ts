import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { MailService } from './mail.service'

@Module({
	imports: [
		MailerModule.forRootAsync({
			useFactory: () => ({
				transport: {
					service: 'gmail',
					auth: {
						type: 'OAuth2',
						user: '6051071126@st.utc2.edu.vn',
						clientId: process.env.CLIENT_ID,
						clientSecret: process.env.CLIENT_SECRET,
						refreshToken: process.env.REFRESH_TOKEN,
						accessToken: process.env.ACCESS_TOKEN,
					},
				},
			}),
		}),
	],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
