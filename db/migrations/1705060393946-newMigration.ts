import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1705060393946 implements MigrationInterface {
    name = 'NewMigration1705060393946'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "unit_type"`);
        await queryRunner.query(`CREATE TYPE "public"."product_unit_type_enum" AS ENUM('kg', 'L')`);
        await queryRunner.query(`ALTER TABLE "product" ADD "unit_type" "public"."product_unit_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'VIEWER'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "unit_type"`);
        await queryRunner.query(`DROP TYPE "public"."product_unit_type_enum"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "unit_type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "address" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying NOT NULL`);
    }

}
