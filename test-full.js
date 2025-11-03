async function testFullFlow() {
  try {
    // First login
    const loginResponse = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminId: 'ReddyFBN@1228', password: 'ReddyFBN' })
    });
    const loginData = await loginResponse.json();
    console.log('Login result:', loginData);

    if (loginData.token) {
      // Create announcement
      const response = await fetch('http://localhost:5000/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': loginData.token
        },
        body: JSON.stringify({
          message: 'Test announcement from API',
          target: 'all'
        })
      });
      const data = await response.json();
      console.log('Announcement result:', data);

      // Check messages
      const messagesResponse = await fetch('http://localhost:5000/api/messages');
      const messages = await messagesResponse.json();
      console.log('All messages:', messages);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testFullFlow();
