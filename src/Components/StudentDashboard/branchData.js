// This file contains the academic data for different branches and years.

const subjects = {
  CSE: {
    '1': {
      semesters: [
        {
          sem: 1,
          subjects: [
            { id: 'math1', name: 'Engineering Mathematics I', code: 'BS-M101' },
            { id: 'physics', name: 'Engineering Physics', code: 'BS-PH101' },
            { id: 'bee', name: 'Basic Electrical Engineering', code: 'ES-EE101' },
            { id: 'pps', name: 'Programming for Problem Solving (C)', code: 'ES-CS101' },
          ]
        },
        {
          sem: 2,
          subjects: [
            { id: 'math2', name: 'Engineering Mathematics II', code: 'BS-M201' },
            { id: 'chemistry', name: 'Engineering Chemistry', code: 'BS-CH201' },
            { id: 'ds', name: 'Data Structures', code: 'PC-CS201' },
            { id: 'oop_cpp', name: 'Object-Oriented Programming (C++)', code: 'ES-CS202' },
          ]
        }
      ]
    },
    '2': {
      semesters: [
        {
          sem: 3,
          subjects: [
            { id: 'math3', name: 'Engineering Mathematics III', code: 'BS-M301' },
            { id: 'dld', name: 'Digital Logic Design', code: 'PC-CS301' },
            { id: 'coa', name: 'Computer Organization & Architecture', code: 'PC-CS302' },
            { id: 'os', name: 'Operating Systems', code: 'PC-CS303' },
          ]
        },
        {
          sem: 4,
          subjects: [
            { id: 'toc', name: 'Theory of Computation', code: 'PC-CS401' },
            { id: 'daa', name: 'Design & Analysis of Algorithms', code: 'PC-CS402' },
            { id: 'dbms', name: 'Database Management Systems', code: 'PC-CS403' },
            { id: 'se', name: 'Software Engineering', code: 'PC-CS404' },
          ]
        }
      ]
    },
    '3': {
      semesters: [
        {
          sem: 5,
          subjects: [
              { id: 'cn', name: 'Computer Networks', code: 'PC-CS501' },
              { id: 'cd', name: 'Compiler Design', code: 'PC-CS502' },
              { id: 'ai', name: 'Artificial Intelligence', code: 'PC-CS503' },
              { id: 'wt', name: 'Web Technologies', code: 'PE-CS501' },
          ]
        },
        {
          sem: 6,
          subjects: [
              { id: 'ml', name: 'Machine Learning', code: 'PC-CS601' },
              { id: 'cc', name: 'Cloud Computing', code: 'PC-CS602' },
              { id: 'dmw', name: 'Data Mining & Warehousing', code: 'PE-CS601' },
              { id: 'iot', name: 'Internet of Things (IoT)', code: 'OE-CS601' },
          ]
        }
      ]
    },
    '4': {
      semesters: [
        {
          sem: 7,
          subjects: [
              { id: 'dsys', name: 'Distributed Systems', code: 'PC-CS701' },
              { id: 'is', name: 'Information Security', code: 'PC-CS702' },
              { id: 'mad', name: 'Mobile Application Development', code: 'PE-CS701' },
              { id: 'dl', name: 'Deep Learning', code: 'PE-CS702' },
          ]
        },
        {
          sem: 8,
          subjects: [
              { id: 'project2', name: 'Project Work Phase II', code: 'PROJ-CS801' },
              { id: 'internship', name: 'Industrial Training / Internship', code: 'PROJ-CS802' },
              { id: 'elective3', name: 'Professional Elective III', code: 'PE-CS801' },
              { id: 'elective4', name: 'Professional Elective IV', code: 'PE-CS802' },
          ]
        }
      ]
    }
  },
  IT: {
    // Similar structure for IT branch
    '1': {
      semesters: [
        { sem: 1, subjects: [
          { id: 'math1', name: 'Engineering Mathematics I', code: 'BS-M101' },
          { id: 'physics', name: 'Engineering Physics', code: 'BS-PH101' },
          { id: 'cprog', name: 'C Programming', code: 'ES-CS101' },
        ]},
        { sem: 2, subjects: [
          { id: 'math2', name: 'Engineering Mathematics II', code: 'BS-M201' },
          { id: 'ds', name: 'Data Structures', code: 'PC-IT201' },
          { id: 'dld', name: 'Digital Logic Design', code: 'ES-EC201' },
        ]}
      ]
    },
    // Add other years for IT
  },
  AIML: {
    // Similar structure for AIML branch
    '1': {
      semesters: [
        { sem: 1, subjects: [
            { id: 'math1', name: 'Mathematics I', code: 'BS-M101' },
            { id: 'cprog', name: 'Programming for Problem Solving (C)', code: 'ES-CS101' },
        ]},
        { sem: 2, subjects: [
            { id: 'math2', name: 'Mathematics II', code: 'BS-M201' },
            { id: 'ds', name: 'Data Structures', code: 'PC-AI201' },
        ]}
      ]
    },
     // Add other years for AIML
  },
  ECE: {
    '1': {
      semesters: [
        { sem: 1, subjects: [
          { id: 'math1', name: 'Engineering Mathematics I', code: 'BS-M101' },
          { id: 'physics', name: 'Engineering Physics', code: 'BS-PH101' },
          { id: 'bee', name: 'Basic Electrical Engineering', code: 'ES-EE101' },
        ]},
        { sem: 2, subjects: [
          { id: 'math2', name: 'Engineering Mathematics II', code: 'BS-M201' },
          { id: 'chemistry', name: 'Engineering Chemistry', code: 'BS-CH201' },
          { id: 'bex', name: 'Basic Electronics Engineering', code: 'ES-EC201' },
        ]}
      ]
    },
    '2': {
      semesters: [
        { sem: 3, subjects: [
            { id: 'nt', name: 'Network Theory', code: 'PC-EC301' },
            { id: 'edc', name: 'Electronic Devices & Circuits', code: 'PC-EC302' },
            { id: 'ss', name: 'Signals & Systems', code: 'PC-EC303' },
        ]},
        { sem: 4, subjects: [
            { id: 'ac', name: 'Analog Circuits', code: 'PC-EC401' },
            { id: 'ef', name: 'Electromagnetic Fields', code: 'PC-EC402' },
            { id: 'mpmc', name: 'Microprocessors & Microcontrollers', code: 'PC-EC403' },
        ]}
      ]
    },
    // Add 3rd and 4th year for ECE
  },
  EEE: {
    '1': {
      semesters: [
        { sem: 1, subjects: [
            { id: 'math1', name: 'Engineering Mathematics I', code: 'BS-M101' },
            { id: 'physics', name: 'Engineering Physics', code: 'BS-PH101' },
        ]},
        { sem: 2, subjects: [
            { id: 'math2', name: 'Engineering Mathematics II', code: 'BS-M201' },
            { id: 'cprog', name: 'C Programming', code: 'ES-CS201' },
        ]}
      ]
    },
    // Add other years for EEE
  },
  MECH: {
    '1': {
      semesters: [
        { sem: 1, subjects: [
            { id: 'math1', name: 'Engineering Mathematics I', code: 'BS-M101' },
            { id: 'physics', name: 'Engineering Physics', code: 'BS-PH101' },
            { id: 'em', name: 'Engineering Mechanics', code: 'ES-ME101' },
        ]},
        { sem: 2, subjects: [
            { id: 'math2', name: 'Engineering Mathematics II', code: 'BS-M201' },
            { id: 'thermo', name: 'Thermodynamics', code: 'PC-ME201' },
        ]}
      ]
    },
    // Add other years for MECH
  },
  CIVIL: {
    '1': {
      semesters: [
        { sem: 1, subjects: [
            { id: 'math1', name: 'Engineering Mathematics I', code: 'BS-M101' },
            { id: 'physics', name: 'Engineering Physics', code: 'BS-PH101' },
            { id: 'em', name: 'Engineering Mechanics', code: 'ES-CE101' },
        ]},
        { sem: 2, subjects: [
            { id: 'math2', name: 'Engineering Mathematics II', code: 'BS-M201' },
            { id: 'som', name: 'Strength of Materials', code: 'PC-CE201' },
        ]}
      ]
    },
    // Add other years for CIVIL
  }
};

