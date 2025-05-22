# GitHub Merge Inspector

A function-based tool that inspects merge status between source branches and environment branches in GitHub repositories.

## Features

- Compares a source branch against multiple environment branches (main, dev, qa, test)
- Supports optional additional base branch comparison
- Works with both public and private repositories
- Provides detailed merge status with commit messages and changed files
- Handles GitHub API authentication

## Installation

```bash
npm install
```

## Usage

```javascript
const { inspectGitHubMergeStatus } = require('./github_tooling');

// Example usage
const result = await inspectGitHubMergeStatus({
    repo: 'owner/repo',  // or full GitHub URL
    source_branch: 'feature/new-feature',
    base_branch: 'release',  // optional
    github_token: 'your-github-token'  // optional
});

console.log(result);
```

## Input Parameters

- `repo` (required): GitHub repository in the form `owner/repo` or full URL
- `source_branch` (required): Source branch to compare
- `github_token` (optional): GitHub personal access token for private repositories
- `base_branch` (optional): Additional base branch to include in comparison

## Output Format

The function returns a formatted string with merge status for each environment branch:

```
**Branch: `source_branch_name`**

**Environment: main**
✅ Already merged.

**Environment: dev**
❌ Not merged.
- Commit: `Fix auth bug`
- Commit: `Improve token validation`
- File: `src/api/auth.js`
- File: `src/middleware/token.js`
```

## Error Handling

The function handles various error cases:
- Invalid repository format
- Non-existent branches
- API rate limiting
- Authentication errors

Each error is reported in the output with appropriate error messages. 