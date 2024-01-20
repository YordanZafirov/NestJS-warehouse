import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1705071389888 implements MigrationInterface {
    name = 'NewMigration1705071389888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_a0d9cbb7f4a017bac3198dd8ca0"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP CONSTRAINT "FK_9ee82133c845ff6dc0a4878ee96"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "client_id"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP COLUMN "warehouse_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_detail" ADD "warehouse_id" uuid`);
        await queryRunner.query(`ALTER TABLE "order" ADD "client_id" uuid`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD CONSTRAINT "FK_9ee82133c845ff6dc0a4878ee96" FOREIGN KEY ("warehouse_id") REFERENCES "warehouse"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_a0d9cbb7f4a017bac3198dd8ca0" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
