import {MigrationInterface, QueryRunner} from "typeorm";

export class addProductTableAndOrderTable1647421432704 implements MigrationInterface {
    name = 'addProductTableAndOrderTable1647421432704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "available" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "product" ADD "unit" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "price" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "amount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "gender" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "gender"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "unit"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "available"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "description"`);
    }

}
