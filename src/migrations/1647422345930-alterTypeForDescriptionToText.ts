import {MigrationInterface, QueryRunner} from "typeorm";

export class alterTypeForDescriptionToText1647422345930 implements MigrationInterface {
    name = 'alterTypeForDescriptionToText1647422345930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "description" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "description" character varying NOT NULL`);
    }

}
