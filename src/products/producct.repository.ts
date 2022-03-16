import {
	BadRequestException,
	InternalServerErrorException,
} from '@nestjs/common'
import { EntityRepository, Repository } from 'typeorm'
import { AddProductDto } from './dtos/add-product.dto'
import { FilterProductDto } from './dtos/filter-product.dto'
import { SortEnum } from './enums/sort-enum'
import { Product } from './products.entity'
import * as SqlString from 'sqlstring'
import { EditProductDto } from './dtos/edit-product.dto'
import {} from 'sqlstring'

@EntityRepository(Product)
export class ProductRepo extends Repository<Product> {
	addProduct(addProductDto: AddProductDto): Promise<Product> {
		const { amount, available, description, gender, name, price, unit } =
			addProductDto

		const product = this.create({
			amount,
			available,
			description,
			gender,
			name,
			price,
			unit,
		})

		return this.save(product)
	}

	filterProduct(filterProductDto: FilterProductDto): Promise<Product[]> {
		const { amount, available, gender, keyword, sort } = filterProductDto

		const qb = this.createQueryBuilder('product')

		// Use != to check both null and undefined
		if (available != undefined)
			qb.andWhere('product.available = :available', { available })

		if (gender != undefined)
			qb.andWhere('product.gender = :gender', { gender })

		if (amount != undefined)
			qb.andWhere('product.amount >= :amount', { amount })

		// plainto_tsquery because it accept white space
		if (keyword)
			qb.andWhere(
				`to_tsvector(name || ' ' || description) @@ plainto_tsquery(${SqlString.escape(
					keyword
				)})`
			)

		switch (sort) {
			case SortEnum.NEWEST:
				qb.orderBy('product.createdAt', 'DESC')
				break
			case SortEnum.OLDEST:
				qb.orderBy('product.createdAt', 'ASC')
				break
			case SortEnum.PRICE_ASC:
				qb.orderBy('product.price', 'ASC')
				break
			case SortEnum.PRICE_DESC:
				qb.orderBy('product.price', 'DESC')
				break
		}

		return qb.getMany()
	}

	async editProduct(editProductDto: EditProductDto) {
		const { id, amount, available, description, gender, name, price, unit } =
			editProductDto

		console.log(id)

		const updateObj = {}

		if (name) Object.assign(updateObj, { name })

		if (unit) Object.assign(updateObj, { unit })

		if (description) Object.assign(updateObj, { description })

		// Use != to check both null and undefined
		if (gender != undefined) Object.assign(updateObj, { gender })

		if (price != undefined) Object.assign(updateObj, { price })

		if (available != undefined) Object.assign(updateObj, { available })

		if (amount != undefined) Object.assign(updateObj, { amount })

		let affected: number = 0

		try {
			const result = await this.update(id, updateObj)
			affected = result.affected
		} catch (error) {
			throw new InternalServerErrorException(error)
		}

		if (affected === 0) throw new BadRequestException('Product not found')
	}

	async deleteProduct(id: number) {
		let affected = 0

		try {
			const reuslt = await this.delete(id)
			affected = reuslt.affected
		} catch (error) {
			throw new InternalServerErrorException(error)
		}

		if (affected === 0) throw new BadRequestException('Product not found')
	}
}
