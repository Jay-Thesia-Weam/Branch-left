# GitHub Merge Inspector AI Agent

An intelligent Node.js application that monitors GitHub repositories and provides AI-powered insights and automated actions for branch management.

## Features

- Monitors GitHub repository branches for merge status
- Runs checks every day at 12:00 PM automatically
- Sends email notifications for pending merges
- Web interface for configuration
- Configurable base and compare branches
- Advanced AI-powered features:
  - Smart merge conflict resolution suggestions
  - Code review automation
  - Branch naming convention enforcement
  - Automated PR description generation
  - Merge risk assessment
  - Code quality analysis
  - Dependency update recommendations
  - Security vulnerability detection
  - Performance impact analysis
  - Automated documentation updates

## Project Structure

```
├── server.js              # Main server and monitoring entry point
├── cron-setup.js          # Monitoring and cron job setup
├── github-ai-agent.js     # Core GitHub merge checking functionality
├── emailNotifier.js       # Email notification system
├── config.json           # Configuration file
├── routes/               # Web routes
│   └── github-config.js  # GitHub configuration routes
├── views/                # Web interface templates
│   └── github-config.ejs # Configuration page template
├── ai/                   # AI agent components
│   ├── codeReviewer.js   # AI code review system
│   ├── conflictResolver.js # Merge conflict resolution
│   ├── riskAnalyzer.js   # Merge risk assessment
│   ├── securityScanner.js # Security vulnerability detection
│   └── docGenerator.js   # Documentation automation
└── config/              # Configuration directory
```

## Prerequisites

- Node.js (v14 or higher)
- GitHub Personal Access Token
- OpenAI API Key
- Email service credentials (for notifications)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd github-merge-inspector
```

2. Install dependencies:
```bash
npm install
```

3. Create a `config.json` file with your settings:
```json
{
  "owner": "your-github-username",
  "repo": "your-repo-name",
  "baseBranches": ["main", "develop"],
  "compareBranch": "feature-branch",  // optional
  "token": "your-github-token",
  "ai": {
    "codeReview": true,
    "conflictResolution": true,
    "riskAnalysis": true,
    "securityScan": true,
    "docGeneration": true
  }
}
```

4. Set up environment variables in `config/env.config.js`:
```javascript
module.exports = {
  OPENAI_API_KEY: 'your-openai-api-key',
  EMAIL_CONFIG: {
    // your email service configuration
  }
};
```

## Usage

Start the server and monitoring:
```bash
npm start
```

This will:
- Start the web server on port 3000
- Begin monitoring GitHub branches daily at 12:00 PM
- Send email notifications when needed
- Run AI-powered analysis and actions

Access the web interface at `http://localhost:3000` to:
- View current configuration
- Update settings
- Monitor merge status
- View AI insights and recommendations

## AI Agent Capabilities

### Code Review Automation
- Analyzes code changes for best practices
- Suggests improvements and optimizations
- Identifies potential bugs and issues
- Enforces coding standards

### Merge Conflict Resolution
- Analyzes merge conflicts
- Suggests resolution strategies
- Provides step-by-step resolution guides
- Predicts potential issues

### Risk Assessment
- Evaluates merge impact
- Identifies potential breaking changes
- Analyzes dependency conflicts
- Suggests testing strategies

### Security Analysis
- Scans for security vulnerabilities
- Identifies sensitive data exposure
- Suggests security improvements
- Monitors dependency security

### Documentation
- Generates PR descriptions
- Updates documentation automatically
- Creates changelog entries
- Maintains API documentation

## Monitoring

The system automatically:
- Checks branch merge status daily at 12:00 PM
- Sends email notifications for:
  - Branches pending merge for 1, 2, 5, 10, or 20 days
  - Merge conflicts or issues
  - Security vulnerabilities
  - Code quality issues
- Provides AI-powered analysis and recommendations

## Email Notifications

Notifications include:
- Branch names
- Days pending
- Merge status
- AI analysis and recommendations
- Security alerts
- Code quality reports
- Action items

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 