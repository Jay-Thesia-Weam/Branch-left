const express = require('express');
const router = express.Router();
const { getTheMergingStatus } = require('../github-ai-agent');
const path = require('path')
const fs=require('fs')


// Serve the configuration page
router.get('/', (req, res) => {
    res.render('github-config');
});


const CONFIG_PATH = path.join(__dirname, '../../configStore.json');

// Handle configuration submission
router.post('/api/github-config', async (req, res) => {
    try {
        const { repoUrl, githubToken, compareBranch, baseBranches } = req.body;
        const config = req.body;

        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
        // Extract owner and repo from the URL
        const urlParts = repoUrl.replace('https://github.com/', '').split('/');
        const owner = urlParts[0];
        const repo = urlParts[1];

        // Start monitoring with the provided configuration
        await getTheMergingStatus({
            owner,
            repo,
            compareBranch,
            baseBranches,
            token: githubToken
        });

        res.json({ success: true, message: 'Configuration saved and monitoring started' });
    } catch (error) {
        console.error('Error saving configuration:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error saving configuration',
            error: error.message 
        });
    }
});

module.exports = router; 