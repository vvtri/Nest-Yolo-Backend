import { Injectable } from '@nestjs/common'
import { v2 } from 'cloudinary'

@Injectable()
export class CloudinaryService {
	constructor() {
		v2.config({
			cloud_name: process.env.CLOUD_NAME,
			api_key: process.env.CLOUD_API,
			api_secret: process.env.CLOUD_SECRET,
			secure: true,
		})
	}

	async uploadImage(image: string): Promise<string> {
		const { public_id } = await v2.uploader.upload(image, {
			upload_preset: 'nest',
			unique_filename: true,
		})

		return public_id
	}

	async deleteImage(public_id: string) {
		await v2.uploader.destroy(public_id)
	}
}
