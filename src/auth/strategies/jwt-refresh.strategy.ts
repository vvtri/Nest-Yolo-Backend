import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Request } from 'express'
import { Strategy } from 'passport-jwt'
import { Repository } from 'typeorm'
import { User } from '../entities/user.entity'
import { JwtPayload } from '../interfaces/jwt-payload.interface'
import { UserRepository } from '../user.repository'
import { cookieExtractor } from './cookieExtractor'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
	Strategy,
	'jwtRefresh'
) {
	constructor(
		@InjectRepository(UserRepository) private userRepo: UserRepository,
		private jwt: JwtService
	) {
		super({
			jwtFromRequest: cookieExtractor('jwtRt'),
			secretOrKey: process.env.JWT_RT_SECRET,
			passReqToCallback: true,
		})
	}

	async validate(req: Request, payloadRt: JwtPayload) {
		const payloadAt = this.jwt.decode(req.cookies.jwtAt) as JwtPayload
		const { userId } = payloadRt

		if (!payloadAt?.userId || userId !== payloadAt.userId)
			throw new UnauthorizedException('AT invalid')

		const user = await this.userRepo.findOne({ id: userId })

		if (!user) throw new UnauthorizedException('Invalid user id')

		return { user, refreshToken: req.cookies.jwtRt }
	}
}
