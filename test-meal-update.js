const axios = require('axios');

// Test the meal update functionality
async function testMealUpdate() {
  try {
    console.log('Testing meal update functionality...');
    
    // First, let's test if the server is running
    const testResponse = await axios.get('http://localhost:5000/test');
    console.log('Server is running:', testResponse.data);
    
    // Test the meal generation endpoint
    const mealResponse = await axios.get('http://localhost:5000/test-meal');
    console.log('Meal generation test:', mealResponse.data);
    
    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testMealUpdate();
