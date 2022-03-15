// dotenv must be top of everything
import * as dotenv from 'dotenv'
dotenv.config({
	path: '.env.development',
})

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.setGlobalPrefix('api')
	await app.listen(3000)
}
bootstrap()
