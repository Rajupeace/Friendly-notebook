async function testAnnouncement() {
  try {
    const response = await fetch('http://localhost:5000/api/announcements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': 'e7c95300-e225-41d0-9d3f-cebecd24834c'
      },
      body: JSON.stringify({
        message: 'Test announcement from API',
        target: 'all'
      })
    });
    const data = await response.json();
    console.log('Announcement result:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAnnouncement();
