import { exec } from 'child_process'
import net from 'net'

/**
 * Server class that receives a command from a client, executes it and sends the result back to the client.
 */
export class Server {
  /**
   * The server that listens for incoming connections.
   * @type {net.Server}
   * @public
   */
  public server: net.Server

  /**
   * Creates a new server that listens on an specified port.
   * @param {number} port The port to listen on.
   * @constructor
   */
  constructor(port: number = 3000) {
    this.server = net
      .createServer((connection) => {
        console.log('Client connected')
        
        connection.on('data', (data) => {
          console.log('Received data from client')
          console.log(data.toString())
          const file = JSON.parse(data.toString())
          this.execute(
            file.command + ' ' + file.arguments.join(' '),
            connection
          )
        })
        connection.on('close', () => {
          console.log('Client closed connection')
        })
      })
      .listen(port, () => {
        console.log('Waiting for client')
      })
  }

  /**
   * Executes a command and sends the result back to the client.
   * @param {string} command The command to execute.
   * @param {net.Socket} connection The connection to the client.
   * @private
   */
  public execute(command: string, connection: net.Socket): void {
    exec(command, (error, stdout, _) => {
      if (error) {
        console.error(error)
        connection.write(error.message)
      } else {
        console.log(stdout)
        connection.write(stdout)
      }
    })
  }

  /**
   * Closes the server.
   * @public
   */
  public close(): void {
    this.server.close(() => {
      console.log('Server closed')
    })
  }
}

let server = new Server()
