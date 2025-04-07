import { Sequelize } from "sequelize";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false, // Disable logging, set to console.log for debugging
  dialectOptions: {
    ssl: process.env.NODE_ENV === "production", // Use SSL in production
  },
});
