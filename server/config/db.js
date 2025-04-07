require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'journal_app_db_c496',
    process.env.DB_USER || 'journal_app_db_c496_user',
    process.env.DB_PASSWORD || 'CGBh2pZUfWIZuku5abLeiI18tVDrTxeO',
    {
        host: process.env.DB_HOST || 'dpg-cu4rmq5ds78s73ds0nm0-a.oregon-postgres.render.com',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: console.log,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    }
);

module.exports = sequelize;