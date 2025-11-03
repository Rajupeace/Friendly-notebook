async function testAdminCourseCreation() {
  try {
    // First login as admin
    const loginResponse = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminId: 'ReddyFBN@1228', password: 'ReddyFBN' })
    });
    const loginData = await loginResponse.json();
    console.log('Admin login result:', loginData);

    if (loginData.token) {
      // Now create course with admin token
      const response = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': loginData.token
        },
        body: JSON.stringify({
          name: 'Computer Science 101',
          code: 'CS101',
          year: '1',
          semester: '1',
          branch: 'CSE',
          sections: ['A', 'B'],
          description: 'Introduction to Computer Science'
        })
      });
      const data = await response.json();
      console.log('Course creation result:', data);
    }
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testAdminCourseCreation();
