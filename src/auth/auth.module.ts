import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { AuthController } from './auth.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtStrategy } from './jwt.strategy'
import { UserVefification } from './entities/userVerification.entity'
import { MailModule } from '../mail/mail.module'

@Module({
	imports: [
		ConfigModule,
		MailModule,
		PassportModule.register({
			defaultStrategy: 'jwt',
		}),
		JwtModule.register({}),
		TypeOrmModule.forFeature([User, UserVefification]),
	],
	providers: [UserService, AuthService, JwtStrategy],
	controllers: [AuthController],
})
export class AuthModule {}
