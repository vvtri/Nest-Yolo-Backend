import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from '@nestjs/common'
import { AuthCredentialsDto } from './dtos/authCredentials.dto'
import { UserService } from './user.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './interfaces/jwt-payload.interface'
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
		private connection: Connection,
		private mailService: MailService
	) {}

	async signIn(authCredentialsDto: AuthCredentialsDto) {
		const { email, password } = authCredentialsDto

		const user = await this.userRepo.findOne({ email })

		if (!user.verified)
			throw new UnauthorizedException('Email is not verified')

		if (user && bcrypt.compareSync(password, user.password)) {
			const payload: JwtPayload = { userId: user.id }

			const accessToken = this.jwtService.sign(payload, {
				secret: process.env.JWT_SECRET,
				expiresIn: parseInt(process.env.COOKIE_EXPIRED),
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
			await this.sendVerifyEmail(email)
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
			await Promise.all([
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

			const payload: JwtPayload = { userId }

			const accessToken = this.jwtService.sign(payload, {
				secret: process.env.JWT_SECRET,
				expiresIn: parseInt(process.env.COOKIE_EXPIRED),
			})

			return { accessToken }
		} catch (error) {
			await queryRunner.rollbackTransaction()
			throw new InternalServerErrorException()
		} finally {
			await queryRunner.release()
		}
	}

	async sendVerifyEmail(email: string) {
		const user = await this.userRepo.findOne({ email })

		if (!user || user.verified)
			throw new BadRequestException('User not found or was verified')

		// create and hash secret string
		const secretString = uuid() + user.id.toString()
		const hashedSecretString = bcrypt.hashSync(secretString, 10)

		// Delete all user verification
		await this.userVerificationRepo.delete({ userId: user.id })

		// Create new user verification
		const userVerification = this.userVerificationRepo.create({
			secretString: hashedSecretString,
			user,
			// Expired after 6 hours
			expiredAt: new Date(Date.now() + 21600000),
		})

		const link = `http://localhost:3000/auth/verify/${user.id}/${secretString}`
		await Promise.all([
			this.userVerificationRepo.save(userVerification),
			this.mailService.sendVerificationEmail({
				from: 'Yolo-Shop',
				to: email,
				link: link,
			}),
		])
	}
}
