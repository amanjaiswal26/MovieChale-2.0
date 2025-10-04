import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/admin';

// Test data for creating a theater
const testTheater = {
    name: "Test Theater",
    location: "Test Location",
    address: "123 Test Street",
    city: "Test City",
    state: "Test State",
    zipCode: "12345",
    phone: "123-456-7890",
    email: "test@theater.com",
    capacity: 100,
    amenities: ["IMAX", "3D", "Dolby Atmos"],
    description: "This is a test theater for development purposes"
};

async function testTheaterEndpoints() {
    try {
        console.log('🧪 Testing Theater Endpoints...\n');

        // Test 1: Create a theater (this will fail without auth, but we can see the endpoint exists)
        console.log('1. Testing POST /api/admin/theaters');
        try {
            const createResponse = await axios.post(`${BASE_URL}/theaters`, testTheater);
            console.log('✅ Create theater successful:', createResponse.data);
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Endpoint exists (401 Unauthorized - expected without auth)');
            } else {
                console.log('❌ Create theater failed:', error.response?.data || error.message);
            }
        }

        // Test 2: Get all theaters
        console.log('\n2. Testing GET /api/admin/theaters');
        try {
            const getResponse = await axios.get(`${BASE_URL}/theaters`);
            console.log('✅ Get theaters successful:', getResponse.data);
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Endpoint exists (401 Unauthorized - expected without auth)');
            } else {
                console.log('❌ Get theaters failed:', error.response?.data || error.message);
            }
        }

        // Test 3: Test server health
        console.log('\n3. Testing server health');
        try {
            const healthResponse = await axios.get('http://localhost:5000/');
            console.log('✅ Server is running:', healthResponse.data);
        } catch (error) {
            console.log('❌ Server health check failed:', error.message);
        }

        console.log('\n🎉 Theater endpoint tests completed!');
        console.log('Note: 401 errors are expected without proper authentication.');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the tests
testTheaterEndpoints();

