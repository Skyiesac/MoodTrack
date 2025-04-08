import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

console.log('Environment Variables:', process.env);

// Ensure the DATABASE_URL environment variable is set
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is not defined or is invalid');
  throw new Error('DATABASE_URL is not defined or is invalid');
}

console.log('Database URL:', databaseUrl);

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production'
  }
});

export default sequelize;