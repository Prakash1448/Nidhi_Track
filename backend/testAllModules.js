import axios from 'axios';
import colors from './testColors.js';

const API_BASE = 'http://localhost:5000';
let authToken = null;
let testUserId = null;
let testInstitutionId = null;
let testFdrId = null;

console.log('\n' + '='.repeat(60));
console.log('🧪 NIDHI TRACK - COMPLETE MODULE TEST');
console.log('='.repeat(60) + '\n');

// Test counter
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

const logTest = (name, status, details = '') => {
  totalTests++;
  if (status === 'PASS') {
    passedTests++;
    console.log(`✅ ${name}`);
  } else {
    failedTests++;
    console.log(`❌ ${name}`);
  }
  if (details) console.log(`   ${details}`);
};

// 1. Test Health Check
const testHealth = async () => {
  console.log('\n📍 MODULE 1: Health Check\n');
  try {
    const response = await axios.get(`${API_BASE}/api/health`);
    if (response.data.success) {
      logTest('Health endpoint', 'PASS', `Server is running`);
    } else {
      logTest('Health endpoint', 'FAIL', 'Success flag is false');
    }
  } catch (error) {
    logTest('Health endpoint', 'FAIL', error.message);
  }
};

// 2. Test Authentication - Login
const testLogin = async () => {
  console.log('\n📍 MODULE 2: Authentication\n');
  
  // Test AICTE Admin Login
  try {
    const response = await axios.post(`${API_BASE}/api/auth/login`, {
      email: 'admin@aicte.gov.in',
      password: 'admin123'
    });
    
    if (response.data.success && response.data.data.token) {
      authToken = response.data.data.token;
      testUserId = response.data.data.user._id;
      logTest('Admin login', 'PASS', `Token received, User: ${response.data.data.user.name}`);
    } else {
      logTest('Admin login', 'FAIL', 'No token in response');
    }
  } catch (error) {
    logTest('Admin login', 'FAIL', error.response?.data?.message || error.message);
  }

  // Test Institution Login
  try {
    const response = await axios.post(`${API_BASE}/api/auth/login`, {
      email: 'principal@apextech.edu.in',
      password: 'password123'
    });
    
    if (response.data.success && response.data.data.token) {
      logTest('Institution login', 'PASS', `User: ${response.data.data.user.name}`);
    } else {
      logTest('Institution login', 'FAIL', 'No token in response');
    }
  } catch (error) {
    logTest('Institution login', 'FAIL', error.response?.data?.message || error.message);
  }

  // Test Invalid Login
  try {
    await axios.post(`${API_BASE}/api/auth/login`, {
      email: 'wrong@email.com',
      password: 'wrongpass'
    });
    logTest('Invalid login rejection', 'FAIL', 'Should have been rejected');
  } catch (error) {
    if (error.response?.status === 401) {
      logTest('Invalid login rejection', 'PASS', 'Correctly rejected invalid credentials');
    } else {
      logTest('Invalid login rejection', 'FAIL', 'Wrong error code');
    }
  }

  // Test Get Current User
  if (authToken) {
    try {
      const response = await axios.get(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      if (response.data.success && response.data.data) {
        logTest('Get current user', 'PASS', `Retrieved user: ${response.data.data.email}`);
      } else {
        logTest('Get current user', 'FAIL', 'No user data');
      }
    } catch (error) {
      logTest('Get current user', 'FAIL', error.response?.data?.message || error.message);
    }
  }
};

// 3. Test Institutions API
const testInstitutions = async () => {
  console.log('\n📍 MODULE 3: Institutions API\n');
  
  if (!authToken) {
    logTest('Institutions module', 'SKIP', 'No auth token available');
    return;
  }

  // Get all institutions
  try {
    const response = await axios.get(`${API_BASE}/api/institutions`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success && response.data.data.length > 0) {
      testInstitutionId = response.data.data[0]._id;
      logTest('Get all institutions', 'PASS', `Found ${response.data.data.length} institutions`);
    } else {
      logTest('Get all institutions', 'FAIL', 'No institutions found');
    }
  } catch (error) {
    logTest('Get all institutions', 'FAIL', error.response?.data?.message || error.message);
  }

  // Get single institution
  if (testInstitutionId) {
    try {
      const response = await axios.get(`${API_BASE}/api/institutions/${testInstitutionId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      if (response.data.success && response.data.data) {
        logTest('Get institution by ID', 'PASS', `Retrieved: ${response.data.data.name}`);
      } else {
        logTest('Get institution by ID', 'FAIL', 'No data');
      }
    } catch (error) {
      logTest('Get institution by ID', 'FAIL', error.response?.data?.message || error.message);
    }
  }
};

// 4. Test FDRs API
const testFdrs = async () => {
  console.log('\n📍 MODULE 4: FDRs API\n');
  
  if (!authToken) {
    logTest('FDRs module', 'SKIP', 'No auth token available');
    return;
  }

  // Get all FDRs
  try {
    const response = await axios.get(`${API_BASE}/api/fdrs`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success && response.data.data.length > 0) {
      testFdrId = response.data.data[0]._id;
      logTest('Get all FDRs', 'PASS', `Found ${response.data.data.length} FDRs`);
    } else {
      logTest('Get all FDRs', 'FAIL', 'No FDRs found');
    }
  } catch (error) {
    logTest('Get all FDRs', 'FAIL', error.response?.data?.message || error.message);
  }

  // Get single FDR
  if (testFdrId) {
    try {
      const response = await axios.get(`${API_BASE}/api/fdrs/${testFdrId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      if (response.data.success && response.data.data) {
        logTest('Get FDR by ID', 'PASS', `FDR Number: ${response.data.data.fdrNumber}`);
      } else {
        logTest('Get FDR by ID', 'FAIL', 'No data');
      }
    } catch (error) {
      logTest('Get FDR by ID', 'FAIL', error.response?.data?.message || error.message);
    }
  }

  // Get FDRs by institution
  if (testInstitutionId) {
    try {
      const response = await axios.get(`${API_BASE}/api/fdrs/institution/${testInstitutionId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      if (response.data.success) {
        logTest('Get FDRs by institution', 'PASS', `Found ${response.data.data.length} FDRs`);
      } else {
        logTest('Get FDRs by institution', 'FAIL', 'No data');
      }
    } catch (error) {
      logTest('Get FDRs by institution', 'FAIL', error.response?.data?.message || error.message);
    }
  }
};

// 5. Test Release Requests API
const testRequests = async () => {
  console.log('\n📍 MODULE 5: Release Requests API\n');
  
  if (!authToken) {
    logTest('Requests module', 'SKIP', 'No auth token available');
    return;
  }

  // Get all requests
  try {
    const response = await axios.get(`${API_BASE}/api/requests`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success) {
      logTest('Get all requests', 'PASS', `Found ${response.data.data.length} requests`);
    } else {
      logTest('Get all requests', 'FAIL', 'Response not successful');
    }
  } catch (error) {
    logTest('Get all requests', 'FAIL', error.response?.data?.message || error.message);
  }

  // Get requests by institution
  if (testInstitutionId) {
    try {
      const response = await axios.get(`${API_BASE}/api/requests/institution/${testInstitutionId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      if (response.data.success) {
        logTest('Get requests by institution', 'PASS', `Found ${response.data.data.length} requests`);
      } else {
        logTest('Get requests by institution', 'FAIL', 'No data');
      }
    } catch (error) {
      logTest('Get requests by institution', 'FAIL', error.response?.data?.message || error.message);
    }
  }
};

// 6. Test Dashboard API
const testDashboard = async () => {
  console.log('\n📍 MODULE 6: Dashboard API\n');
  
  if (!authToken) {
    logTest('Dashboard module', 'SKIP', 'No auth token available');
    return;
  }

  // Get stats
  try {
    const response = await axios.get(`${API_BASE}/api/dashboard/stats`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success && response.data.data) {
      logTest('Get dashboard stats', 'PASS', 
        `Institutions: ${response.data.data.totalInstitutions}, FDRs: ${response.data.data.totalFDRs}`);
    } else {
      logTest('Get dashboard stats', 'FAIL', 'No data');
    }
  } catch (error) {
    logTest('Get dashboard stats', 'FAIL', error.response?.data?.message || error.message);
  }

  // Get analytics
  try {
    const response = await axios.get(`${API_BASE}/api/dashboard/analytics`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success && response.data.data) {
      logTest('Get dashboard analytics', 'PASS', 'Analytics data received');
    } else {
      logTest('Get dashboard analytics', 'FAIL', 'No data');
    }
  } catch (error) {
    logTest('Get dashboard analytics', 'FAIL', error.response?.data?.message || error.message);
  }
};

// 7. Test Protected Routes
const testProtectedRoutes = async () => {
  console.log('\n📍 MODULE 7: Authorization & Security\n');

  // Test without token
  try {
    await axios.get(`${API_BASE}/api/auth/me`);
    logTest('Protected route without token', 'FAIL', 'Should have been rejected');
  } catch (error) {
    if (error.response?.status === 401) {
      logTest('Protected route without token', 'PASS', 'Correctly rejected unauthorized access');
    } else {
      logTest('Protected route without token', 'FAIL', `Wrong error code: ${error.response?.status}`);
    }
  }

  // Test with invalid token
  try {
    await axios.get(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: 'Bearer invalidtoken123' }
    });
    logTest('Protected route with invalid token', 'FAIL', 'Should have been rejected');
  } catch (error) {
    if (error.response?.status === 401) {
      logTest('Protected route with invalid token', 'PASS', 'Correctly rejected invalid token');
    } else {
      logTest('Protected route with invalid token', 'FAIL', `Wrong error code: ${error.response?.status}`);
    }
  }

  // Test CORS
  try {
    const response = await axios.options(`${API_BASE}/api/health`);
    logTest('CORS preflight', 'PASS', 'CORS is configured');
  } catch (error) {
    logTest('CORS preflight', 'FAIL', error.message);
  }
};

// Run all tests
const runAllTests = async () => {
  try {
    await testHealth();
    await testLogin();
    await testInstitutions();
    await testFdrs();
    await testRequests();
    await testDashboard();
    await testProtectedRoutes();

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    console.log('='.repeat(60) + '\n');

    if (failedTests === 0) {
      console.log('🎉 ALL TESTS PASSED! System is working properly.\n');
    } else {
      console.log('⚠️  Some tests failed. Please check the errors above.\n');
    }

    process.exit(failedTests === 0 ? 0 : 1);
  } catch (error) {
    console.error('❌ Test suite error:', error.message);
    process.exit(1);
  }
};

// Check if server is running
console.log('Checking if backend server is running...\n');
axios.get(`${API_BASE}/api/health`)
  .then(() => {
    console.log('✅ Backend server is running. Starting tests...\n');
    runAllTests();
  })
  .catch((error) => {
    console.error('❌ Backend server is NOT running!');
    console.error('   Please start the server first: cd backend && node src/server.js\n');
    process.exit(1);
  });
