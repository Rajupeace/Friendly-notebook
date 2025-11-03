const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function createComputerNetworksCourse() {
    console.log('🚀 Starting Computer Networks course creation and notes upload...');

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });

    try {
        const page = await browser.newPage();

        // Login to admin dashboard
        console.log('🔐 Logging into admin dashboard...');
        await page.goto('http://localhost:3000');
        await page.waitForSelector('input[type="text"]');

        // Fill login form
        await page.type('input[type="text"]', 'ReddyFBN@1228');
        await page.type('input[type="password"]', 'ReddyFBN');
        await page.click('button[type="submit"]');

        // Wait for admin dashboard to load
        await page.waitForSelector('.admin-nav');
        console.log('✅ Logged in successfully');

        // Step 1: Create Computer Networks course
        console.log('📚 Creating Computer Networks course...');

        // Navigate to Courses tab
        await page.evaluate(() => {
            const buttons = document.querySelectorAll('.admin-nav button');
            buttons.forEach(btn => {
                if (btn.textContent.includes('Courses')) {
                    btn.click();
                }
            });
        });

        await page.waitForSelector('.form-grid');

        // Fill course creation form
        await page.evaluate(() => {
            // Fill form fields
            const inputs = document.querySelectorAll('.form-grid input, .form-grid select');

            // Course Name
            inputs[0].value = 'Computer Networks';
            inputs[0].dispatchEvent(new Event('change', { bubbles: true }));

            // Course Code
            inputs[1].value = 'CN301';
            inputs[1].dispatchEvent(new Event('change', { bubbles: true }));

            // Year
            inputs[2].value = '3';
            inputs[2].dispatchEvent(new Event('change', { bubbles: true }));

            // Semester
            inputs[3].value = '5';
            inputs[3].dispatchEvent(new Event('change', { bubbles: true }));

            // Branch
            inputs[4].value = 'CSE';
            inputs[4].dispatchEvent(new Event('change', { bubbles: true }));

            // Sections (leave empty for all sections)
            // Description
            inputs[6].value = 'Computer Networks - Data Communication and Networking fundamentals';
            inputs[6].dispatchEvent(new Event('change', { bubbles: true }));
        });

        // Submit course creation
        await page.evaluate(() => {
            const submitBtn = document.querySelector('.submit-btn');
            if (submitBtn) {
                submitBtn.click();
            }
        });

        await page.waitForTimeout(2000);
        console.log('✅ Computer Networks course created');

        // Step 2: Upload notes for 2 modules and 4 units
        console.log('📝 Uploading Computer Networks notes...');

        // Navigate to Notes tab
        await page.evaluate(() => {
            const buttons = document.querySelectorAll('.admin-nav button');
            buttons.forEach(btn => {
                if (btn.textContent.includes('Notes')) {
                    btn.click();
                }
            });
        });

        await page.waitForSelector('.form-grid');

        // Create sample PDF files for each module/unit
        const notesData = [
            // Module 1 - Unit 1
            { title: 'CN Module 1 Unit 1 - Introduction to Networks', fileName: 'cn-module1-unit1.pdf' },
            { title: 'CN Module 1 Unit 2 - Network Models', fileName: 'cn-module1-unit2.pdf' },

            // Module 2 - Unit 3
            { title: 'CN Module 2 Unit 3 - Physical Layer', fileName: 'cn-module2-unit3.pdf' },
            { title: 'CN Module 2 Unit 4 - Data Link Layer', fileName: 'cn-module2-unit4.pdf' },
        ];

        for (const note of notesData) {
            console.log(`📄 Uploading: ${note.title}`);

            // Fill upload form
            await page.evaluate((noteData) => {
                const inputs = document.querySelectorAll('.form-grid input, .form-grid select');

                // Year
                inputs[0].value = '3';
                inputs[0].dispatchEvent(new Event('change', { bubbles: true }));

                // Section
                inputs[1].value = 'A';
                inputs[1].dispatchEvent(new Event('change', { bubbles: true }));

                // Subject (select Computer Networks)
                inputs[2].value = 'Computer Networks';
                inputs[2].dispatchEvent(new Event('change', { bubbles: true }));

                // Title
                inputs[3].value = noteData.title;
                inputs[3].dispatchEvent(new Event('change', { bubbles: true }));
            }, note);

            // Create a sample PDF file for upload
            const samplePdfPath = path.join(__dirname, note.fileName);
            const sampleContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(${note.title}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000274 00000 n
0000000368 00000 n
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
465
%%EOF`;

            fs.writeFileSync(samplePdfPath, sampleContent);

            // Upload the file
            const fileInput = await page.$('input[type="file"]');
            if (fileInput) {
                await fileInput.uploadFile(samplePdfPath);
            }

            // Submit the form
            await page.evaluate(() => {
                const submitBtn = document.querySelector('.submit-btn');
                if (submitBtn) {
                    submitBtn.click();
                }
            });

            await page.waitForTimeout(1500);

            // Clean up sample file
            if (fs.existsSync(samplePdfPath)) {
                fs.unlinkSync(samplePdfPath);
            }
        }

        console.log('✅ All Computer Networks notes uploaded successfully!');
        console.log('');
        console.log('📋 Summary:');
        console.log('   Course: Computer Networks (CN301)');
        console.log('   Notes Uploaded:');
        console.log('   - Module 1 Unit 1: Introduction to Networks');
        console.log('   - Module 1 Unit 2: Network Models');
        console.log('   - Module 2 Unit 3: Physical Layer');
        console.log('   - Module 2 Unit 4: Data Link Layer');
        console.log('');
        console.log('🎯 Students can now access CN notes in student dashboard!');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await browser.close();
    }
}

createComputerNetworksCourse();
