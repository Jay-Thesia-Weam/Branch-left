const express = require('express');
const path = require('path');
const githubConfigRouter = require('./routes/github-config');
const { startMonitoring } = require('./cron-setup');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', githubConfigRouter);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;

// Start the server and monitoring
async function startServer() {
    try {
        // Start the monitoring
        await startMonitoring();
        
        // Start the server
        app.listen(PORT, () => {
            console.log(`🌐 Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Start everything
startServer(); 