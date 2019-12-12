import nock from 'nock'

// Requiring our fixtures
import payloadInstalledApps from '../fixtures/app.installations.json'
import payloadParticularInstallation from '../fixtures/app.particularInstallation.json'
import payloadRepositories from '../fixtures/app.repositories.json'
import payloadMasterRef from '../fixtures/repo.masterRef.json'

export const setupNock = () => {
// Check all the installation
  nock('https://api.github.com')
    .get('/app/installations?per_page=100')
    .reply(200, payloadInstalledApps)

  // Get the LibreMesh installation data
  nock('https://api.github.com')
    .post('/app/installations/5642208/access_tokens', {})
    .reply(201, payloadParticularInstallation)

  // Get the LibreMesh repositories data
  nock('https://api.github.com')
    .get('/installation/repositories?per_page=100')
    .reply(200, payloadRepositories)

  // Get the heads of LibreNet6 master branch
  nock('https://api.github.com')
    .get('/repos/libremesh/librenet6-hostkeys/git/refs/heads/master')
    .reply(200, payloadMasterRef)

  // Create a new branch in LibreNet6 repo
  nock('https://api.github.com')
    .post('/repos/libremesh/librenet6-hostkeys/git/refs', {
      ref: 'refs/heads/add-soporteremoto_quintanalibre_soporte-nice-red',
      sha: '596f6c74283130d25c1a8a93f7e14b7470a2a0b7'
    })
    .reply(201, {})
  
    // Add commit to the new brach
  nock('https://api.github.com')
    .put('/repos/libremesh/librenet6-hostkeys/contents/soporteremoto_quintanalibre_soporte-nice-red')
    .reply(201, {})

  // Make a pull-request
  nock('https://api.github.com')
    .post('/repos/libremesh/librenet6-hostkeys/pulls')
    .reply(201, {})
}
