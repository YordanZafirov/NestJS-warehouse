import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1705604395483 implements MigrationInterface {
    name = 'NewMigration1705604395483'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "outgoing_warehouse_id" uuid`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_b7a29ad2b497d41fa61e73b2b67" FOREIGN KEY ("outgoing_warehouse_id") REFERENCES "warehouse"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_b7a29ad2b497d41fa61e73b2b67"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "outgoing_warehouse_id"`);
    }

}
