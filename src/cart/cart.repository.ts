import { BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRepository } from 'src/auth/user.repository'
import { EntityRepository, Repository } from 'typeorm'
import { Cart } from './cart.entity'
import { AddCartDto } from './dtos'

@EntityRepository(Cart)
export class CartRepository extends Repository<Cart> {
	constructor(
		@InjectRepository(UserRepository) private userRepo: UserRepository
	) {
		super()
	}

	async getCart(id: number): Promise<Cart[]> {
		try {
			const result = await this.find({ where: { userId: id } })
			return result
		} catch (error) {
			throw new BadRequestException('Invalid product id')
		}
	}

	async addCart(userId: number, addCartDto: AddCartDto): Promise<Cart> {
		const { productId, quantity } = addCartDto

		const found = await this.findOne({ userId, productId })

		// If product exist in cart, plus quantity
		if (found) {
			found.quantity = found.quantity + quantity

			const result = await this.save(found)
			return result
		}

		const cart = this.create({
			productId,
			userId,
			quantity,
		})

		try {
			const result = await this.save(cart)
			return result
		} catch (error) {
			throw new BadRequestException('Invalid product id')
		}
	}

	async removeProduct(userId: number, productId: number) {
		const { affected } = await this.delete({ userId, productId })

		if (affected === 0) throw new BadRequestException('Invalid product id')
	}
}
