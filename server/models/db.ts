import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

console.log('Environment Variables:', process.env);

// Ensure the DATABASE_URL environment variable is set
const databaseUrl = process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/mydatabase';

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL is not defined. Using default database URL.');
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