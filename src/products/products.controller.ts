import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common'
import { AdminGuard, ClientGuard } from 'src/common/guards'
import { AddProductDto } from './dtos/add-product.dto'
import { EditProductDto } from './dtos/edit-product.dto'
import { FilterProductDto } from './dtos/filter-product.dto'
import { ProductsService } from './products.service'

@Controller('products')
export class ProductsController {
	constructor(private productService: ProductsService) {}

	@Get()
	getAllProduct(@Body() filterProductDto: FilterProductDto) {
		return this.productService.getAllProduct(filterProductDto)
	}

	@Post()
	addProduct(@Body() addProductDto: AddProductDto) {
		return this.productService.addProduct(addProductDto)
	}

	@Patch()
	async editProduct(@Body() editProductDto: EditProductDto) {
		await this.productService.editProduct(editProductDto)
	}

	@Delete('/:id')
	@UseGuards(AdminGuard)
	async deleteProduct(@Param('id', ParseIntPipe) id: number) {
		await this.productService.deleteProduct(id)
	}
}
