import connectDB from './src/config/db.js';
import User from './src/models/User.js';

connectDB();

setTimeout(async () => {
  try {
    const users = await User.find({}).select('email role name');
    console.log('\n=== Users in Database ===\n');
    users.forEach(user => {
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`Name: ${user.name}`);
      console.log('---');
    });
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}, 2000);
