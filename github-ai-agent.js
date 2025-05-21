const env = require("./config/env.config");
const OpenAI = require("openai");
const { sendEmailNotification } = require("./emailNotifier");
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const { analyzeCodeChanges, suggestImprovements } = require('./ai/codeReviewer');

async function queryOpenAI(userQuery) {
  try {
    const openai = new OpenAI({
      key: env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: userQuery }],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI:", error);
  }
}

async function fetchTheMergingStatus({ owner, repo, baseBranch, compareBranch, token }) {
  repo=repo.split('.')[0]
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/compare/${baseBranch}...${compareBranch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return await response.json();
}

function daysBetween(date1, date2) {
  const diffTime = Math.abs(date2 - date1);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

async function fetchAllBranches({ owner, repo, token }) {
  repo=repo.split('.')[0]
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch branches: ${response.statusText}`);
  }

  const branches = await response.json();
  return branches.map((branch) => branch.name);
}

async function storeConfig(config) {
  const configPath = path.join(__dirname, 'config.json');
  try {
    await fs.promises.writeFile(configPath, JSON.stringify(config, null, 2));
    console.log('Config stored successfully');
  } catch (error) {
    console.error('Error storing config:', error);
    throw error;
  }
}

async function getStoredConfig() {
  const configPath = path.join(__dirname, 'config.json');
  try {
    const configData = await fs.promises.readFile(configPath, 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    console.error('Error reading config:', error);
    return null;
  }
}

async function getTheMergingStatus(config) {
  console.log("🚀 ~ getTheMergingStatus ~ config:", config);

  const { owner, repo, baseBranches, compareBranch, token } = config;

  if (!owner || !repo || !token || !baseBranches) {
    throw new Error('Missing required configuration: owner, repo, token, and baseBranches are required');
  }

  // Store config if it's the first time
  const storedConfig = await getStoredConfig();
  if (!storedConfig) {
    await storeConfig(config);
  }

  const now = new Date();

  // Get branches to compare
  let compareBranches = [];

  if (compareBranch) {
    compareBranches = [compareBranch];
  } else {
    const allBranches = await fetchAllBranches({ owner, repo, token });
    compareBranches = allBranches.filter((branch) => !baseBranches.includes(branch));
  }

  for (const baseBranch of baseBranches) {
    for (const compare of compareBranches) {
      if (baseBranch === compare) continue;

      const dataOfMergingStatus = await fetchTheMergingStatus({
        owner,
        repo,
        baseBranch,
        compareBranch: compare,
        token,
      });

      const status = dataOfMergingStatus.status;
      console.log(`Status of ${compare} into ${baseBranch}:`, status);

      if (status === "identical" || status === "behind") {
        console.log(`${compare} is already merged or behind ${baseBranch}. No email needed.`);
        continue;
      }

      if (dataOfMergingStatus.commits && dataOfMergingStatus.commits.length > 0) {
        const firstCommitDate = new Date(dataOfMergingStatus.commits[0].commit.author.date);
        const daysPending = daysBetween(firstCommitDate, now);
        const alertDays = [1, 2, 5, 10, 20];
        const shouldAlert = alertDays.includes(daysPending);

        if (shouldAlert) {
          // Get code review analysis
          const codeReview = await analyzeCodeChanges(dataOfMergingStatus);
          
          // Get improvement suggestions
          const improvements = await suggestImprovements(
            dataOfMergingStatus.files.map(file => file.patch).join('\n')
          );

          const userQuery = `
            You are a helpful assistant that will help me to get the status of the merging of the branches.
            I have the following branches: Base branch: ${baseBranch} and compare branch: ${compare}.
            Please give me the status of the merging of the branches. I am directly sharing the response from the github compare branch api's data, if you got status in this response as identical, then it is merged. 
            If ahead, give me list of files which is merged with its name.

            Here is the response from the github compare branch api's data:
            ${JSON.stringify(dataOfMergingStatus)}
          `;

          const answer = await queryOpenAI(userQuery);

          const subject = `⚠️ Merge Alert: ${compare} not merged into ${baseBranch} for ${daysPending} days`;
          const html = `
            <h3>Branch merge alert</h3>
            <p><b>Base branch:</b> ${baseBranch}</p>
            <p><b>Compare branch:</b> ${compare}</p>
            <p><b>Status:</b> ${status}</p>
            <p><b>Days pending:</b> ${daysPending}</p>
            <p><b>First commit date:</b> ${firstCommitDate.toISOString()}</p>
            
            <h4>Code Review Analysis:</h4>
            <pre>${codeReview}</pre>
            
            <h4>Suggested Improvements:</h4>
            <pre>${improvements}</pre>
            
            <h4>OpenAI Analysis:</h4>
            <pre>${answer}</pre>
            
            <p>Please review the merge status and code review feedback.</p>
          `;

          await sendEmailNotification(subject, html);
          console.log(`Sent email alert for ${compare} → ${baseBranch} at ${daysPending} days.`);
        }
      }
    }
  }
}

// Set up cron job to run daily at 12:00 PM
function setupCronJob() {
  cron.schedule('0 12 * * *', async () => {
    console.log('Running scheduled merge status check...');
    const config = await getStoredConfig();
    if (config) {
      await getTheMergingStatus(config);
    } else {
      console.error('No stored config found for scheduled run');
    }
  });
}

// Initialize the cron job
setupCronJob();

module.exports = { getTheMergingStatus };
