import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ studentData, setIsAuthenticated, setStudentData }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notes');

  console.log('Dashboard Component - Student Data:', studentData); // Debug log

  const handleLogout = () => {
    setIsAuthenticated(false);
    setStudentData(null);
    navigate('/');
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  // Load admin-added content from localStorage
  const getAdminContent = () => {
    const savedContent = localStorage.getItem('adminContent');
    return savedContent ? JSON.parse(savedContent) : {
      '1': { notes: [], videos: [], subjects: [], syllabus: [], previousQuestions: [] },
      '2': { notes: [], videos: [], subjects: [], syllabus: [], previousQuestions: [] },
      '3': { notes: [], videos: [], subjects: [], syllabus: [], previousQuestions: [] },
      '4': { notes: [], videos: [], subjects: [], syllabus: [], previousQuestions: [] }
    };
  };

  // Load faculty-added content from localStorage
  const getFacultyContent = (year, section) => {
    const savedContent = localStorage.getItem('courseMaterials');
    if (!savedContent) return { notes: [], videos: [], files: [], previousQuestions: [] };
    
    const courseMaterials = JSON.parse(savedContent);
    return courseMaterials[year]?.[section] || { notes: [], videos: [], files: [], previousQuestions: [] };
  };

  // Year-wise content configuration
  const getYearContent = (year, section) => {
    const adminContent = getAdminContent();
    const facultyContent = getFacultyContent(year, section);
    
    const yearContent = {
      '1': {
        yearName: '1st Year',
        subjects: ['Mathematics-I', 'Physics', 'Chemistry', 'English', 'Programming in C', 'Engineering Drawing', ...adminContent['1'].subjects.map(s => s.subject)],
        semesters: ['Semester 1', 'Semester 2'],
        previousQuestions: [
          { title: 'Mathematics-I Mid Term Exam', examYear: '2023', subject: 'Mathematics-I', type: 'Mid Term', semester: 'Semester 1', url: '#', solutionUrl: '#' },
          { title: 'Physics Final Exam', examYear: '2023', subject: 'Physics', type: 'Final Exam', semester: 'Semester 1', url: '#' },
          { title: 'Chemistry Mid Term Exam', examYear: '2022', subject: 'Chemistry', type: 'Mid Term', semester: 'Semester 2', url: '#', solutionUrl: '#' },
          { title: 'Programming in C Final Exam', examYear: '2023', subject: 'Programming in C', type: 'Final Exam', semester: 'Semester 2', url: '#' },
          { title: 'English Communication Test', examYear: '2022', subject: 'English', type: 'Unit Test', semester: 'Semester 1', url: '#' },
          ...adminContent['1'].previousQuestions || [], ...facultyContent.previousQuestions
        ],
        notes: [
          { title: 'Calculus and Differential Equations', subject: 'Mathematics-I', semester: 'Semester 1', size: '2.5 MB' },
          { title: 'Mechanics and Thermodynamics', subject: 'Physics', semester: 'Semester 1', size: '3.2 MB' },
          { title: 'Organic Chemistry Basics', subject: 'Chemistry', semester: 'Semester 2', size: '1.8 MB' },
          { title: 'C Programming Fundamentals', subject: 'Programming in C', semester: 'Semester 2', size: '4.1 MB' },
          { title: 'Technical English', subject: 'English', semester: 'Semester 1', size: '1.2 MB' },
          ...adminContent['1'].notes, ...facultyContent.notes
        ],
        videos: [
          { title: 'Introduction to Calculus', subject: 'Mathematics-I', duration: '45 min', views: '1.2K' },
          { title: 'Physics Lab Experiments', subject: 'Physics', duration: '30 min', views: '856' },
          { title: 'C Programming Tutorial Series', subject: 'Programming in C', duration: '60 min', views: '2.1K' },
          { title: 'Chemistry Practical Demo', subject: 'Chemistry', duration: '25 min', views: '743' },
          ...adminContent['1'].videos, ...facultyContent.videos
        ]
      },
      '2': {
        yearName: '2nd Year',
        subjects: ['Mathematics-II', 'Data Structures', 'Digital Logic Design', 'Object Oriented Programming', 'Database Management', ...adminContent['2'].subjects.map(s => s.subject)],
        semesters: ['Semester 3', 'Semester 4'],
        previousQuestions: [
          { title: 'Data Structures Final Exam', examYear: '2023', subject: 'Data Structures', type: 'Final Exam', semester: 'Semester 3', url: '#', solutionUrl: '#' },
          { title: 'Digital Logic Design Mid Term', examYear: '2023', subject: 'Digital Logic Design', type: 'Mid Term', semester: 'Semester 3', url: '#' },
          { title: 'OOP Final Exam', examYear: '2022', subject: 'Object Oriented Programming', type: 'Final Exam', semester: 'Semester 4', url: '#', solutionUrl: '#' },
          { title: 'Database Management Quiz', examYear: '2023', subject: 'Database Management', type: 'Quiz', semester: 'Semester 4', url: '#' },
          { title: 'Mathematics-II Internal Assessment', examYear: '2022', subject: 'Mathematics-II', type: 'Internal', semester: 'Semester 3', url: '#' },
          ...adminContent['2'].previousQuestions || [], ...facultyContent.previousQuestions
        ],
        notes: [
          { title: 'Advanced Mathematics', subject: 'Mathematics-II', semester: 'Semester 3', size: '3.1 MB' },
          { title: 'Arrays and Linked Lists', subject: 'Data Structures', semester: 'Semester 3', size: '2.8 MB' },
          { title: 'Boolean Algebra and Logic Gates', subject: 'Digital Logic Design', semester: 'Semester 3', size: '2.2 MB' },
          { title: 'Java OOP Concepts', subject: 'Object Oriented Programming', semester: 'Semester 4', size: '3.5 MB' },
          { title: 'SQL and Database Design', subject: 'Database Management', semester: 'Semester 4', size: '2.9 MB' },
          ...adminContent['2'].notes, ...facultyContent.notes
        ],
        videos: [
          { title: 'Data Structures Implementation', subject: 'Data Structures', duration: '50 min', views: '1.8K' },
          { title: 'Digital Circuit Design', subject: 'Digital Logic Design', duration: '40 min', views: '1.1K' },
          { title: 'Java Programming Masterclass', subject: 'Object Oriented Programming', duration: '75 min', views: '2.5K' },
          { title: 'Database Design Principles', subject: 'Database Management', duration: '55 min', views: '1.4K' },
          ...adminContent['2'].videos, ...facultyContent.videos
        ]
      },
      '3': {
        yearName: '3rd Year',
        subjects: ['Computer Networks', 'Data Mining Techniques', 'Compiler Design', 'AI Web Technology', 'IPD', 'ADS', ...adminContent['3'].subjects.map(s => s.subject)],
        semesters: ['Semester 5', 'Semester 6'],
        previousQuestions: [
          { title: 'Computer Networks Final Exam', examYear: '2023', subject: 'Computer Networks', type: 'Final Exam', semester: 'Semester 5', url: '#', solutionUrl: '#' },
          { title: 'Data Mining Mid Term', examYear: '2023', subject: 'Data Mining Techniques', type: 'Mid Term', semester: 'Semester 5', url: '#' },
          { title: 'Compiler Design Final Exam', examYear: '2022', subject: 'Compiler Design', type: 'Final Exam', semester: 'Semester 6', url: '#', solutionUrl: '#' },
          { title: 'AI Web Technology Project Exam', examYear: '2023', subject: 'AI Web Technology', type: 'Project Exam', semester: 'Semester 6', url: '#' },
          { title: 'IPD Internal Assessment', examYear: '2022', subject: 'IPD', type: 'Internal', semester: 'Semester 5', url: '#' },
          { title: 'ADS Final Exam', examYear: '2023', subject: 'ADS', type: 'Final Exam', semester: 'Semester 6', url: '#', solutionUrl: '#' },
          ...adminContent['3'].previousQuestions || [], ...facultyContent.previousQuestions
        ],
        notes: [
          { title: 'Network Protocols and Architecture', subject: 'Computer Networks', semester: 'Semester 5', size: '4.2 MB' },
          { title: 'Data Mining Algorithms and Techniques', subject: 'Data Mining Techniques', semester: 'Semester 5', size: '3.8 MB' },
          { title: 'Lexical Analysis and Parsing', subject: 'Compiler Design', semester: 'Semester 6', size: '3.1 MB' },
          { title: 'AI-Powered Web Applications', subject: 'AI Web Technology', semester: 'Semester 6', size: '5.2 MB' },
          { title: 'Integrated Product Development', subject: 'IPD', semester: 'Semester 5', size: '2.7 MB' },
          { title: 'Advanced Data Structures', subject: 'ADS', semester: 'Semester 6', size: '4.1 MB' },
          ...adminContent['3'].notes, ...facultyContent.notes
        ],
        videos: [
          { title: 'TCP/IP Protocol Deep Dive', subject: 'Computer Networks', duration: '65 min', views: '2.3K', url: 'https://youtu.be/UdxiqHt-DCg?si=IdSU_gmizhAC780-' },
          { title: 'Data Mining with Python', subject: 'Data Mining Techniques', duration: '75 min', views: '1.9K', url: 'https://youtu.be/xEmrFePGjEg?si=QethB5XxqUNvhIUS' },
          { title: 'Compiler Construction Fundamentals', subject: 'Compiler Design', duration: '80 min', views: '1.5K', url: 'https://youtu.be/4mAxMWz8p6g?si=JRaLHHSl-xNjIixB' },
          { title: 'AI Integration in Web Development', subject: 'AI Web Technology', duration: '90 min', views: '3.2K', url: 'https://youtu.be/QpCsL7oEles?si=4EnjY6A4ekiNyMKw' },
          { title: 'Web Technology Fundamentals', subject: 'Web Technology', duration: '85 min', views: '2.7K', url: 'https://youtu.be/JsbxB2l7QGY?si=0-EgJl0C_Ja1PqIU' },
          { title: 'Product Development Lifecycle', subject: 'IPD', duration: '55 min', views: '1.6K' },
          { title: 'Advanced Trees and Graphs', subject: 'ADS', duration: '70 min', views: '2.1K' },
          ...adminContent['3'].videos, ...facultyContent.videos
        ]
      },
      '4': {
        yearName: '4th Year',
        subjects: ['Machine Learning', 'Cloud Computing', 'Cyber Security', 'Project Management', 'Advanced Database Systems', ...adminContent['4'].subjects.map(s => s.subject)],
        semesters: ['Semester 7', 'Semester 8'],
        previousQuestions: [
          { title: 'Machine Learning Final Exam', examYear: '2023', subject: 'Machine Learning', type: 'Final Exam', semester: 'Semester 7', url: '#', solutionUrl: '#' },
          { title: 'Cloud Computing Mid Term', examYear: '2023', subject: 'Cloud Computing', type: 'Mid Term', semester: 'Semester 7', url: '#' },
          { title: 'Cyber Security Final Exam', examYear: '2022', subject: 'Cyber Security', type: 'Final Exam', semester: 'Semester 8', url: '#', solutionUrl: '#' },
          { title: 'Project Management Case Study', examYear: '2023', subject: 'Project Management', type: 'Case Study', semester: 'Semester 8', url: '#' },
          { title: 'Advanced Database Systems Final', examYear: '2022', subject: 'Advanced Database Systems', type: 'Final Exam', semester: 'Semester 7', url: '#', solutionUrl: '#' },
          ...adminContent['4'].previousQuestions || [], ...facultyContent.previousQuestions
        ],
        notes: [
          { title: 'ML Algorithms and Applications', subject: 'Machine Learning', semester: 'Semester 7', size: '6.1 MB' },
          { title: 'AWS Cloud Architecture', subject: 'Cloud Computing', semester: 'Semester 7', size: '4.8 MB' },
          { title: 'Network Security Protocols', subject: 'Cyber Security', semester: 'Semester 8', size: '3.9 MB' },
          { title: 'Agile Project Management', subject: 'Project Management', semester: 'Semester 8', size: '2.4 MB' },
          { title: 'NoSQL and Big Data', subject: 'Advanced Database Systems', semester: 'Semester 7', size: '5.3 MB' },
          ...adminContent['4'].notes, ...facultyContent.notes
        ],
        videos: [
          { title: 'Deep Learning Fundamentals', subject: 'Machine Learning', duration: '95 min', views: '4.1K' },
          { title: 'Docker and Kubernetes', subject: 'Cloud Computing', duration: '85 min', views: '3.5K' },
          { title: 'Ethical Hacking Basics', subject: 'Cyber Security', duration: '70 min', views: '2.8K' },
          { title: 'Scrum and Kanban Methods', subject: 'Project Management', duration: '60 min', views: '2.2K' },
          { title: 'MongoDB and Cassandra', subject: 'Advanced Database Systems', duration: '75 min', views: '1.9K' },
          ...adminContent['4'].videos, ...facultyContent.videos
        ]
      }
    };
    return yearContent[year] || yearContent['1'];
  };

  const currentYearContent = getYearContent(studentData?.year, studentData?.section);

  const renderContent = () => {
    const adminContent = getAdminContent(); // Add this line to fix the error
    
    switch (activeTab) {
      case 'notes':
        return (
          <div className="content-grid">
            {currentYearContent.notes.map((note, index) => (
              <div key={index} className="content-card">
                <div className="card-header">
                  <h3>{note.title}</h3>
                  <span className="semester-tag">{note.semester}</span>
                </div>
                <p className="subject-name">{note.subject}</p>
                <div className="note-info">
                  <span className="file-size">📄 {note.size}</span>
                </div>
                <button className="download-btn" onClick={() => alert(`Downloading: ${note.title}`)}>
                  📥 Download PDF
                </button>
              </div>
            ))}
          </div>
        );
      
      case 'videos':
        // Group videos by subject
        const videosBySubject = currentYearContent.videos.reduce((acc, video) => {
          if (!acc[video.subject]) {
            acc[video.subject] = [];
          }
          acc[video.subject].push(video);
          return acc;
        }, {});

        return (
          <div className="video-playlists-container">
            {Object.entries(videosBySubject).map(([subject, videos]) => (
              <div key={subject} className="playlist-card">
                <div className="playlist-header">
                  <div className="playlist-info">
                    <h3 className="playlist-title">📚 {subject}</h3>
                    <p className="playlist-stats">
                      {videos.length} videos • {videos.reduce((total, video) => {
                        const duration = parseInt(video.duration);
                        return total + (isNaN(duration) ? 45 : duration);
                      }, 0)} min total
                    </p>
                  </div>
                  <div className="playlist-thumbnail">
                    <div className="playlist-icon">🎥</div>
                    <span className="video-count">{videos.length}</span>
                  </div>
                </div>
                
                <div className="playlist-videos">
                  {videos.map((video, index) => (
                    <div key={index} className="playlist-video-item">
                      <div className="video-index">{index + 1}</div>
                      <div className="video-thumbnail-small">
                        <div className="play-icon-small">▶</div>
                      </div>
                      <div className="video-details">
                        <h4 className="video-title">{video.title}</h4>
                        <div className="video-meta">
                          <span className="video-duration">⏱ {video.duration}</span>
                          <span className="video-views">👁 {video.views} views</span>
                        </div>
                      </div>
                      <button 
                        className="play-video-btn"
                        onClick={() => {
                          if (video.url) {
                            window.open(video.url, '_blank');
                          } else {
                            alert(`Playing: ${video.title}`);
                          }
                        }}
                      >
                        ▶ Play
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="playlist-actions">
                  <button 
                    className="play-all-btn"
                    onClick={() => {
                      const firstVideoWithUrl = videos.find(v => v.url);
                      if (firstVideoWithUrl) {
                        window.open(firstVideoWithUrl.url, '_blank');
                      } else {
                        alert(`Playing all videos from ${subject} playlist`);
                      }
                    }}
                  >
                    ▶ Play All
                  </button>
                  <button 
                    className="shuffle-btn"
                    onClick={() => alert(`Shuffling ${subject} playlist`)}
                  >
                    🔀 Shuffle
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'syllabus':
        return (
          <div className="syllabus-container">
            {currentYearContent.semesters.map((semester, index) => (
              <div key={index} className="semester-card">
                <h3>📚 {semester}</h3>
                <div className="subjects-list">
                  {currentYearContent.subjects.map((subject, subIndex) => (
                    <div key={subIndex} className="subject-item">
                      <span className="subject-code">
                        {studentData.branch}{studentData.year}0{subIndex + 1}
                      </span>
                      <span className="subject-name">{subject}</span>
                      <div className="subject-actions">
                        <button 
                          className="view-syllabus-btn"
                          onClick={() => alert(`Viewing syllabus for: ${subject}`)}
                        >
                          📋 View Syllabus
                        </button>
                        <button 
                          className="download-syllabus-btn"
                          onClick={() => alert(`Downloading syllabus for: ${subject}`)}
                        >
                          📥 Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'subjects':
        return (
          <div className="subjects-grid">
            {currentYearContent.subjects.map((subject, index) => (
              <div key={index} className="subject-card">
                <div className="subject-icon">📚</div>
                <h3>{subject}</h3>
                <div className="subject-stats">
                  <span>📊 Credits: {Math.floor(Math.random() * 3) + 3}</span>
                  <span>⏰ Hours: {Math.floor(Math.random() * 20) + 30}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress" style={{width: `${Math.floor(Math.random() * 100)}%`}}></div>
                </div>
                <div className="subject-actions">
                  <button 
                    className="action-btn notes-btn"
                    onClick={() => {
                      setActiveTab('notes');
                      alert(`Viewing notes for: ${subject}`);
                    }}
                  >
                    📝 Notes
                  </button>
                  <button 
                    className="action-btn videos-btn"
                    onClick={() => {
                      setActiveTab('videos');
                      alert(`Viewing videos for: ${subject}`);
                    }}
                  >
                    🎥 Videos
                  </button>
                  <button 
                    className="action-btn assignments-btn"
                    onClick={() => alert(`Viewing assignments for: ${subject}`)}
                  >
                    📋 Assignments
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'previousQuestions':
        const currentYear = studentData?.year || '1';
        const allQuestions = [
          ...currentYearContent.previousQuestions,
          ...(adminContent[currentYear]?.previousQuestions || []).map(q => ({
            title: q.title,
            examYear: q.examYear || 'N/A',
            subject: q.subject,
            type: q.examType || 'Exam',
            semester: q.semester,
            url: q.questionFileData || q.url || '#',
            solutionUrl: q.solutionFileData || q.solutionUrl,
            questionFileName: q.questionFileName,
            solutionFileName: q.solutionFileName,
            isFileUpload: !!(q.questionFileData || q.solutionFileData)
          }))
        ];

        return (
          <div className="previous-questions-grid">
            {allQuestions.map((question, index) => (
              <div key={index} className="previous-question-card">
                <div className="question-icon">📝</div>
                <h3>{question.title}</h3>
                <div className="question-stats">
                  <span>📆 Exam Year: {question.examYear}</span>
                  <span>📚 Subject: {question.subject}</span>
                  <span>📝 Type: {question.type}</span>
                </div>
                <div className="question-actions">
                  <button 
                    className="view-question-btn"
                    onClick={() => {
                      if (question.url && question.url !== '#') {
                        if (question.isFileUpload && question.url.startsWith('data:')) {
                          // Create a downloadable link for base64 file
                          const link = document.createElement('a');
                          link.href = question.url;
                          link.download = question.questionFileName || `${question.title}_question.pdf`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        } else {
                          window.open(question.url, '_blank');
                        }
                      } else {
                        alert(`Question paper for "${question.title}" is not available yet. Please contact your administrator.`);
                      }
                    }}
                  >
                    📄 View Question Paper
                  </button>
                  {question.solutionUrl && (
                    <button 
                      className="view-solution-btn"
                      onClick={() => {
                        if (question.solutionUrl && question.solutionUrl !== '#') {
                          if (question.isFileUpload && question.solutionUrl.startsWith('data:')) {
                            // Create a downloadable link for base64 file
                            const link = document.createElement('a');
                            link.href = question.solutionUrl;
                            link.download = question.solutionFileName || `${question.title}_solution.pdf`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          } else {
                            window.open(question.solutionUrl, '_blank');
                          }
                        } else {
                          alert(`Solution for "${question.title}" is not available yet.`);
                        }
                      }}
                    >
                      📝 View Solution
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  const getBranchFullName = (branch) => {
    const branches = {
      'CSE': 'Computer Science Engineering',
      'ECE': 'Electronics & Communication Engineering',
      'EEE': 'Electrical & Electronics Engineering',
      'MECH': 'Mechanical Engineering',
      'CIVIL': 'Civil Engineering'
    };
    return branches[branch] || branch;
  };


  const getTabTitle = (tab) => {
    const titles = {
      'notes': 'Study Notes',
      'videos': 'Video Lectures',
      'syllabus': 'Course Syllabus',
      'subjects': 'Subject Overview',
      'previousQuestions': 'Previous Questions'
    };
    return titles[tab] || 'Dashboard';
  };

  if (!studentData) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <button onClick={handleBackToHome} className="back-btn">
            ← Back to Home
          </button>
          <div className="profile-section">
            <div className="header-default-avatar">
              {studentData?.studentName?.charAt(0)}
            </div>
            <div className="profile-info">
              <h2>{studentData?.studentName}</h2>
              <p>
                {currentYearContent.yearName} - {getBranchFullName(studentData?.branch)} - Section {studentData?.section}
              </p>
              <span className="student-id">ID: {studentData?.sid}</span>
            </div>
          </div>
        </div>
        <div className="header-right">
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'notes' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('notes')}
        >
          📝 Notes ({currentYearContent.notes.length})
        </button>
        <button 
          className={activeTab === 'videos' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('videos')}
        >
          🎥 Videos ({currentYearContent.videos.length})
        </button>
        <button 
          className={activeTab === 'syllabus' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('syllabus')}
        >
          📋 Syllabus ({currentYearContent.semesters.length} Semesters)
        </button>
        <button 
          className={activeTab === 'subjects' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('subjects')}
        >
          📚 Subjects ({currentYearContent.subjects.length})
        </button>
        <button 
          className={activeTab === 'previousQuestions' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('previousQuestions')}
        >
          📝 Previous Questions ({currentYearContent.previousQuestions.length})
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="content-header">
          <h1>
            {getTabTitle(activeTab)} - {currentYearContent.yearName}
          </h1>
          <p className="content-description">
            Access your {currentYearContent.yearName} academic resources for {getBranchFullName(studentData?.branch)}
          </p>
        </div>
        <div className="content-body">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;