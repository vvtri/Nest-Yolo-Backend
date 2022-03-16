import {MigrationInterface, QueryRunner} from "typeorm";

export class addUniqueProductNameColumn1647421659680 implements MigrationInterface {
    name = 'addUniqueProductNameColumn1647421659680'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "UQ_22cc43e9a74d7498546e9a63e77" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "UQ_22cc43e9a74d7498546e9a63e77"`);
    }

}
