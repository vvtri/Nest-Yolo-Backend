import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { APP_PIPE } from '@nestjs/core'
import { ProductsModule } from './products/products.module'
import { CloudinaryModule } from './cloudinary/cloudinary.module'
import { CartModule } from './cart/cart.module'
import { OrderModule } from './order/order.module'
import config from '../ormconfig'
import * as cookieParser from 'cookie-parser'
import { ScheduleModule } from '@nestjs/schedule'

import { AppService } from './app.service'

@Module({
	imports: [
		TypeOrmModule.forRoot(config),
		ScheduleModule.forRoot(),
		AuthModule,
		ProductsModule,
		CloudinaryModule,
		CartModule,
		OrderModule,
	],
	providers: [
		// AppService,
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
