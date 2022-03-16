import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductRepo } from './producct.repository'
import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'

@Module({
	imports: [TypeOrmModule.forFeature([ProductRepo])],
	controllers: [ProductsController],
	providers: [ProductsService],
})
export class ProductsModule {}
