const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataDir = path.join(__dirname, '..', 'server', 'data');
const materialsFile = path.join(dataDir, 'materials.json');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(materialsFile)) fs.writeFileSync(materialsFile, JSON.stringify([], null, 2));

const branches = ['CSE', 'IT', 'AIML', 'ECE', 'EEE', 'MECH', 'CIVIL'];
const subjectsBySem = {
  1: ['Engineering Mathematics I', 'Engineering Physics', 'Basic Electrical Engineering', 'Programming for Problem Solving (C)'],
  2: ['Engineering Mathematics II', 'Engineering Chemistry', 'Data Structures', 'Object-Oriented Programming (C++)'],
  3: ['Engineering Mathematics III', 'Digital Logic Design', 'Computer Organization & Architecture', 'Operating Systems'],
  4: ['Theory of Computation', 'Design & Analysis of Algorithms', 'Database Management Systems', 'Software Engineering'],
  5: ['Computer Networks', 'Compiler Design', 'Artificial Intelligence', 'Web Technologies'],
  6: ['Machine Learning', 'Cloud Computing', 'Data Mining & Warehousing', 'Embedded Systems'],
  7: ['Distributed Systems', 'Information Security', 'Mobile Application Development', 'Professional Elective I'],
  8: ['Professional Elective III', 'Professional Elective IV', 'Industrial Training', 'Project Work']
};

function randChoice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function makeEntry(branch, year, subject, type, sem, extra = {}) {
  return {
    id: uuidv4(),
    title: `${subject} - ${type} (Sample)`,
    year: String(year),
    section: 'A',
    subject,
    type,
    module: extra.module || null,
    unit: extra.unit || null,
    branch,
    uploadedAt: new Date().toISOString(),
    filename: null,
    url: extra.url || `https://example.com/${encodeURIComponent(subject)}-${type}.pdf`,
    originalName: null,
    uploadedBy: 'seed-script',
    uploaderId: null,
    uploaderName: 'Seeder'
  };
}

const all = JSON.parse(fs.readFileSync(materialsFile, 'utf8') || '[]');

// create a set of sample materials for first 3 years for each branch
for (let year = 1; year <= 4; year++) {
  for (const branch of branches) {
    // pick 2 semesters per year mapping: year1->sem1-2, year2->3-4, etc.
    const sem1 = (year - 1) * 2 + 1;
    const sem2 = sem1 + 1;
    [sem1, sem2].forEach(sem => {
      const subjects = subjectsBySem[sem] || ['General Subject'];
      // for each subject add 2-3 sample materials
      subjects.forEach((subj, idx) => {
        // add notes
        all.push(makeEntry(branch, year, subj, 'notes', sem, { module: String((idx % 2) + 1), unit: String((idx % 2) + 1) }));
        // add video
        all.push(makeEntry(branch, year, subj, 'videos', sem, { module: String((idx % 2) + 1) , url: `https://example.com/video/${encodeURIComponent(subj)}.mp4`}));
        // add model paper occasionally
        if (Math.random() > 0.6) {
          all.push(makeEntry(branch, year, subj, 'modelPapers', sem, {}));
        }
      });
    });
  }
}

// remove duplicates by title/url
const byUrl = new Map();
const deduped = all.filter(item => {
  if (!item.url) return true;
  if (byUrl.has(item.url)) return false;
  byUrl.set(item.url, true);
  return true;
});

fs.writeFileSync(materialsFile, JSON.stringify(deduped, null, 2));
console.log(`Seeded ${deduped.length} materials into ${materialsFile}`);
