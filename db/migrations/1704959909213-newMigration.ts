import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1704959909213 implements MigrationInterface {
    name = 'NewMigration1704959909213'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_detail" DROP CONSTRAINT "FK_a3647bd11aed3cf968c9ce9b835"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP CONSTRAINT "FK_88850b85b38a8a2ded17a1f5369"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP CONSTRAINT "FK_ccba95da04273e6685d2ee42be2"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP COLUMN "orderId"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP COLUMN "warehouseId"`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD "product_id" uuid`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD "order_id" uuid`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD "warehouse_id" uuid`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD CONSTRAINT "FK_985d5f728e1eebe4a3eabc43aac" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD CONSTRAINT "FK_a6ac5c99b8c02bd4ee53d3785be" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD CONSTRAINT "FK_9ee82133c845ff6dc0a4878ee96" FOREIGN KEY ("warehouse_id") REFERENCES "warehouse"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_detail" DROP CONSTRAINT "FK_9ee82133c845ff6dc0a4878ee96"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP CONSTRAINT "FK_a6ac5c99b8c02bd4ee53d3785be"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP CONSTRAINT "FK_985d5f728e1eebe4a3eabc43aac"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP COLUMN "warehouse_id"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP COLUMN "order_id"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP COLUMN "product_id"`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD "warehouseId" uuid`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD "orderId" uuid`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD "productId" uuid`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD CONSTRAINT "FK_ccba95da04273e6685d2ee42be2" FOREIGN KEY ("warehouseId") REFERENCES "warehouse"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD CONSTRAINT "FK_88850b85b38a8a2ded17a1f5369" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD CONSTRAINT "FK_a3647bd11aed3cf968c9ce9b835" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
