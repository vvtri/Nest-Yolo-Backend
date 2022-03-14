import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common'
import { AuthCredentialsDto } from './dtos/authCredentials.dto'
import { UserService } from './user.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Connection, Repository } from 'typeorm'
import { UserVefification } from './entities/userVerification.entity'
import { v4 as uuid } from 'uuid'
import { VerifyUserDto } from './dtos/verifyUser.dto'
import { MailerService } from '@nestjs-modules/mailer'
import { MailService } from '../mail/mail.service'

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User) private userRepo: Repository<User>,
		@InjectRepository(UserVefification)
		private userVerificationRepo: Repository<UserVefification>,
		private jwtService: JwtService,
		private configService: ConfigService,
		private connection: Connection,
		private mailService: MailService
	) {}

	async signIn(authCredentialsDto: AuthCredentialsDto) {
		const { email, password } = authCredentialsDto

		const user = await this.userRepo.findOne({ email })

		if (user && bcrypt.compareSync(password, user.password)) {
			const payload: JwtPayload = { email }

			const accessToken = this.jwtService.sign(payload, {
				secret: this.configService.get<string>('JWT_SECRET'),
				expiresIn: 3600 * 3,
			})

			return { accessToken, ...user }
		}

		throw new BadRequestException('Check your credentials')
	}

	async signUp(authCredentialsDto: AuthCredentialsDto) {
		const { email, password } = authCredentialsDto

		const salt = bcrypt.genSaltSync()
		const hashPassword = bcrypt.hashSync(password, salt)

		const user = this.userRepo.create({ email, password: hashPassword })

		try {
			await this.userRepo.save(user)

			// create and hash secret string
			const secretString: string = uuid() + user.id.toString()
			const hashedSecretString = bcrypt.hashSync(secretString, 10)

			const userVerification = this.userVerificationRepo.create({
				secretString: hashedSecretString,
				user,
				// Expired after 6 hours
				expiredAt: new Date(Date.now() + 21600000),
			})

			// Save user and send verify mail to user
			const link = `http://localhost:3000/auth/verify/${user.id}/${secretString}`

			await Promise.all([
				this.userVerificationRepo.save(userVerification),
				this.mailService.sendVerificationEmail({
					from: 'test',
					to: email,
					link,
				}),
			])

			return { ...user }
		} catch (error) {
			throw new BadRequestException('Email in use')
		}
	}

	async verifyUser(verifyUserDto: VerifyUserDto) {
		const { secretString, userId } = verifyUserDto
		const userVerification = await this.userVerificationRepo.findOne({
			where: { userId: userId },
		})

		if (!userVerification)
			throw new BadRequestException('User verification not found')

		if (!bcrypt.compareSync(secretString, userVerification.secretString))
			throw new BadRequestException('Not match secret')

		const queryRunner = this.connection.createQueryRunner()
		await queryRunner.connect()
		await queryRunner.startTransaction()
		try {
			// Update user and delete user verification
			const result = await Promise.all([
				queryRunner.manager.update(
					User,
					{ id: userId },
					{ verified: true }
				),
				queryRunner.manager.delete(UserVefification, {
					id: userVerification.id,
				}),
			])

			await queryRunner.commitTransaction()
		} catch (error) {
			await queryRunner.rollbackTransaction()
			throw new InternalServerErrorException()
		} finally {
			await queryRunner.release()
		}
	}
}
