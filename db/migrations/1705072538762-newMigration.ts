import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1705072538762 implements MigrationInterface {
    name = 'NewMigration1705072538762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "warehouse" DROP CONSTRAINT "FK_2ccf39f84e4d4de41edb329176b"`);
        await queryRunner.query(`ALTER TABLE "warehouse" DROP CONSTRAINT "UQ_2ccf39f84e4d4de41edb329176b"`);
        await queryRunner.query(`ALTER TABLE "warehouse" DROP COLUMN "orderId"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "warehouse_id" uuid`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_35fc3b8f9cacf93e2f189738b3c" FOREIGN KEY ("warehouse_id") REFERENCES "warehouse"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_35fc3b8f9cacf93e2f189738b3c"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "warehouse_id"`);
        await queryRunner.query(`ALTER TABLE "warehouse" ADD "orderId" uuid`);
        await queryRunner.query(`ALTER TABLE "warehouse" ADD CONSTRAINT "UQ_2ccf39f84e4d4de41edb329176b" UNIQUE ("orderId")`);
        await queryRunner.query(`ALTER TABLE "warehouse" ADD CONSTRAINT "FK_2ccf39f84e4d4de41edb329176b" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
