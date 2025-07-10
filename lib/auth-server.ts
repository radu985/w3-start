import { prisma } from './db'
import { hashPassword } from './auth'

export async function createAdminUser() {
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'admin' }
  })

  if (!existingAdmin) {
    const hashedPassword = await hashPassword('admin123')
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@portfolio.com',
        password: hashedPassword,
        role: 'admin'
      }
    })
    console.log('Admin user created')
  }
} 