async function testCourseCreation() {
  try {
    const response = await fetch('http://localhost:5000/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    console.log('Course creation test result:', data);
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testCourseCreation();
