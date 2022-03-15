import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { APP_PIPE } from '@nestjs/core'
import { ProductsModule } from './products/products.module'
import config from '../ormconfig'
import * as cookieParser from 'cookie-parser'

@Module({
	imports: [TypeOrmModule.forRoot(config), AuthModule, ProductsModule],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_PIPE,
			useValue: new ValidationPipe({
				whitelist: true,
			}),
		},
	],
})
export class AppModule {
	configure(comsumer: MiddlewareConsumer) {
      // Use cookie middleware
		comsumer.apply(cookieParser()).forRoutes('*')
	}
}
