import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from '@nestjs/common'
import { AuthCredentialsDto } from './dtos/authCredentials.dto'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Connection, Repository } from 'typeorm'
import { UserVefification } from './entities/userVerification.entity'
import { v4 as uuid } from 'uuid'
import { VerifyUserDto } from './dtos/verifyUser.dto'
import { MailService } from '../mail/mail.service'
import { UserRole, UserRoleEnum } from './entities/userRole.entity'
import { Response } from 'express'
import { DataAfterValidateType } from 'src/common/types'
import { UserRepository } from './user.repository'

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserRepository) private userRepo: UserRepository,
		@InjectRepository(UserVefification)
		private userVerificationRepo: Repository<UserVefification>,
		@InjectRepository(UserRole) private userRoleRepo: Repository<UserRole>,
		private jwtService: JwtService,
		private connection: Connection,
		private mailService: MailService
	) {}

	async signIn(authCredentialsDto: AuthCredentialsDto, res: Response) {
		const { email, password } = authCredentialsDto

		const user = await this.userRepo.findOne({ email })

		if (!user || !bcrypt.compareSync(password, user.password))
			throw new BadRequestException('Check your credentials')

		if (!user.verified)
			throw new UnauthorizedException('Email is not verified')

		const payload: JwtPayload = { userId: user.id }

		const accessToken = this.getAtToken(payload)
		const refreshToken = this.getRtToken(payload)
		this.setAtCookie(res, accessToken)
		this.setRtCookie(res, refreshToken)

		const hashedRt = bcrypt.hashSync(refreshToken, 10)

		// Save token to database
		await this.userRepo.update(user.id, { refreshToken: hashedRt })

		return { ...user }
	}

	async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
		const { email, password } = authCredentialsDto

		const salt = bcrypt.genSaltSync()
		const hashPassword = bcrypt.hashSync(password, salt)

		const user = this.userRepo.create({ email, password: hashPassword })
		// Save user, if there is error then this email has been used
		try {
			await this.userRepo.save(user)
		} catch (error) {
			throw new BadRequestException('Email in use')
		}

		const userRole = this.userRoleRepo.create({
			role: UserRoleEnum.CLIENT,
			user,
		})

		await Promise.all([
			this.sendVerifyEmail(email),
			this.userRoleRepo.save(userRole),
		])
		return user
	}

	refresh(data: DataAfterValidateType, res: Response) {
		const { user, refreshToken } = data

		if (!bcrypt.compareSync(refreshToken, user.refreshToken)) {
			this.deleteCookie(res, process.env.JWT_RT_NAME)
			throw new BadRequestException('Invalid cookie')
		}

		this.setAtCookie(res, this.getAtToken({ userId: user.id }))
	}

	async verifyUser(verifyUserDto: VerifyUserDto, res: Response) {
		const { secretString, userId } = verifyUserDto

		const userVerification = await this.userVerificationRepo.findOne({
			where: { userId: userId },
		})

		if (!userVerification)
			throw new BadRequestException('User verification not found')

		if (!bcrypt.compareSync(secretString, userVerification.secretString))
			throw new BadRequestException('Not match secret')

		const accessToken = this.getAtToken({ userId })
		const refreshToken = this.getRtToken({ userId })
		const hashedRt = bcrypt.hashSync(refreshToken, 10)

		const queryRunner = this.connection.createQueryRunner()
		await queryRunner.connect()
		await queryRunner.startTransaction()
		try {
			// Update user and delete user verification
			await Promise.all([
				queryRunner.manager.update(
					User,
					{ id: userId },
					{ verified: true, refreshToken: hashedRt }
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

		this.setAtCookie(res, accessToken)
		this.setRtCookie(res, refreshToken)

		return 'success'
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

		const link = `http://localhost:3000/api/auth/verify/${user.id}/${secretString}`
		await Promise.all([
			this.userVerificationRepo.save(userVerification),
			this.mailService.sendVerificationEmail({
				from: 'Yolo-Shop',
				to: email,
				link,
			}),
		])
	}

	async logOut(user: User, res: Response) {
		this.deleteCookie(res, process.env.JWT_AT_NAME)
		this.deleteCookie(res, process.env.JWT_RT_NAME)

		await this.userRepo.update(user.id, { refreshToken: null })
	}

	getAtToken(payload: JwtPayload): string {
		return this.jwtService.sign(payload, {
			secret: process.env.JWT_AT_SECRET,
			expiresIn: parseInt(process.env.AT_EXPIRED),
		})
	}

	getRtToken(payload: JwtPayload): string {
		return this.jwtService.sign(payload, {
			secret: process.env.JWT_RT_SECRET,
			expiresIn: parseInt(process.env.RT_EXPIRED),
		})
	}

	deleteCookie(res: Response, name: string) {
		res.cookie(name, '', {
			httpOnly: true,
			maxAge: 0,
		})
	}

	setAtCookie(res: Response, value: string): void {
		res.cookie(process.env.JWT_AT_NAME, value, {
			httpOnly: true,
			maxAge: parseInt(process.env.AT_EXPIRED) * 1000,
		})
	}

	setRtCookie(res: Response, value: string): void {
		res.cookie(process.env.JWT_RT_NAME, value, {
			httpOnly: true,
			maxAge: parseInt(process.env.RT_EXPIRED) * 1000,
			// Send refresh token only when need refresh
			path: '/api/auth/refresh',
		})
	}
}
