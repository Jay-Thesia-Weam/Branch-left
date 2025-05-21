const fs = require('fs');
const path = require('path');
const { getTheMergingStatus } = require('./github-ai-agent');

// Path to your config file
const CONFIG_PATH = path.join(__dirname, 'config.json');

// Function to read and validate config
async function loadConfig() {
    try {
        const configData = await fs.promises.readFile(CONFIG_PATH, 'utf8');
        const config = JSON.parse(configData);
        
        // Validate required fields
        if (!config.owner || !config.repo || !config.token || !config.baseBranches) {
            throw new Error('Missing required configuration fields');
        }
        
        return config;
    } catch (error) {
        console.error('❌ Error loading configuration:', error.message);
        process.exit(1);
    }
}

// Function to run the merge check
async function runMergeCheck() {
    try {
        console.log('🕐 Running merge status check...');
        const config = await loadConfig();
        await getTheMergingStatus(config);
        console.log('✅ Merge status check completed');
    } catch (error) {
        console.error('❌ Error during merge check:', error.message);
    }
}

// Main function to start the monitoring
async function startMonitoring() {
    try {
        console.log('🚀 Starting GitHub merge monitoring...');
        
        // Initial config check
        const config = await loadConfig();
        console.log('✅ Configuration loaded successfully');
        
        // Run first check immediately
        await runMergeCheck();
        
        // Set up interval to run every 2 minutes
        setInterval(runMergeCheck, 2 * 60 * 1000);
        
        // Handle graceful shutdown
        process.on('SIGINT', () => {
            console.log('👋 Shutting down monitoring...');
            process.exit(0);
        });
        
    } catch (error) {
        console.error('❌ Failed to start monitoring:', error.message);
        process.exit(1);
    }
}

module.exports = {
    startMonitoring,
    runMergeCheck
}; 