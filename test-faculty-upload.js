const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testFacultyUpload() {
    console.log('🧪 Testing Faculty Upload Functionality...');

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });

    try {
        const page = await browser.newPage();

        // Login as faculty
        console.log('🔐 Logging in as faculty...');
        await page.goto('http://localhost:3000');
        await page.waitForSelector('.selection-container');

        // Click faculty login
        await page.evaluate(() => {
            const buttons = document.querySelectorAll('.selection-buttons button');
            buttons.forEach(btn => {
                if (btn.textContent.includes('Faculty Login')) {
                    btn.click();
                }
            });
        });

        await page.waitForSelector('form');

        // Fill faculty login form
        await page.type('input[placeholder="Faculty ID"]', 'FAC001');
        await page.type('input[placeholder="Password"]', 'password123');
        await page.click('button[type="submit"]');

        // Wait for faculty dashboard to load
        await page.waitForSelector('.faculty-dashboard-container');
        console.log('✅ Faculty logged in successfully');

        // Select a subject
        await page.waitForSelector('.courses-list');
        await page.evaluate(() => {
            const subjectBtns = document.querySelectorAll('.course-card');
            if (subjectBtns.length > 0) {
                subjectBtns[0].click();
            }
        });

        await page.waitForTimeout(1000);

        // Select sections
        await page.evaluate(() => {
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            if (checkboxes.length > 0) {
                checkboxes[0].click(); // Select first section
            }
        });

        await page.waitForTimeout(1000);

        // Upload a notes file with module/unit structure
        console.log('📝 Testing notes upload with module/unit...');

        // Create a test PDF file
        const testPdfPath = path.join(__dirname, 'test-notes.pdf');
        const testContent = `%PDF-1.4
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
(Test Notes - Module 1 Unit 1) Tj
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

        fs.writeFileSync(testPdfPath, testContent);

        // Upload notes file
        const fileInput = await page.$('input[type="file"]');
        if (fileInput) {
            await fileInput.uploadFile(testPdfPath);
        }

        // Set module and unit
        await page.evaluate(() => {
            const moduleSelect = document.querySelector('select[id*="module"]');
            const unitSelect = document.querySelector('select[id*="unit"]');

            if (moduleSelect) {
                moduleSelect.value = '1';
                moduleSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }

            if (unitSelect) {
                unitSelect.value = '1';
                unitSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });

        // Click upload button
        await page.evaluate(() => {
            const uploadBtn = document.querySelector('.upload-btn');
            if (uploadBtn) {
                uploadBtn.click();
            }
        });

        await page.waitForTimeout(2000);

        // Clean up test file
        if (fs.existsSync(testPdfPath)) {
            fs.unlinkSync(testPdfPath);
        }

        console.log('✅ Faculty upload test completed!');

        // Verify the upload worked by checking the materials API
        const materialsResponse = await page.evaluate(async () => {
            try {
                const response = await fetch('http://localhost:5000/api/materials');
                return await response.json();
            } catch (error) {
                console.error('Error fetching materials:', error);
                return [];
            }
        });

        const uploadedMaterials = materialsResponse.filter(m => m.title === 'test-notes.pdf');
        console.log(`📋 Found ${uploadedMaterials.length} uploaded materials`);
        uploadedMaterials.forEach(m => {
            console.log(`   📄 ${m.title} (Module: ${m.module}, Unit: ${m.unit})`);
        });

    } catch (error) {
        console.error('❌ Error during faculty upload test:', error);
    } finally {
        await browser.close();
    }
}

testFacultyUpload();
