import {MigrationInterface, QueryRunner} from "typeorm";

export class addOrderDetailTable1647441824891 implements MigrationInterface {
    name = 'addOrderDetailTable1647441824891'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order_detail" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "orderId" integer, "productId" integer, CONSTRAINT "PK_0afbab1fa98e2fb0be8e74f6b38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD CONSTRAINT "FK_88850b85b38a8a2ded17a1f5369" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD CONSTRAINT "FK_a3647bd11aed3cf968c9ce9b835" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP CONSTRAINT "FK_a3647bd11aed3cf968c9ce9b835"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP CONSTRAINT "FK_88850b85b38a8a2ded17a1f5369"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "order_detail"`);
    }

}
