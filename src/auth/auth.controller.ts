import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	Res,
	UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { isEmail } from 'class-validator'
import { Response } from 'express'
import { GetAuth } from 'src/common/decorators/getAuth.decorator'
import { DataAfterValidateType } from 'src/common/types'
import { Serialize } from 'src/common/interceptors/serialize.interceptor'
import { AuthService } from './auth.service'
import { AuthCredentialsDto } from './dtos/authCredentials.dto'
import { ChangeInfoUserDto } from './dtos/changeInfoUser.dto'
import { ResetPasswordDto } from './dtos/resetPassword.dto'
import { UserDto } from './dtos/user.dto'
import { VerifyUserDto } from './dtos/verifyUser.dto'
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
		res.send(await this.authService.verifyUser(params, res))
	}

	@Post('/signin')
	async signIn(@Body() body: AuthCredentialsDto, @Res() res: Response) {
		res.send(await this.authService.signIn(body, res))
	}

	@Post('/logout')
	@UseGuards(AuthGuard('jwtClient'))
	async logOut(@GetAuth() data: DataAfterValidateType, @Res() res: Response) {
		await this.authService.logOut(data.user, res)
		res.sendStatus(200)
	}

	@Post('/refresh')
	@UseGuards(AuthGuard('jwtRefresh'))
	@HttpCode(200)
	refresh(@GetAuth() data: DataAfterValidateType, @Res() res: Response) {
		this.authService.refresh(data, res)
		res.send('success')
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
	// User jwtClient Strategy
	@UseGuards(AuthGuard('jwtClient'))
	changeUserInfo(
		@Body() body: ChangeInfoUserDto,
		@GetAuth() data: DataAfterValidateType
	) {
		const { user } = data
		return this.userService.changeUserInfo(body, user)
	}

	@Get('/test')
	@UseGuards(AuthGuard('jwtClient'))
	test(@GetAuth() data: DataAfterValidateType) {
		const { user, refreshToken } = data
		console.log({ refreshToken })
		return 'success'
	}
}
