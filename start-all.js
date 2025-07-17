const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Sri Sai Senthil Tours - Complete System');
console.log('================================================');

// Function to start a process
function startProcess(name, command, args, cwd, color) {
    console.log(`[${name}] Starting...`);

    const process = spawn(command, args, {
        cwd: cwd,
        stdio: 'inherit',
        shell: true
    });

    process.on('error', (error) => {
        console.error(`[${name}] Error: ${error.message}`);
    });

    process.on('close', (code) => {
        console.log(`[${name}] Process exited with code ${code}`);
    });

    return process;
}

// Start all applications
console.log('\n🔵 Starting Backend API...');
const apiProcess = startProcess(
    'API',
    'dotnet',
    ['run'],
    path.join(__dirname, 'TourBookingAPI', 'TourBookingAPI'),
    'blue'
);

setTimeout(() => {
    console.log('\n🟢 Starting Back Office...');
    const backofficeProcess = startProcess(
        'BackOffice',
        'npm',
        ['start'],
        path.join(__dirname, 'tour-booking-frontend'),
        'green'
    );
}, 5000);

setTimeout(() => {
    console.log('\n🟡 Starting Customer Website...');
    const customerProcess = startProcess(
        'Customer',
        'npm',
        ['start'],
        path.join(__dirname, 'customer-booking-website'),
        'yellow'
    );
}, 8000);

// Open browsers after delay
setTimeout(() => {
    console.log('\n🌐 Opening applications in browser...');

    const { exec } = require('child_process');

    exec('start http://localhost:5051/swagger', (error) => {
        if (error) console.log('Could not open Swagger UI');
    });

    setTimeout(() => {
        exec('start http://localhost:3001', (error) => {
            if (error) console.log('Could not open Back Office');
        });
    }, 2000);

    setTimeout(() => {
        exec('start http://localhost:3000', (error) => {
            if (error) console.log('Could not open Customer Website');
        });
    }, 4000);

}, 30000);

console.log('\n✅ All applications are starting...');
console.log('📋 URLs will be available at:');
console.log('   Backend API: http://localhost:5051');
console.log('   Swagger Docs: http://localhost:5051/swagger');
console.log('   Back Office: http://localhost:3001');
console.log('   Customer Website: http://localhost:3000');
console.log('\n⏳ Please wait 60-90 seconds for all applications to fully load...');
console.log('🌐 Browsers will open automatically after 30 seconds');
console.log('\n🛑 Press Ctrl+C to stop all applications');

// Handle Ctrl+C
process.on('SIGINT', () => {
    console.log('\n🛑 Stopping all applications...');
    process.exit(0);
});
