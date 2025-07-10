const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const { Client } = require('pg')

const prisma = new PrismaClient()

async function testSetup() {
  console.log('🧪 Testing Portfolio Chat Setup...\n')

  try {
    // Test 1: Database Connection
    console.log('1. Testing Database Connection...')
    await prisma.$connect()
    console.log('✅ Database connection successful\n')

    // Test 2: Check Tables Exist
    console.log('2. Checking Database Tables...')
    const tables = ['User', 'Portfolio', 'Skill', 'Project', 'Message']
    
    for (const table of tables) {
      try {
        const count = await prisma[table].count()
        console.log(`✅ ${table} table exists (${count} records)`)
      } catch (error) {
        console.log(`❌ ${table} table missing or error:`, error.message)
      }
    }
    console.log()

    // Test 3: Check Admin User
    console.log('3. Checking Admin User...')
    const adminUser = await prisma.user.findFirst({
      where: { role: 'admin' }
    })
    
    if (adminUser) {
      console.log(`✅ Admin user exists: ${adminUser.email}`)
      
      // Test password
      const isValidPassword = await bcrypt.compare('admin123', adminUser.password)
      console.log(`✅ Admin password is valid: ${isValidPassword}`)
    } else {
      console.log('❌ Admin user not found')
    }
    console.log()

    // Test 4: Check Portfolio Data
    console.log('4. Checking Portfolio Data...')
    const portfolio = await prisma.portfolio.findFirst()
    if (portfolio) {
      console.log(`✅ Portfolio data exists: ${portfolio.title}`)
    } else {
      console.log('❌ Portfolio data not found')
    }
    console.log()

    // Test 5: Check Skills
    console.log('5. Checking Skills...')
    const skills = await prisma.skill.findMany()
    console.log(`✅ Found ${skills.length} skills`)
    
    const categories = [...new Set(skills.map(s => s.category))]
    console.log(`✅ Skill categories: ${categories.join(', ')}`)
    console.log()

    // Test 6: Check Projects
    console.log('6. Checking Projects...')
    const projects = await prisma.project.findMany()
    console.log(`✅ Found ${projects.length} projects`)
    
    const featuredProjects = projects.filter(p => p.featured)
    console.log(`✅ Featured projects: ${featuredProjects.length}`)
    console.log()

    // Test 7: Environment Variables
    console.log('7. Checking Environment Variables...')
    const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET']
    
    for (const envVar of requiredEnvVars) {
      if (process.env[envVar]) {
        console.log(`✅ ${envVar} is set`)
      } else {
        console.log(`❌ ${envVar} is missing`)
      }
    }
    console.log()

    console.log('🎉 Setup Test Complete!')
    console.log('\n📋 Next Steps:')
    console.log('1. Start the development servers: npm run dev:all')
    console.log('2. Visit http://localhost:3000/portfolio')
    console.log('3. Test admin login at http://localhost:3000/admin')
    console.log('4. Check the README.md for detailed testing guide')

  } catch (error) {
    console.error('❌ Setup test failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testSetup()
}

module.exports = { testSetup }

const client = new Client({
  connectionString: 'postgres://avnadmin:AVNS_WTUTnwh4TRLztAh6Fy9@pg-152ddc2b-rcamelia301-1911.e.aivencloud.com:16664/defaultdb?sslmode=require'
})
client.connect()
  .then(() => {
    console.log('Connected!')
    return client.end()
  })
  .catch(err => {
    console.error('Connection error:', err)
  }) 