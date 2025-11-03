const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testFacultyCreation() {
    console.log('🧪 Testing Faculty Creation...');

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });

    try {
        const page = await browser.newPage();

        // Login as admin
        console.log('🔐 Logging into admin dashboard...');
        await page.goto('http://localhost:3000');
        await page.waitForSelector('input[type="text"]');

        // Fill login form
        await page.type('input[type="text"]', 'ReddyFBN@1228');
        await page.type('input[type="password"]', 'ReddyFBN');
        await page.click('button[type="submit"]');

        // Wait for admin dashboard to load
        await page.waitForSelector('.admin-nav');
        console.log('✅ Admin logged in successfully');

        // Navigate to Faculty tab
        await page.evaluate(() => {
            const buttons = document.querySelectorAll('.admin-nav button');
            buttons.forEach(btn => {
                if (btn.textContent.includes('Faculty')) {
                    btn.click();
                }
            });
        });

        await page.waitForSelector('.section-card');

        // Fill faculty creation form
        console.log('📝 Creating new faculty account...');
        await page.evaluate(() => {
            const inputs = document.querySelectorAll('.form-grid input');
            const selects = document.querySelectorAll('.form-grid select');

            // Fill basic info
            inputs[0].value = 'Dr. John Smith'; // Name
            inputs[0].dispatchEvent(new Event('change', { bubbles: true }));

            inputs[1].value = 'FAC002'; // Faculty ID
            inputs[1].dispatchEvent(new Event('change', { bubbles: true }));

            inputs[2].value = 'john.smith@university.edu'; // Email
            inputs[2].dispatchEvent(new Event('change', { bubbles: true }));

            inputs[3].value = 'password123'; // Password
            inputs[3].dispatchEvent(new Event('change', { bubbles: true }));

            // Fill assignment
            const assignmentInputs = document.querySelectorAll('.form-grid input[placeholder]');
            if (assignmentInputs.length >= 3) {
                assignmentInputs[0].value = '3'; // Year
                assignmentInputs[0].dispatchEvent(new Event('change', { bubbles: true }));

                assignmentInputs[1].value = 'Computer Networks'; // Subject
                assignmentInputs[1].dispatchEvent(new Event('change', { bubbles: true }));

                assignmentInputs[2].value = 'A,B'; // Sections
                assignmentInputs[2].dispatchEvent(new Event('change', { bubbles: true }));
            }
        });

        // Click Add Assignment button
        await page.evaluate(() => {
            const addBtn = document.querySelector('.btn-action');
            if (addBtn && addBtn.textContent.includes('Add')) {
                addBtn.click();
            }
        });

        await page.waitForTimeout(1000);

        // Submit the form
        await page.evaluate(() => {
            const submitBtn = document.querySelector('.submit-btn');
            if (submitBtn) {
                submitBtn.click();
            }
        });

        await page.waitForTimeout(2000);

        // Check if faculty was created successfully
        const successMessage = await page.evaluate(() => {
            return document.body.textContent.includes('Faculty account created');
        });

        if (successMessage) {
            console.log('✅ Faculty account created successfully!');

            // Check if faculty appears in the table
            const facultyInTable = await page.evaluate(() => {
                const rows = document.querySelectorAll('tbody tr');
                for (let row of rows) {
                    const cells = row.querySelectorAll('td');
                    if (cells.length > 1 && cells[1].textContent.includes('FAC002')) {
                        return true;
                    }
                }
                return false;
            });

            if (facultyInTable) {
                console.log('✅ Faculty appears in admin table');
            } else {
                console.log('❌ Faculty not found in admin table');
            }
        } else {
            console.log('❌ Faculty creation failed');
            // Check for error messages
            const errorText = await page.evaluate(() => {
                return document.body.textContent;
            });
            console.log('Error details:', errorText);
        }

    } catch (error) {
        console.error('❌ Error during faculty creation test:', error);
    } finally {
        await browser.close();
    }
}

testFacultyCreation();
