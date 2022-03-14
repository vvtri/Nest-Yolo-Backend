import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Request,
	UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { GetUser } from 'src/decorators/getUser.decorator'
import { Serialize } from 'src/interceptors/serialize.interceptor'
import { AuthService } from './auth.service'
import { AuthCredentialsDto } from './dtos/authCredentials.dto'
import { ChangeInfoUserDto } from './dtos/changeInfoUser.dto'
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

	@Get('/verify/:userId/:secretString')
	async verify(@Param() param: VerifyUserDto) {
		try {
			await this.authService.verifyUser(param)
			return 'Verify successfully'
		} catch (error) {
			return error.toString()
		}
	}

	@Post('/signin')
	signIn(@Body() body: AuthCredentialsDto) {
		return this.authService.signIn(body)
	}

	@Patch('/change-info')
	@UseGuards(AuthGuard())
	changeUserInfo(@Body() body: ChangeInfoUserDto, @GetUser() user: User) {
		console.log(user)
		return this.userService.changeUserInfo(body, user)
	}
}
