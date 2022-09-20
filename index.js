const core = require("@actions/core");
const github = require("@actions/github");

const run = async () => {
  try {
    const prNumber = core.getInput("pr-number");

    const githubToken = core.getInput("GITHUB_TOKEN");
    const octokit = github.getOctokit(githubToken);
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;

    const { data: pr } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: prNumber,
    });
    const body = pr.body;
    let elements = body.match(/\[.*?\)/g);
    if (elements != null && elements.length > 0) {
      for (el of elements) {
        let txt = el.match(/\[(.*?)\]/)[1]; //get only the txt
        let url = el.match(/\((.*?)\)/)[1]; //get only the link
        body = body.replace(el, "<" + url + "|" + txt + ">");
      }
    }
    console.log(
      "body",
      typeof body,
      body,
      body.replace(/\r|\n/g, "LINE_BREAK")
    );
    core.setOutput("body", body.replace(/\r|\n/g, "LINE_BREAK"));
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
