import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DB_NAME as string, process.env.DB_USER as string, process.env.DB_PASSWORD as string, {
    host: process.env.DB_HOST as string,
    dialect: 'mysql',
    logging: false
});

async function connection() {
    try {
        await sequelize.authenticate();
        // await sequelize.sync({ alter: true }); to add new fields into the tables not delete anything;;;
        console.log('Connection has been established successfully');
    } catch (error) {
        console.log('Unable to connect to the database:', error);
    }
}

connection();

export { sequelize, connection };