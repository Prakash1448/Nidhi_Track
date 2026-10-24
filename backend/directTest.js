import axios from 'axios';

const testLogin = async () => {
  console.log('\n=== Testing Login API Directly ===\n');
  
  const credentials = [
    { email: 'admin@aicte.gov.in', password: 'admin123', portal: 'AICTE' },
    { email: 'principal@apextech.edu.in', password: 'password123', portal: 'Institution' }
  ];

  for (const cred of credentials) {
    console.log(`\nTesting ${cred.portal} Login:`);
    console.log(`Email: ${cred.email}`);
    console.log(`Password: ${cred.password}`);
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: cred.email,
        password: cred.password
      });
      
      console.log('✅ LOGIN SUCCESS!');
      console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log('❌ LOGIN FAILED!');
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Error:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.log('Error:', error.message);
      }
    }
    console.log('---');
  }
  
  process.exit(0);
};

testLogin();
