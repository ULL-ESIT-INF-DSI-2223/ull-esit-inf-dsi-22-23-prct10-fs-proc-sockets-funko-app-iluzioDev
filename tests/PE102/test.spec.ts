import 'mocha'
import { expect } from 'chai'

import { Client } from '../../src/PE102/Client.js'
import { Server } from '../../src/PE102/Server.js'

let web_server: Server = new Server(3000)
let client: Client = new Client(3000)

describe('Server class tests', () => {
  it('Web Server should be an instance of Server class', () => {
    expect(web_server).to.be.an.instanceof(Server)
  })
  it('Web Server should have a port property', () => {
    expect(web_server).to.have.property('port')
    expect(web_server.port).to.be.a('number')
  })
  it('Web Server should have a server property', () => {
    expect(web_server).to.have.property('server')
  })
  it('Web Server should be able to listen to a port and handle connections', () => {
    web_server.listen((success) => {
      expect(success).to.be.true
    })
  })
})

describe('Client class tests', () => {
  it('Client should be an instance of Client class', () => {
    expect(client).to.be.an.instanceof(Client)
  })
  it('Client should have a socket property', () => {
    expect(client).to.have.property('socket')
  })
  it('Client should be able to connect to a server, send a command and receive the output', () => {
    client.connect(['node', 'test.spec.ts', 'ls', '-l'], (success) => {
      expect(success).to.be.true
      web_server.server.close()
    })
  })
})
