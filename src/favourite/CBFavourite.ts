import { Model, DataType, Default, Column, CreatedAt, UpdatedAt, DeletedAt, Table } from 'sequelize-typescript';

@Table({
    tableName: "favourites"
})
export class CBFavourite extends Model<CBFavourite> {
    
    @Column
    user_id!: number

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