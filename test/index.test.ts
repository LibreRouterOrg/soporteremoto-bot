import request from 'supertest'
import fs from 'fs'
import path from 'path'

// Requiring our app implementation
import botApp from '../src'
import { Probot } from 'probot'
import { setupNock } from './utils/setupNock'

describe('SoporteRemoto bot for LibreNet6', () => {
  let probot: any
  let logger: any
  let mockCert: string

  beforeAll((done: Function) => {
    fs.readFile(path.join(__dirname, 'fixtures/mock-cert.pem'), (err: NodeJS.ErrnoException | null, cert: Buffer) => {
      if (err) return done(err)
      mockCert = cert.toString()
      done()
    })
  })

  beforeEach(() => {
    setupNock()
    logger = jest.fn()
    probot = new Probot({ id: 123, cert: mockCert })
    probot.logger.addStream({
      level: 'trace',
      stream: { write: logger } as any,
      type: 'raw'
    })
    // Load our app into probot
    probot.load(botApp)
  })

  it('Return error if payload is incomplete', async (done) => {
    const data = {}
    const res = await request(probot.server)
      .post('/send-key')
      .send(data)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('error')
    expect(res.body.error).toEqual('missing parameter')
    done()
  })

  it('Create a pull-request', async (done) => {
    const data = {
      communityName: 'quintanalibre',
      deviceName: 'soporte-nice-red',
      pubKey: 'MIIBCgKCAQEAw+N+2iwUGgP4TBI2kdWBGOaN0p8tkc/4jvU1waiHV41x9Xje4iL5\ne85CMeuMbT1InCJgciZ0yoG1kpimgiBj/pHAOKCxia9MInpv0lGq3l4Ih7Wvh1ng\nnlASOiHblrFdHRA/mg0BzW9e550TLaNoGRKQrbjtupiyUbJGMrymfge8d1AkK+Us\nufBNnGfDMF1pCjIE4TF2ss370dJpF945aHhYcnFihkSN5c17tlP2QcQ1mY3xUfVC\nDYEW34gY2XNAUXM0QJ7VWf+KC0Han5Liyd1XOZBDv6ZRhG+4jJVocKFWXp8eKttT\nQujFquajmj6cblFywipo9V2Qp2J+EKNCeQIDAQAB'
    }

    const res = await request(probot.server)
      .post('/send-key')
      .send(data)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('ok')
    expect(res.body.ok).toBe(true)
    done()
  })

  it('Returns an error if something fails to create a pull-request request', async (done) => {
    jest.setTimeout(30000)
    const data = {
      communityName: 'quintanalibre',
      deviceName: 'soporte-nice-blue',
      pubKey: 'MIIBCgKCAQEAw+N+2iwUGgP4TBI2kdWBGOaN0p8tkc/4jvU1waiHV41x9Xje4iL5\ne85CMeuMbT1InCJgciZ0yoG1kpimgiBj/pHAOKCxia9MInpv0lGq3l4Ih7Wvh1ng\nnlASOiHblrFdHRA/mg0BzW9e550TLaNoGRKQrbjtupiyUbJGMrymfge8d1AkK+Us\nufBNnGfDMF1pCjIE4TF2ss370dJpF945aHhYcnFihkSN5c17tlP2QcQ1mY3xUfVC\nDYEW34gY2XNAUXM0QJ7VWf+KC0Han5Liyd1XOZBDv6ZRhG+4jJVocKFWXp8eKttT\nQujFquajmj6cblFywipo9V2Qp2J+EKNCeQIDAQAB'
    }

    const res = await request(probot.server)
      .post('/send-key')
      .send(data)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('error')
    expect(res.body.error).toEqual('can not create the pull-request')
    done()
  })
})
