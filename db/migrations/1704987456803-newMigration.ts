import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1704987456803 implements MigrationInterface {
    name = 'NewMigration1704987456803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "unit_type" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "unit_type"`);
    }

}
