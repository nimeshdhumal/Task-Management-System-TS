import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

interface ICommentAttributes {
    id: number;
    text: string;
    taskId: number;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

interface ICommentAttributesCreation extends Optional<ICommentAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> { }

class Comment extends Model<ICommentAttributes, ICommentAttributesCreation> {
    declare id: number;
    declare text: string;
    declare taskId: number;
    declare userId: number;
}

Comment.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        text: { type: DataTypes.TEXT, allowNull: false },
        taskId: { type: DataTypes.INTEGER, allowNull: false },
        userId: { type: DataTypes.INTEGER, allowNull: false }
    },
    {
        sequelize,
        tableName: 'comments',
        timestamps: true,
        paranoid: true
    }
);

export default Comment;