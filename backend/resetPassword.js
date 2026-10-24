import connectDB from './src/config/db.js';
import User from './src/models/User.js';

const email = 'admin@aicte.gov.in';
const newPassword = 'admin123';

connectDB();

setTimeout(async () => {
  try {
    console.log('\n=== Resetting Password ===\n');
    
    // Find user
    let user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found. Creating new user...');
      user = await User.create({
        email: email,
        password: newPassword,
        role: 'admin',
        name: 'AICTE Administrator',
        phone: '+91-11-29581000'
      });
      console.log('✅ User created successfully!');
    } else {
      // Update password (will be hashed by pre-save hook)
      user.password = newPassword;
      await user.save();
      console.log('✅ Password updated successfully!');
    }
    
    console.log('\nCredentials:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${newPassword}`);
    console.log('\nYou can now login with these credentials.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}, 2000);
