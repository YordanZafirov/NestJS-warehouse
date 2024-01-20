import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1704987325526 implements MigrationInterface {
    name = 'NewMigration1704987325526'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" RENAME COLUMN "uic" TO "number"`);
        await queryRunner.query(`ALTER TABLE "invoice" RENAME CONSTRAINT "UQ_ce7b033a4214f2f2df4e5ae1f94" TO "UQ_60284980bc8b9c624459948f4ac"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "accountable_person"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_457d268b65128bfc43503147d04"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "uic"`);
        await queryRunner.query(`ALTER TABLE "client" ADD "accountable_person" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client" ADD "user_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client" ADD "address" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client" ADD "uic" character varying(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client" ADD CONSTRAINT "UQ_99ca8627d5b433f45183331773e" UNIQUE ("uic")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "UQ_99ca8627d5b433f45183331773e"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "uic"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "user_name"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "accountable_person"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "uic" character varying(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_457d268b65128bfc43503147d04" UNIQUE ("uic")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "accountable_person" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoice" RENAME CONSTRAINT "UQ_60284980bc8b9c624459948f4ac" TO "UQ_ce7b033a4214f2f2df4e5ae1f94"`);
        await queryRunner.query(`ALTER TABLE "invoice" RENAME COLUMN "number" TO "uic"`);
    }

}
