import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1705071630801 implements MigrationInterface {
    name = 'NewMigration1705071630801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "warehouse" ADD "orderId" uuid`);
        await queryRunner.query(`ALTER TABLE "warehouse" ADD CONSTRAINT "UQ_2ccf39f84e4d4de41edb329176b" UNIQUE ("orderId")`);
        await queryRunner.query(`ALTER TABLE "warehouse" ADD CONSTRAINT "FK_2ccf39f84e4d4de41edb329176b" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "warehouse" DROP CONSTRAINT "FK_2ccf39f84e4d4de41edb329176b"`);
        await queryRunner.query(`ALTER TABLE "warehouse" DROP CONSTRAINT "UQ_2ccf39f84e4d4de41edb329176b"`);
        await queryRunner.query(`ALTER TABLE "warehouse" DROP COLUMN "orderId"`);
    }

}