const advancedCoursesData = {
    CSE: [
        { id: 'dsa', name: 'Data Structures & Algorithms', description: 'Master fundamental data structures and algorithms.', icon: '🧠' },
        { id: 'python', name: 'Python Programming', description: 'From basics to advanced concepts in Python.', icon: '🐍' },
        { id: 'java', name: 'Java Full Stack', description: 'Build end-to-end applications with Java and Spring.', icon: '☕' },
        { id: 'web', name: 'Full Stack Web Dev (MERN)', description: 'MongoDB, Express, React, Node.js.', icon: '🌐' },
        { id: 'php', name: 'PHP & MySQL', description: 'Server-side scripting for web development.', icon: '🐘' },
    ],
    IT: [
        { id: 'dsa', name: 'Data Structures & Algorithms', description: 'Master fundamental data structures and algorithms.', icon: '🧠' },
        { id: 'python', name: 'Python for IT', description: 'Learn Python for automation, scripting, and data analysis.', icon: '🐍' },
        { id: 'web', name: 'Full Stack Web Dev (MERN)', description: 'MongoDB, Express, React, Node.js.', icon: '🌐' },
    ],
    AIML: [
        { id: 'dsa', name: 'Data Structures for AI/ML', description: 'Essential data structures for AI applications.', icon: '🧠' },
        { id: 'python_ml', name: 'Python for Machine Learning', description: 'Libraries like NumPy, Pandas, Scikit-learn.', icon: '🐍' },
        { id: 'dl_tf', name: 'Deep Learning with TensorFlow', description: 'Build and train neural networks.', icon: '🤖' },
    ]
};

