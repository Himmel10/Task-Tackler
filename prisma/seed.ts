import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking for admin user...');
    
    // Check if admin exists
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@tasktackler.com' },
    });

    if (adminExists) {
      console.log('✓ Admin user already exists:');
      console.log(`  Email: ${adminExists.email}`);
      console.log(`  Username: ${adminExists.username}`);
      console.log(`  Role: ${adminExists.role}`);
      return;
    }

    // Create admin user
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@tasktackler.com',
        username: 'admin',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('✓ Admin user created successfully:');
    console.log(`  ID: ${admin.id}`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Username: ${admin.username}`);
    console.log(`  Role: ${admin.role}`);
    console.log('\nYou can now sign in with:');
    console.log('  Email: admin@tasktackler.com');
    console.log('  Password: admin123');
  } catch (error: any) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
