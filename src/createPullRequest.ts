export const openPR = async (repo, github, fields) => {
  const branch = `add-${fields.file.path}` // your branch's name
  const content = Buffer.from(fields.file.content).toString('base64') // content for your configuration file

  const reference = await github.git.getRef({
    ref: 'heads/master',
    owner: repo.owner.login,
    repo: repo.name
  }) // get the reference for the master branch

  // Create branch
  await github.git.createRef({
    ref: `refs/heads/${branch}`,
    owner: repo.owner.login,
    repo: repo.name,
    sha: reference.data.object.sha
  })

  // Add commit
  await github.repos.createOrUpdateFile({
    owner: repo.owner.login,
    repo: repo.name,
    path: fields.file.path, // the path to your config file
    message: `adds ${fields.file.path}`, // a commit message
    content,
    branch
  })

  // Create pull-request
  return github.pulls.create({
    owner: repo.owner.login,
    repo: repo.name,
    title: fields.pr.title, // the title of the PR
    head: branch,
    base: 'master', // where you want to merge your changes
    body: fields.pr.body, // the body of your PR,
    maintainer_can_modify: true // allows maintainers to edit your app's PR
  })
}
