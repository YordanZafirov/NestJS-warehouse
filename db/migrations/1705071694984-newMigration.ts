import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1705071694984 implements MigrationInterface {
    name = 'NewMigration1705071694984'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "client_id" uuid`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_a0d9cbb7f4a017bac3198dd8ca0" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_a0d9cbb7f4a017bac3198dd8ca0"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "client_id"`);
    }

}
