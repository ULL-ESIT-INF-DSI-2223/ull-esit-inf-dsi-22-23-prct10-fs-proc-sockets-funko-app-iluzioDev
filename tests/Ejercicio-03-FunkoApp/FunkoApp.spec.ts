import 'mocha'
import { expect } from 'chai'

import {
  RequestType,
  FunkoApp,
} from '../../src/Ejercicio-03-FunkoApp/FunkoApp/FunkoApp.js'
import { Client } from '../../src/Ejercicio-03-FunkoApp/FunkoApp/Client.js'

describe('Funko App Tests', () => {
  const funkoApp: FunkoApp = new FunkoApp(4000)
  const client: Client = new Client(4000)
  describe('FunkoApp class tests', () => {
    it('FunkoApp should be an instance of FunkoApp class', () => {
      expect(funkoApp).to.be.an.instanceof(FunkoApp)
    })
    it('FunkoApp should have a port property', () => {
      expect(funkoApp).to.have.property('port')
      expect(funkoApp.port).to.be.a('number')
    })
    it('FunkoApp should have a server property', () => {
      expect(funkoApp).to.have.property('server')
    })
  })

  describe('Client class tests', () => {
    it('Client should be an instance of Client class', () => {
      expect(client).to.be.an.instanceof(Client)
    })
    it('Client should have a socket property', () => {
      expect(client).to.have.property('socket')
    })
    it('Client should have a port property', () => {
      expect(client).to.have.property('port')
      expect(client.port).to.be.a('number')
    })
    it('Client should be able to connect to a server, send a command and receive the output', () => {
      const request: RequestType = {
        user: 'Iluzio',
        type: 'list',
      }
      client.connect(request, (response) => {
        expect(response.type).to.be.equal('list')
        expect(response.success).to.be.false
        funkoApp.stop()
      })
    })
  })
})
