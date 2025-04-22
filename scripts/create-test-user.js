import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { User } from "../server/models/user.js";
import sequelize from "../server/models/db.js";

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64));
  return `${buf.toString("hex")}.${salt}`;
}

async function createTestUser() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    const hashedPassword = await hashPassword('Test123');
    
    const user = await User.create({
      username: 'JSmith',
      firstName: 'John',
      lastName: 'Smith',
      email: 'jsmith@example.com',
      password: hashedPassword
    });

    console.log('Test user created successfully:', {
      id: user.id,
      username: user.username,
      email: user.email
    });

  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await sequelize.close();
  }
}

createTestUser();
