import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

interface ITaskAttributes {
    id: number;
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'done';
    userId: number;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

interface ITaskAttributesCreation extends Optional<ITaskAttributes, 'id' | 'description' | 'status' | 'priority' | 'dueDate' | 'createdAt' | 'updatedAt' | 'deletedAt'> { }

class Task extends Model<ITaskAttributes, ITaskAttributesCreation> {
    declare id: number;
    declare title: string;
    declare description: string | undefined;
    declare status: 'todo' | 'in-progress' | 'done';
    declare userId: number;
    declare priority: 'low' | 'medium' | 'high' | undefined;
    declare dueDate: Date | undefined;
}

Task.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        status: { type: DataTypes.ENUM('todo', 'in-progress', 'done'), defaultValue: 'todo' },
        userId: { type: DataTypes.INTEGER, allowNull: false },
        priority: { type: DataTypes.ENUM('low', 'medium', 'high'), defaultValue: 'low' },
        dueDate: { type: DataTypes.DATE, allowNull: true }
    },
    {
        sequelize,
        tableName: 'tasks',
        timestamps: true,
        paranoid: true
    }
);

export default Task;