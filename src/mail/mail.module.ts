import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MailService } from './mail.service'

@Module({
	imports: [
		ConfigModule,
		MailerModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				transport: {
					service: 'gmail',
					auth: {
						type: 'OAuth2',
						user: '6051071126@st.utc2.edu.vn',
						clientId: configService.get<string>('CLIENT_ID'),
						clientSecret: configService.get<string>('CLIENT_SECRET'),
						refreshToken: configService.get<string>('REFRESH_TOKEN'),
						accessToken: configService.get<string>('ACCESS_TOKEN'),
					},
				},
			}),
		}),
	],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
