const fs = require('fs');
const { sync: pkgUp } = require('pkg-up');

module.exports.readFilePromise = function(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  }).catch(err => {
    console.log(err);
  });
};

module.exports.getOwner = function(eventOwnerAndRepo) {
  const slicePos1 = eventOwnerAndRepo.indexOf('/');
  return eventOwnerAndRepo.slice(0, slicePos1);
};

module.exports.getRepo = function(eventOwnerAndRepo) {
  const slicePos1 = eventOwnerAndRepo.indexOf('/');
  return eventOwnerAndRepo.slice(slicePos1 + 1, eventOwnerAndRepo.length);
};

module.exports.listFiles = async function(
  octokit,
  eventOwner,
  eventRepo,
  eventIssueNumber,
) {
  const options = octokit.pulls.listFiles.endpoint.merge({
    owner: eventOwner,
    repo: eventRepo,
    pull_number: eventIssueNumber,
  });

  return await octokit
    .paginate(options)
    .then(data => {
      return data;
    })

    .catch(err => {
      console.log(err);
    });
};

module.exports.getMonorepo = function(baseDirectories, filePath) {
  const regexPattern = `^${baseDirectories}([^./]*)/`;
  var regex = new RegExp(regexPattern);
  var found = filePath.match(regex);

  if (found) {
    const packagePath = pkgUp({ cwd: filePath });
    console.log('getMonorepo', filePath, packagePath);
    if (!packagePath) return found[0];
    return packagePath;
  } else {
    return false;
  }
};

module.exports.addLabel = function(
  octokit,
  eventOwner,
  eventRepo,
  eventIssueNumber,
  label,
  description,
) {
  octokit.issues
    .addLabels({
      owner: eventOwner,
      repo: eventRepo,
      issue_number: eventIssueNumber,
      labels: [label], // ['Label 1']
    })
    .then(({ data, headers, status }) => {
      console.log(data);
      // handle data
      octokit.issues.updateLabel({
        owner: eventOwner,
        repo: eventRepo,
        name: label,
        current_name: label,
        color: 'b01f26',
        description,
      });
    })
    .catch(err => {
      console.log(err);
    });
};
