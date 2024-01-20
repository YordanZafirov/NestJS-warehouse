import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1704959794726 implements MigrationInterface {
    name = 'NewMigration1704959794726'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_detail" RENAME COLUMN "unitPrice" TO "unit_price"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`ALTER TABLE "order_detail" RENAME COLUMN "unit_price" TO "unitPrice"`);
    }

}
