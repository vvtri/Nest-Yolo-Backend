import {MigrationInterface, QueryRunner} from "typeorm";

export class init1647389495961 implements MigrationInterface {
    name = 'init1647389495961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_reset_password" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "secretString" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "expiredAt" TIMESTAMP NOT NULL, "userId" integer NOT NULL, CONSTRAINT "REL_c88e6b917ea23eba24be9d4c32" UNIQUE ("userId"), CONSTRAINT "PK_7375b15001ebb80cac091ea3589" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_role_enum" AS ENUM('ADMIN', 'CLIENT')`);
        await queryRunner.query(`CREATE TABLE "user_role" ("id" SERIAL NOT NULL, "role" "public"."user_role_role_enum" NOT NULL DEFAULT 'CLIENT', "userId" integer NOT NULL, CONSTRAINT "PK_fb2e442d14add3cefbdf33c4561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_vefification" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "secretString" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "expiredAt" TIMESTAMP NOT NULL, CONSTRAINT "REL_2233a83b3961a2f82bdf3865cc" UNIQUE ("userId"), CONSTRAINT "PK_e65a1ad1ab83f8d00de81fee7db" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "avatar" character varying, "phone" character varying, "address" character varying, "verified" boolean DEFAULT false, "name" character varying, "refreshToken" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_reset_password" ADD CONSTRAINT "FK_c88e6b917ea23eba24be9d4c32a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_ab40a6f0cd7d3ebfcce082131fd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_vefification" ADD CONSTRAINT "FK_2233a83b3961a2f82bdf3865cc0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_vefification" DROP CONSTRAINT "FK_2233a83b3961a2f82bdf3865cc0"`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_ab40a6f0cd7d3ebfcce082131fd"`);
        await queryRunner.query(`ALTER TABLE "user_reset_password" DROP CONSTRAINT "FK_c88e6b917ea23eba24be9d4c32a"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_vefification"`);
        await queryRunner.query(`DROP TABLE "user_role"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_role_enum"`);
        await queryRunner.query(`DROP TABLE "user_reset_password"`);
        await queryRunner.query(`DROP TABLE "product"`);
    }

}
