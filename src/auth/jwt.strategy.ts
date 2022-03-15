import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Repository } from 'typeorm'
import { AuthService } from './auth.service'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { User } from './entities/user.entity'
import { UserService } from './user.service'
import { Request } from 'express'

const cookieExtractor = function (req: any) {
	let token = null
	if (req && req.cookies) {
		token = req.cookies['jwt']
	}
	return token
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(@InjectRepository(User) private userRepo: Repository<User>) {
		super({
			jwtFromRequest: cookieExtractor,
			secretOrKey: process.env.JWT_SECRET,
		})
	}

	async validate(payload: JwtPayload) {
		const { userId } = payload

		const user = this.userRepo.findOne({ id: userId })

		if (!user) throw new UnauthorizedException('invalid token')

		return user
	}
}
