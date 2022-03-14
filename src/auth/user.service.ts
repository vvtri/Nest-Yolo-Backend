import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AuthCredentialsDto } from './dtos/authCredentials.dto'
import { ChangeInfoUserDto } from './dtos/changeInfoUser.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

	changeUserInfo(changeInfoUserDto: ChangeInfoUserDto, user: User) {
		const { address, avatar, name, phone } = changeInfoUserDto

		if (address) {
			user.address = address
		}

		if (avatar) {
			user.avatar = avatar
		}

		if (name) {
			user.name = name
		}

		if (phone) {
			user.name = name
		}

		return this.userRepo.save(user)
	}

   
}