const generateModulesForSubject = (subjectId) => {
    // Special case for Computer Networks
    if (subjectId === 'cn') {
        return [
            {
                id: 'cn-m1',
                name: 'Module 1: Introduction to Computer Networks',
                units: [
                    {
                        id: 'cn-u1',
                        name: 'Unit 1: Network Fundamentals',
                        topics: [
                            { id: 'cn-t1', name: '1.1: Network Topologies and Types' },
                            { id: 'cn-t2', name: '1.2: OSI and TCP/IP Models' },
                            { id: 'cn-t3', name: '1.3: Network Devices and Components' }
                        ]
                    },
                    {
                        id: 'cn-u2',
                        name: 'Unit 2: Physical Layer',
                        topics: [
                            { id: 'cn-t4', name: '2.1: Transmission Media' },
                            { id: 'cn-t5', name: '2.2: Multiplexing Techniques' },
                            { id: 'cn-t6', name: '2.3: Switching Techniques' }
                        ]
                    }
                ]
            },
            {
                id: 'cn-m2',
                name: 'Module 2: Data Link Layer',
                units: [
                    {
                        id: 'cn-u3',
                        name: 'Unit 3: Error Control & Flow Control',
                        topics: [
                            { id: 'cn-t7', name: '3.1: Error Detection & Correction' },
                            { id: 'cn-t8', name: '3.2: Flow Control Protocols' },
                            { id: 'cn-t9', name: '3.3: HDLC and PPP' }
                        ]
                    },
                    {
                        id: 'cn-u4',
                        name: 'Unit 4: Multiple Access',
                        topics: [
                            { id: 'cn-t10', name: '4.1: ALOHA, CSMA/CD, CSMA/CA' },
                            { id: 'cn-t11', name: '4.2: Ethernet and Wireless LANs' },
                            { id: 'cn-t12', name: '4.3: Switching and VLANs' }
                        ]
                    }
                ]
            },
            {
                id: 'cn-m3',
                name: 'Module 3: Network Layer',
                units: [
                    {
                        id: 'cn-u5',
                        name: 'Unit 5: IP Addressing',
                        topics: [
                            { id: 'cn-t13', name: '5.1: IPv4 and IPv6 Addressing' },
                            { id: 'cn-t14', name: '5.2: Subnetting and Supernetting' },
                            { id: 'cn-t15', name: '5.3: ICMP and ARP' }
                        ]
                    },
                    {
                        id: 'cn-u6',
                        name: 'Unit 6: Routing',
                        topics: [
                            { id: 'cn-t16', name: '6.1: Routing Algorithms' },
                            { id: 'cn-t17', name: '6.2: RIP, OSPF, BGP' },
                            { id: 'cn-t18', name: '6.3: Multicast Routing' }
                        ]
                    }
                ]
            },
            {
                id: 'cn-m4',
                name: 'Module 4: Transport Layer',
                units: [
                    {
                        id: 'cn-u7',
                        name: 'Unit 7: TCP and UDP',
                        topics: [
                            { id: 'cn-t19', name: '7.1: TCP Features and Header' },
                            { id: 'cn-t20', name: '7.2: TCP Connection Management' },
                            { id: 'cn-t21', name: '7.3: UDP and Comparison' }
                        ]
                    },
                    {
                        id: 'cn-u8',
                        name: 'Unit 8: Congestion Control',
                        topics: [
                            { id: 'cn-t22', name: '8.1: Congestion Control Algorithms' },
                            { id: 'cn-t23', name: '8.2: QoS in Networks' },
                            { id: 'cn-t24', name: '8.3: Network Performance' }
                        ]
                    }
                ]
            },
            {
                id: 'cn-m5',
                name: 'Module 5: Application Layer',
                units: [
                    {
                        id: 'cn-u9',
                        name: 'Unit 9: Network Applications',
                        topics: [
                            { id: 'cn-t25', name: '9.1: DNS and Email' },
                            { id: 'cn-t26', name: '9.2: FTP and HTTP/HTTPS' },
                            { id: 'cn-t27', name: '9.3: Network Security Basics' }
                        ]
                    },
                    {
                        id: 'cn-u10',
                        name: 'Unit 10: Emerging Technologies',
                        topics: [
                            { id: 'cn-t28', name: '10.1: Cloud Computing' },
                            { id: 'cn-t29', name: '10.2: IoT and 5G Networks' },
                            { id: 'cn-t30', name: '10.3: Network Virtualization' }
                        ]
                    }
                ]
            }
        ];
    }

    // Default template for other subjects
    return [
        {
            id: `${subjectId}-m1`,
            name: 'Module 1: Introduction and Basics',
            units: [
                {
                    id: `${subjectId}-u1`,
                    name: 'Unit 1: Fundamentals',
                    topics: [
                        { id: `${subjectId}-t1`, name: 'Topic 1.1: Core Concepts' },
                        { id: `${subjectId}-t2`, name: 'Topic 1.2: Historical Context' }
                    ]
                },
                {
                    id: `${subjectId}-u2`,
                    name: 'Unit 2: Getting Started',
                    topics: [
                        { id: `${subjectId}-t3`, name: 'Topic 2.1: Setup and Environment' },
                        { id: `${subjectId}-t4`, name: 'Topic 2.2: First Program' }
                    ]
                }
            ]
        },
        {
            id: `${subjectId}-m2`,
            name: 'Module 2: Advanced Topics',
            units: [
                {
                    id: `${subjectId}-u3`,
                    name: 'Unit 3: Core Mechanics',
                    topics: [
                        { id: `${subjectId}-t5`, name: 'Topic 3.1: Advanced Techniques' },
                        { id: `${subjectId}-t6`, name: 'Topic 3.2: Case Studies' }
                    ]
                },
                {
                    id: `${subjectId}-u4`,
                    name: 'Unit 4: Applications',
                    topics: [
                        { id: `${subjectId}-t7`, name: 'Topic 4.1: Real-world Applications' },
                        { id: `${subjectId}-t8`, name: 'Topic 4.2: Future Trends' }
                    ]
                }
            ]
        }
    ];
};

