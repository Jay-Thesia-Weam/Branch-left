const env = require("./config/env.config");
const OpenAI = require("openai");
const { sendEmailNotification } = require("./emailNotifier");

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

async function fetchTheMergingStatus({ owner, repo, baseBranch, compareBranch }) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/compare/${baseBranch}...${compareBranch}`,
    {
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      },
    }
  );
  return await response.json();
}

function daysBetween(date1, date2) {
  const diffTime = Math.abs(date2 - date1);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

async function getTheMergingStatus() {
  const baseBranches = ["main", "dev", "qa", "dev-test"];
  const compareBranch = "dev";
  const now = new Date();

  for (const baseBranch of baseBranches) {
    const dataOfMergingStatus = await fetchTheMergingStatus({
      owner: env.GITHUB_OWNER,
      repo: env.GITHUB_REPO,
      baseBranch,
      compareBranch,
    });

    const status = dataOfMergingStatus.status;
    console.log("🚀 ~ getTheMergingStatus ~ status:", status);

    if (status === "identical" || status === "behind") {
      console.log(`${baseBranch} is merged or behind. No email needed.`);
    } else if (dataOfMergingStatus.commits && dataOfMergingStatus.commits.length > 0) {
      // Get the first commit's author date
      const firstCommitDate = new Date(dataOfMergingStatus.commits[0].commit.author.date);
      const daysPending = daysBetween(firstCommitDate, now);

      const alertDays = [1, 2, 5, 10, 20];
      const shouldAlert = alertDays.includes(daysPending);

      if (shouldAlert) {
        const userQuery = `
          You are a helpful assistant that will help me to get the status of the merging of the branches.
          I have the following branches: Base branch: ${baseBranch} and compare branch: ${compareBranch}.
          Please give me the status of the merging of the branches. I am directly sharing the response from the github compare branch api's data, if you got status in this response as identical, then it is merge, if ahead give me list of files which is merged with its name.

          Here is the response from the github compare branch api's data:
          ${JSON.stringify(dataOfMergingStatus)}
        `;

        const answer = await queryOpenAI(userQuery);

        const subject = `⚠️ Merge Alert: ${compareBranch} not merged into ${baseBranch} for ${daysPending} days`;
        const html = `
          <h3>Branch merge alert</h3>
          <p><b>Base branch:</b> ${baseBranch}</p>
          <p><b>Compare branch:</b> ${compareBranch}</p>
          <p><b>Status:</b> ${status}</p>
          <p><b>Days pending:</b> ${daysPending}</p>
          <p><b>First commit date:</b> ${firstCommitDate.toISOString()}</p>
          <h4>OpenAI Analysis:</h4>
          <pre>${answer}</pre>
          <p>Please review the merge status.</p>
        `;

        await sendEmailNotification(subject, html);
        console.log(`Sent email alert for ${baseBranch} at ${daysPending} days.`);
      }
    }
  }
}

getTheMergingStatus();
