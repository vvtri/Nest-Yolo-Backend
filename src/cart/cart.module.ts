import { Module } from '@nestjs/common'
import { CartService } from './cart.service'
import { CartController } from './cart.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CartRepository } from './cart.repository'
import { AuthModule } from 'src/auth/auth.module'
import { UserRepository } from 'src/auth/user.repository'

@Module({
	imports: [TypeOrmModule.forFeature([CartRepository, UserRepository])],
	providers: [CartService],
	controllers: [CartController],
})
export class CartModule {}
