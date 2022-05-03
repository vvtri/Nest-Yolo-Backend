import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { AuthController } from './auth.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtClientStrategy } from './strategies/jwt-client.strategy'
import { UserVefification } from './entities/userVerification.entity'
import { MailModule } from '../mail/mail.module'
import { UserResetPassword } from './entities/userResetpassword.entity'
import { JwtAdminStrategy } from './strategies/jwt-admin.strategy'
import { UserRole } from './entities/userRole.entity'
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy'
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module'
import { UserRepository } from './user.repository'

@Module({
	imports: [
		MailModule,
		CloudinaryModule,
		PassportModule.register({}),
		JwtModule.register({}),
		TypeOrmModule.forFeature([
			UserRepository,
			UserVefification, 
			UserResetPassword,
			UserRole,
		]),
	],
	providers: [
		UserService,
		AuthService,
		JwtClientStrategy,
		JwtAdminStrategy,
		JwtRefreshStrategy,
	],
	controllers: [AuthController],
})
export class AuthModule {}
