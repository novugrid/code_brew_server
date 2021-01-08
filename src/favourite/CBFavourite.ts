import { Model, Column, CreatedAt, UpdatedAt, DeletedAt, Table, ForeignKey, DefaultScope } from 'sequelize-typescript';

@DefaultScope({
    attributes: ['user_id', 'id']
})
@Table({
    tableName: "favourites"
})
export class CBFavourite extends Model<CBFavourite> {
    
    @Column
    user_id!: number;

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
