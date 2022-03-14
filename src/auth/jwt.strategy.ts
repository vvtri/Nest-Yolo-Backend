import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Repository } from 'typeorm'
import { AuthService } from './auth.service'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { User } from './entities/user.entity'
import { UserService } from './user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		private configService: ConfigService,
		@InjectRepository(User) private userRepo: Repository<User>
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get<string>('JWT_SECRET'),
		})
	}

	async validate(payload: JwtPayload) {
		const { email } = payload

		const user = this.userRepo.findOne({ email })

		if (!user) throw new UnauthorizedException('invalid token')

		return user
	}
}
