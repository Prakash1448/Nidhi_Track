import connectDB from './src/config/db.js';
import User from './src/models/User.js';

const testEmail = 'principal@apextech.edu.in';
const testPassword = 'password123';

connectDB();

setTimeout(async () => {
  try {
    console.log('\n=== Testing Login ===\n');
    console.log(`Email: ${testEmail}`);
    console.log(`Password: ${testPassword}\n`);

    // Find user
    const user = await User.findOne({ email: testEmail }).select('+password');
    
    if (!user) {
      console.log('❌ User not found in database');
      console.log('\nLet me check what users exist:');
      const allUsers = await User.find({}).select('email role name');
      allUsers.forEach(u => {
        console.log(`  - ${u.email} (${u.role})`);
      });
      process.exit(1);
    }

    console.log('✅ User found:', user.email);
    console.log('   Role:', user.role);
    console.log('   Name:', user.name);
    
    // Test password
    const isMatch = await user.matchPassword(testPassword);
    
    if (isMatch) {
      console.log('\n✅ Password matches! Login should work.\n');
    } else {
      console.log('\n❌ Password does NOT match!');
      console.log('   This means the password in the database is different.\n');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}, 2000);
