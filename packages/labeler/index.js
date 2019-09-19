console.log('started nodejs...');

const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');
const _ = require('underscore');

//require octokit rest.js
//more info at https://github.com/octokit/rest.js
const Octokit = require('@octokit/rest');
const octokit = new Octokit({
  auth: `token ${process.env.GITHUB_TOKEN}`,
});

let baseDirectories = '';
if (process.env.BASE_DIRS) baseDirectories = `(?:${process.env.BASE_DIRS})\/`;

//set eventOwner and eventRepo based on action's env variables
const eventOwnerAndRepo = process.env.GITHUB_REPOSITORY;
const eventOwner = helpers.getOwner(eventOwnerAndRepo);
const eventRepo = helpers.getRepo(eventOwnerAndRepo);

async function prMonorepoRepoLabeler() {
  //read contents of action's event.json
  const eventData = await helpers.readFilePromise(
    process.env.GITHUB_EVENT_PATH,
  );
  const eventJSON = JSON.parse(eventData);

  //set eventAction and eventIssueNumber
  eventAction = eventJSON.action;
  eventIssueNumber = eventJSON.pull_request.number;

  //get list of files in PR
  const prFiles = await helpers.listFiles(
    octokit,
    eventOwner,
    eventRepo,
    eventIssueNumber,
  );

  //get monorepo repo for each file
  prFilesRepos = prFiles.map(({ filename }) =>
    helpers.getMonorepo(baseDirectories, filename),
  );

  //reduce to unique repos
  const prFilesReposUnique = _.uniq(prFilesRepos).filter(Boolean);

  const packageNames = [];

  console.log('parse packages: ', prFilesReposUnique);
  for (const packagePath of prFilesReposUnique) {
    try {
      const packageJson = require(packagePath);
      if (packageJson && packageJson.name && packageJson.name.length) {
        packageNames.push({
          name: packageJson.name,
          description: packageJson.description,
        });
      } else {
        packageNames.push({ name: packagePath });
      }
    } catch (error) {
      packageNames.push({ name: packagePath });
    }
  }

  console.log('assigning packages: ', packageNames);
  //add label for each monorepo repo
  for (const packageInfo of packageNames) {
    console.log(`labeling package: ${packageInfo.name}`);

    const packageLabel = `📦 pkg: ${packageInfo.name}`;

    helpers.addLabel(
      octokit,
      eventOwner,
      eventRepo,
      eventIssueNumber,
      packageLabel,
      packageInfo.description,
    );
  }
}

//run the function
prMonorepoRepoLabeler();

module.exports.prMonorepoRepoLabeler = prMonorepoRepoLabeler;
