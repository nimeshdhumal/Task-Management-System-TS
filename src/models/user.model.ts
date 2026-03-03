import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

interface IUserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

interface IUserCreationAttributes extends Optional<IUserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> { }

class User extends Model<IUserAttributes, IUserCreationAttributes> {
    declare id: number;
    declare name: string;
    declare email: string;
    declare password: string;
    declare role: 'admin' | 'user';
}

User.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(100), allowNull: false },
        email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
        password: { type: DataTypes.STRING(255), allowNull: false },
        role: { type: DataTypes.ENUM('admin', 'user'), allowNull: false, defaultValue: 'user' }
    },
    {
        sequelize,
        tableName: 'users',
        timestamps: true,
        paranoid: true
    }
);

export default User;