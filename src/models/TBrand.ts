import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from "sequelize-typescript";

@Table({ tableName: "t_brand", timestamps: true, paranoid: true, deletedAt: "deleted_at", createdAt: "created_at", updatedAt: "updated_at" })
export class TBrand extends Model {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: "PRIMARY", using: "BTREE", order: "ASC", unique: true })
    id?: number;

    @Column({ type: DataType.STRING(255) })
    brand_name!: string;

    @Column({ allowNull: true, type: DataType.DATE, comment: "删除时间" })
    deleted_at?: Date;

    @Column({ type: DataType.DATE, comment: "创建时间" })
    created_at!: Date;

    @Column({ type: DataType.BIGINT, comment: "创建者id" })
    created_by!: number;

    @Column({ type: DataType.DATE, comment: "更新时间" })
    updated_at!: Date;

    @Column({ type: DataType.BIGINT, comment: "更新者id" })
    updated_by!: number;
}