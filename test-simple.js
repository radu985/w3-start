console.log('=== Environment Test ===');
console.log('Node.js version:', process.version);
console.log('Current directory:', process.cwd());

// Check if .env file exists
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file exists');
  
  // Read and parse .env file
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  console.log('\n=== Environment Variables ===');
  lines.forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key] = line.split('=');
      console.log(`${key}=${process.env[key] ? 'Set' : 'Not set'}`);
    }
  });
} else {
  console.log('❌ .env file not found');
}

console.log('\n=== DATABASE_URL Check ===');
if (process.env.DATABASE_URL) {
  console.log('✅ DATABASE_URL is set');
  if (process.env.DATABASE_URL.includes('file:')) {
    console.log('📁 Using SQLite database');
  } else if (process.env.DATABASE_URL.includes('postgres')) {
    console.log('🐘 Using PostgreSQL database');
  }
} else {
  console.log('❌ DATABASE_URL is not set');
}

console.log('\n=== JWT_SECRET Check ===');
if (process.env.JWT_SECRET) {
  console.log('✅ JWT_SECRET is set');
} else {
  console.log('❌ JWT_SECRET is not set');
} 