const generateMaterialsForSubject = (subjectId) => {
    // Special case for Computer Networks
    if (subjectId === 'cn') {
        return {
            notes: [
                // Module 1 Notes
                { id: 'cn-n1', name: 'CN - Module 1: Network Fundamentals', type: 'pdf', url: '#', size: '3.2 MB', module: 1 },
                { id: 'cn-n2', name: 'CN - Physical Layer Notes', type: 'pdf', url: '#', size: '2.8 MB', module: 1 },
                // Module 2 Notes
                { id: 'cn-n3', name: 'CN - Data Link Layer Complete Guide', type: 'pdf', url: '#', size: '4.1 MB', module: 2 },
                { id: 'cn-n4', name: 'CN - MAC Protocols Summary', type: 'pdf', url: '#', size: '1.9 MB', module: 2 },
                // Module 3 Notes
                { id: 'cn-n5', name: 'CN - Network Layer Deep Dive', type: 'pdf', url: '#', size: '3.7 MB', module: 3 },
                { id: 'cn-n6', name: 'CN - IP Addressing & Subnetting', type: 'pdf', url: '#', size: '2.5 MB', module: 3 },
                // Module 4 Notes
                { id: 'cn-n7', name: 'CN - Transport Layer Protocols', type: 'pdf', url: '#', size: '3.0 MB', module: 4 },
                { id: 'cn-n8', name: 'CN - TCP/IP Complete Reference', type: 'pdf', url: '#', size: '3.5 MB', module: 4 },
                // Module 5 Notes
                { id: 'cn-n9', name: 'CN - Application Layer Protocols', type: 'pdf', url: '#', size: '2.9 MB', module: 5 },
                { id: 'cn-n10', name: 'CN - Network Security Basics', type: 'pdf', url: '#', size: '2.3 MB', module: 5 },
            ],
            videos: [
                // Module 1 Videos
                { id: 'cn-v1', name: 'Introduction to Computer Networks', type: 'video', url: '#', duration: '32:15', module: 1 },
                { id: 'cn-v2', name: 'OSI Model Explained', type: 'video', url: '#', duration: '24:45', module: 1 },
                // Module 2 Videos
                { id: 'cn-v3', name: 'Error Detection & Correction', type: 'video', url: '#', duration: '28:30', module: 2 },
                { id: 'cn-v4', name: 'CSMA/CD and Ethernet', type: 'video', url: '#', duration: '21:15', module: 2 },
                // Module 3 Videos
                { id: 'cn-v5', name: 'IP Addressing & Subnetting', type: 'video', url: '#', duration: '35:20', module: 3 },
                { id: 'cn-v6', name: 'Routing Algorithms (RIP, OSPF, BGP)', type: 'video', url: '#', duration: '42:10', module: 3 },
                // Module 4 Videos
                { id: 'cn-v7', name: 'TCP 3-Way Handshake', type: 'video', url: '#', duration: '18:30', module: 4 },
                { id: 'cn-v8', name: 'UDP vs TCP Comparison', type: 'video', url: '#', duration: '15:45', module: 4 },
                // Module 5 Videos
                { id: 'cn-v9', name: 'DNS and HTTP/HTTPS', type: 'video', url: '#', duration: '27:50', module: 5 },
                { id: 'cn-v10', name: 'Network Security Essentials', type: 'video', url: '#', duration: '31:20', module: 5 },
            ],
            modelPapers: [
                { id: 'cn-mp1', name: 'CN - Mid-Term Paper 2023', type: 'pdf', url: '#', size: '1.8 MB' },
                { id: 'cn-mp2', name: 'CN - Final Exam Paper 2023', type: 'pdf', url: '#', size: '2.1 MB' },
                { id: 'cn-mp3', name: 'CN - Important Questions Bank', type: 'pdf', url: '#', size: '1.5 MB' },
                { id: 'cn-mp4', name: 'CN - Previous Year Papers (5 Years)', type: 'zip', url: '#', size: '5.2 MB' },
            ],
            syllabus: [
                { id: 'cn-syl1', name: 'CN - Detailed Syllabus', type: 'pdf', url: '#', size: '780 KB' },
                { id: 'cn-syl2', name: 'CN - Reference Books List', type: 'pdf', url: '#', size: '450 KB' },
            ],
            external: [
                { id: 'cn-ext1', name: 'NPTEL - Computer Networks Course', type: 'link', url: 'https://nptel.ac.in/courses/106105174' },
                { id: 'cn-ext2', name: 'GeeksForGeeks - CN Articles', type: 'link', url: 'https://www.geeksforgeeks.org/computer-network-tutorials/' },
                { id: 'cn-ext3', name: 'Cisco Networking Academy', type: 'link', url: 'https://www.netacad.com/courses/networking' },
                { id: 'cn-ext4', name: 'Wireshark Tutorials', type: 'link', url: 'https://www.wireshark.org/docs/wsug_html/' },
            ]
        };
    }

    // Default materials for other subjects
    return {
        notes: [
            { id: 1, name: `${subjectId.toUpperCase()} - Module 1 Notes`, type: 'pdf', url: '#', size: '2.1 MB' },
            { id: 2, name: `${subjectId.toUpperCase()} - Module 2 Quick Reference`, type: 'pdf', url: '#', size: '800 KB' },
        ],
        videos: [
            { id: 1, name: `Introduction to ${subjectId.toUpperCase()}`, type: 'video', url: '#', duration: '12:30' },
            { id: 2, name: `Advanced ${subjectId.toUpperCase()} Concepts`, type: 'video', url: '#', duration: '25:00' },
        ],
        modelPapers: [
            { id: 1, name: 'Mid-Term Model Paper 1', type: 'pdf', url: '#', size: '1.2 MB' },
            { id: 2, name: 'Final Exam Model Paper', type: 'pdf', url: '#', size: '1.5 MB' },
        ],
        syllabus: [
            { id: 1, name: 'Official Syllabus Document', type: 'pdf', url: '#', size: '450 KB' },
        ],
        external: [
            { id: 1, name: 'NPTEL Course', type: 'link', url: '#' },
            { id: 2, name: 'GeeksForGeeks Resources', type: 'link', url: '#' },
        ]
    };
};


export const getYearData = (branch, year) => {
  const yearData = subjects[branch]?.[year];
  if (!yearData) return { semesters: [] };

  // Add modules and materials to each subject
  yearData.semesters.forEach(semester => {
    semester.subjects = semester.subjects.map(subject => ({
      ...subject,
      modules: generateModulesForSubject(subject.id),
      materials: generateMaterialsForSubject(subject.id)
    }));
  });
  return yearData;
};

export const getAdvancedCourses = (branch) => {
    return advancedCoursesData[branch] || [];
};