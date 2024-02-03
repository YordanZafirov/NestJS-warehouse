import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Order1705948459075 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'order',
                columns: [
                    {
                    name: 'id',
                    type: 'UUID',
                    generationStrategy: 'uuid',
                    isPrimary: true,
                    default: 'uuid_generate_v4()',
                    },
                    {
                    name: 'client_id',
                    type: 'UUID',
                    },
                    {
                    name: 'warehouse_id',
                    type: 'UUID',
                    },
                    {
                    name: 'type',
                    type: 'enum',
                    enum: ['delivery', 'stock picking', 'transfer'],
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
                        name: 'client_id',
                        columnNames: ['client_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'client',
                    },
                    {
                        name: 'warehouse_id',
                        columnNames: ['warehouse_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'warehouse',
                    },
                ]
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('order');
    }

}
