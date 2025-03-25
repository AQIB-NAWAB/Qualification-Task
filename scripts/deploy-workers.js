const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function deployWorkers() {
    const workersDir = path.join(__dirname, '../workers');
    const folders = fs.readdirSync(workersDir).filter((folder) => 
        fs.statSync(path.join(workersDir, folder)).isDirectory()
    );
    
    folders.forEach((folder) => {
        const workerPath = path.join(workersDir, folder);
    
        console.log(`---------Process Running for the worker ${folder}-------------`);
    
        try {
        console.log(`✅ Deploying ${folder}`);
        // Deploying the worker using Wrangler
        execSync(`wrangler deploy  --config ${workerPath}/wrangler.jsonc`);
        console.log(`✅ ${folder} deployed successfully`);
        console.log(`-------------------------------------------------------------`);
        } catch (error) {
        console.error(`❌ Failed to deploy ${folder}:`, error);
        }
    });
    
    console.log('✅ All workers have been deployed successfully!');
}

deployWorkers();