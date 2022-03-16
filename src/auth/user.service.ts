import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ChangeInfoUserDto } from './dtos/changeInfoUser.dto'
import { User } from './entities/user.entity'
import { UserResetPassword } from './entities/userResetpassword.entity'
import { v4 as uuid } from 'uuid'
import * as bcrypt from 'bcrypt'
import { MailService } from 'src/mail/mail.service'
import { ResetPasswordDto } from './dtos/resetPassword.dto'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'
import { UserRepository } from './user.repository'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserRepository) private userRepo: UserRepository,
		@InjectRepository(UserResetPassword)
		private userResetPasswordRepo: Repository<UserResetPassword>,
		private mailService: MailService,
		private cloudinaryService: CloudinaryService
	) {}

	async changeUserInfo(
		changeInfoUserDto: ChangeInfoUserDto,
		user: User
	): Promise<User> {
		const { address, avatar, name, phone } = changeInfoUserDto

		if (avatar) {
			try {
				const public_id = await this.cloudinaryService.uploadImage(avatar)
				user.avatar = public_id
			} catch (error) {
				console.log(error)
			}
		}

		if (address) user.address = address

		if (name) user.name = name

		if (phone) user.name = name

		return await this.userRepo.save(user)
	}

	async requestResetPassword(email: string) {
		const user = await this.userRepo.findOne({ email })

		if (!user) throw new BadRequestException('User not found')

		// Delete all reset password record
		await this.userResetPasswordRepo.delete({ userId: user.id })

		// Create user reset password and Send email
		const secretString: string = uuid() + user.id.toString()
		const hashedSecretString = bcrypt.hashSync(secretString, 10)

		const userResetpassword = this.userResetPasswordRepo.create({
			email,
			user: user,
			secretString: hashedSecretString,
			expiredAt: new Date(Date.now() + 21600000),
		})

		try {
			const link = `http://localhost:3000/api/auth/reset/${user.id}/${secretString}`
			await Promise.all([
				this.userResetPasswordRepo.save(userResetpassword),
				this.mailService.sendResetPasswordEmail({
					from: 'test',
					to: email,
					link,
				}),
			])
		} catch (error) {
			throw new InternalServerErrorException()
		}
	}

	async resetPassword(resetPasswordDto: ResetPasswordDto) {
		const { newPassword, secretString, userId } = resetPasswordDto

		const userResetpassword = await this.userResetPasswordRepo.findOne({
			userId,
		})

		if (!userResetpassword) throw new BadRequestException('User not found')

		if (!bcrypt.compareSync(secretString, userResetpassword.secretString))
			throw new BadRequestException('Secret not match')

		const hashedNewPassword = bcrypt.hashSync(newPassword, 10)
		try {
			await Promise.all([
				this.userRepo.update(
					{ id: userId },
					{ password: hashedNewPassword, verified: true }
				),
				this.userResetPasswordRepo.delete({ userId }),
			])
		} catch (error) {
			throw new InternalServerErrorException()
		}
	}
}
