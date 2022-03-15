import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Res,
	UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { isEmail } from 'class-validator'
import { Response } from 'express'
import { GetUser } from 'src/decorators/getUser.decorator'
import { Serialize } from 'src/interceptors/serialize.interceptor'
import { AuthService } from './auth.service'
import { AuthCredentialsDto } from './dtos/authCredentials.dto'
import { ChangeInfoUserDto } from './dtos/changeInfoUser.dto'
import { ResetPasswordDto } from './dtos/resetPassword.dto'
import { UserDto } from './dtos/user.dto'
import { VerifyUserDto } from './dtos/verifyUser.dto'
import { User } from './entities/user.entity'
import { UserService } from './user.service'

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
	constructor(
		private authService: AuthService,
		private userService: UserService
	) {}

	@Post('/signup')
	signUp(@Body() body: AuthCredentialsDto) {
		return this.authService.signUp(body)
	}

	@Post('/resend-verification')
	async resendVerification(@Body('email') email: string) {
		if (!isEmail(email)) throw new BadRequestException('Invalid email')
		await this.authService.sendVerifyEmail(email)
		return 'resend verification success'
	}

	@Get('/verify/:userId/:secretString')
	async verify(@Param() params: VerifyUserDto, @Res() res: Response) {
		try {
			const { accessToken } = await this.authService.verifyUser(params)
			res.cookie('jwt', accessToken, {
				maxAge: parseInt(process.env.COOKIE_EXPIRED) * 1000,
			}).sendStatus(200)
		} catch (error) {
			return error.toString()
		}
	}

	@Post('/signin')
	async signIn(@Body() body: AuthCredentialsDto, @Res() res: Response) {
		const { accessToken, ...rest } = await this.authService.signIn(body)
		res.cookie('jwt', accessToken, {
			maxAge: parseInt(process.env.COOKIE_EXPIRED) * 1000,
		}).send({
			...rest,
		})
	}

	@Post('/request-reset')
	async requestResetPassword(@Body('email') email: string) {
		if (!isEmail(email)) {
			throw new BadRequestException('Invalid email')
		}

		await this.userService.requestResetPassword(email)
		return 'request reset password successed'
	}

	@Post('/reset')
	async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
		await this.userService.resetPassword(resetPasswordDto)
		return 'reset password success'
	}

	@Patch('/change-info')
	@UseGuards(AuthGuard())
	changeUserInfo(@Body() body: ChangeInfoUserDto, @GetUser() user: User) {
		return this.userService.changeUserInfo(body, user)
	}
}
