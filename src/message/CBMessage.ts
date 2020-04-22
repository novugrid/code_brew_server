import { Model, Table, Column, DataType, Default, CreatedAt, UpdatedAt, DeletedAt, HasMany } from "sequelize-typescript";
import { CBImage } from '../image/CBImage';


export class CBMessage<T> extends Model<T> {

    @Column(DataType.TEXT)
    message!: string

    @Default("all")
    @Column
    message_type!: string

    @Column
    message_title!: string

    @Column
    owner_id!: number

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

export enum MessageType {
    Single = "single",
    All = "all",
}

export interface MessageRequestParams {
    images: string[]
    message: string
    message_type: string
    owner_id: number,
    push_token: string,
    topic_id: string,
    message_title: string
}