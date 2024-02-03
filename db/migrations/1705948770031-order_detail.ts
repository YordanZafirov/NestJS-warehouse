import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class OrderDetail1705948770031 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'order_detail',
        columns: [
          {
            name: 'id',
            type: 'UUID',
            generationStrategy: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'order_id',
            type: 'UUID',
          },
          {
            name: 'product_id',
            type: 'UUID',
          },
          {
            name: 'quantity',
            type: 'float',
          },
          {
            name: 'unit_price',
            type: 'float',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        foreignKeys: [
            {
                columnNames: ['order_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'order',
            },
            {
                columnNames: ['product_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'product',
            },
        ]
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('order_detail');
  }
}
