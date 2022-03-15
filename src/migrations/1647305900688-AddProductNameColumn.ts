import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddProductNameColumn1647305900688 implements MigrationInterface {
	name = 'AddProductNameColumn1647305900688'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "product" ADD "name" character varying NOT NULL`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "name"`)
	}
}
