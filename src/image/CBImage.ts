import {
    Column, CreatedAt, Default, Model, Table, Unique, UpdatedAt, DeletedAt,
} from "sequelize-typescript";

@Table({
    tableName: "images"
})
export class CBImage extends Model<CBImage> {

    @Column
    url!: string

    @Column
    model_id!: number

    @Column
    model_name!: string

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