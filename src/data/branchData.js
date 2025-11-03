// Branch-wise and year-wise subject data
export const branchData = {
  // Common first year subjects (same for all branches)
  'common': {
    '1': [
      {
        id: 'math1',
        name: 'Mathematics-I',
        code: 'BSM101',
        type: 'theory',
        credits: 4,
        syllabus: '/syllabus/math1.pdf',
        materials: {
          notes: [
            { name: 'Module 1 - Calculus', url: '/materials/notes/math1/module1.pdf', type: 'pdf' },
            { name: 'Module 2 - Linear Algebra', url: '/materials/notes/math1/module2.pdf', type: 'pdf' }
          ],
          videos: [
            { name: 'Differential Calculus', url: 'https://youtube.com/xyz1', type: 'video' },
            { name: 'Integral Calculus', url: 'https://youtube.com/xyz2', type: 'video' }
          ],
          modelPapers: [
            { name: 'Dec 2023', url: '/materials/papers/math1/dec2023.pdf', type: 'pdf' },
            { name: 'May 2023', url: '/materials/papers/math1/may2023.pdf', type: 'pdf' }
          ]
        }
      },
      // Add other common first year subjects
    ],
    '2': [
      // Common second year subjects if any
    ]
  },
  
  // CSE Branch
  'CSE': {
    '1': [
      // Will inherit common first year subjects
    ],
    '2': [
      {
        id: 'dsa',
        name: 'Data Structures and Algorithms',
        code: 'BSCS201',
        type: 'theory',
        credits: 4,
        syllabus: '/syllabus/cse/dsa.pdf',
        materials: {
          notes: [
            { name: 'Module 1 - Arrays & Linked Lists', url: '/materials/notes/cse/dsa/module1.pdf', type: 'pdf' },
            { name: 'Module 2 - Trees and Graphs', url: '/materials/notes/cse/dsa/module2.pdf', type: 'pdf' }
          ],
          videos: [
            { name: 'Linked Lists Implementation', url: 'https://youtube.com/dsa1', type: 'video' },
            { name: 'Binary Trees', url: 'https://youtube.com/dsa2', type: 'video' }
          ]
        }
      },
      // Add more CSE subjects
    ]
  },
  
  // IT Branch
  'IT': {
    '1': [
      // Inherits common first year
    ],
    '2': [
      {
        id: 'dbms',
        name: 'Database Management Systems',
        code: 'BSIT201',
        type: 'theory',
        credits: 4,
        materials: {
          notes: [
            { name: 'SQL Basics', url: '/materials/notes/it/dbms/sql.pdf', type: 'pdf' },
            { name: 'Normalization', url: '/materials/notes/it/dbms/normalization.pdf', type: 'pdf' }
          ]
        }
      }
      // Add more IT subjects
    ]
  },
  
  // AIML Branch
  'AIML': {
    '1': [
      // Inherits common first year
    ],
    '3': [
      {
        id: 'ml',
        name: 'Machine Learning',
        code: 'BSAIML301',
        type: 'theory',
        credits: 4,
        materials: {
          notes: [
            { name: 'Supervised Learning', url: '/materials/notes/aiml/ml/supervised.pdf', type: 'pdf' },
            { name: 'Neural Networks', url: '/materials/notes/aiml/ml/nn.pdf', type: 'pdf' }
          ]
        }
      }
      // Add more AIML subjects
    ]
  },
  
  // ECE Branch
  'ECE': {
    '1': [
      // Inherits common first year
    ],
    '2': [
      {
        id: 'dsp',
        name: 'Digital Signal Processing',
        code: 'BSECE201',
        type: 'theory',
        credits: 4,
        materials: {
          notes: [
            { name: 'Signals and Systems', url: '/materials/notes/ece/dsp/signals.pdf', type: 'pdf' },
            { name: 'Fourier Transforms', url: '/materials/notes/ece/dsp/fourier.pdf', type: 'pdf' }
          ]
        }
      }
      // Add more ECE subjects
    ]
  },
  
  // EEE Branch
  'EEE': {
    '1': [
      // Inherits common first year
    ],
    '2': [
      {
        id: 'emf',
        name: 'Electromagnetic Fields',
        code: 'BSEEE201',
        type: 'theory',
        credits: 4,
        materials: {
          notes: [
            { name: 'Electrostatics', url: '/materials/notes/eee/emf/electrostatics.pdf', type: 'pdf' },
            { name: 'Magnetostatics', url: '/materials/notes/eee/emf/magnetostatics.pdf', type: 'pdf' }
          ]
        }
      }
      // Add more EEE subjects
    ]
  },
  
  // Mechanical Branch
  'MECH': {
    '1': [
      // Inherits common first year
    ],
    '2': [
      {
        id: 'thermo',
        name: 'Thermodynamics',
        code: 'BSMECH201',
        type: 'theory',
        credits: 4,
        materials: {
          notes: [
            { name: 'Laws of Thermodynamics', url: '/materials/notes/mech/thermo/laws.pdf', type: 'pdf' },
            { name: 'Thermodynamic Cycles', url: '/materials/notes/mech/thermo/cycles.pdf', type: 'pdf' }
          ]
        }
      }
      // Add more Mechanical subjects
    ]
  },
  
  // Civil Branch
  'CIVIL': {
    '1': [
      // Inherits common first year
    ],
    '2': [
      {
        id: 'som',
        name: 'Strength of Materials',
        code: 'BSCIV201',
        type: 'theory',
        credits: 4,
        materials: {
          notes: [
            { name: 'Stress and Strain', url: '/materials/notes/civil/som/stress_strain.pdf', type: 'pdf' },
            { name: 'Bending Moments', url: '/materials/notes/civil/som/bending.pdf', type: 'pdf' }
          ]
        }
      }
      // Add more Civil subjects
    ]
  }
};

// Advanced courses available for specific branches
export const advancedCourses = {
  'CSE': [
    {
      id: 'blockchain',
      name: 'Blockchain Technology',
      code: 'CSELECT01',
      type: 'elective',
      credits: 3,
      materials: {
        notes: [
          { name: 'Blockchain Basics', url: '/materials/advanced/cse/blockchain/basics.pdf', type: 'pdf' },
          { name: 'Smart Contracts', url: '/materials/advanced/cse/blockchain/smart_contracts.pdf', type: 'pdf' }
        ]
      }
    },
    // Add more CSE advanced courses
  ],
  'IT': [
    {
      id: 'cyber',
      name: 'Cyber Security',
      code: 'ITELECT01',
      type: 'elective',
      credits: 3,
      materials: {
        notes: [
          { name: 'Network Security', url: '/materials/advanced/it/cyber/network_security.pdf', type: 'pdf' }
        ]
      }
    }
    // Add more IT advanced courses
  ],
  'AIML': [
    {
      id: 'dl',
      name: 'Deep Learning',
      code: 'AIELECT01',
      type: 'elective',
      credits: 3,
      materials: {
        notes: [
          { name: 'Neural Networks', url: '/materials/advanced/aiml/dl/nn.pdf', type: 'pdf' },
          { name: 'CNN Architectures', url: '/materials/advanced/aiml/dl/cnn.pdf', type: 'pdf' }
        ]
      }
    }
    // Add more AIML advanced courses
  ]
};

// Function to get subjects for a specific branch and year
export const getBranchSubjects = (branch, year) => {
  const commonSubjects = branchData.common[year] || [];
  const branchSpecific = branchData[branch]?.[year] || [];
  return [...commonSubjects, ...branchSpecific];
};

// Function to get advanced courses for a branch
export const getAdvancedCourses = (branch) => {
  return advancedCourses[branch] || [];
};
