import {
    Column, CreatedAt, Model, Table, UpdatedAt, DeletedAt,
} from "sequelize-typescript";

@Table({
    tableName: "images"
})
export class CBImage extends Model {

    @Column
    public url!: string;

    @Column
    public associate_table_id!: number;

    @Column
    public associate_table_name!: string;

    @CreatedAt
    @Column
    public created_at!: Date;

    @UpdatedAt
    @Column
    public updated_at!: Date;

    @DeletedAt
    @Column
    public deleted_at!: Date;

}

export interface CBImageParams {
    url: string
    owner_id: number
    owner_type: string
}
