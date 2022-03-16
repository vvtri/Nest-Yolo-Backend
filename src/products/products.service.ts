import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AddProductDto } from './dtos/add-product.dto'
import { EditProductDto } from './dtos/edit-product.dto'
import { FilterProductDto } from './dtos/filter-product.dto'
import { ProductRepo } from './producct.repository'
import { Product } from './products.entity'

@Injectable()
export class ProductsService {
	constructor(
		@InjectRepository(ProductRepo) private productRepo: ProductRepo
	) {}

	getAllProduct(filterProductDto: FilterProductDto) {
		return this.productRepo.filterProduct(filterProductDto)
	}

	addProduct(addProductDto: AddProductDto): Promise<Product> {
		return this.productRepo.addProduct(addProductDto)
	}

	editProduct(editProductDto: EditProductDto): Promise<void> {
		return this.productRepo.editProduct(editProductDto)
	}

	deleteProduct(id: number): Promise<void> {
		return this.productRepo.deleteProduct(id)
	}
}
