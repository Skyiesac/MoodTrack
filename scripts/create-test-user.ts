import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { User } from "../server/models/user";
import sequelize from "../server/models/db";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createTestUser() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    const hashedPassword = await hashPassword('Test123');
    
    // Delete existing user if exists
    await User.destroy({
      where: {
        username: 'JSmith'
      }
    });

    // Create test user
    const user = await User.create({
      username: 'JSmith',
      password: hashedPassword,
      email: 'jsmith@example.com',
      firstName: 'John',
      lastName: 'Smith'
    });

    console.log('Test user created successfully:', {
      username: user.username,
      email: user.email
    });

    await sequelize.close();
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser();
