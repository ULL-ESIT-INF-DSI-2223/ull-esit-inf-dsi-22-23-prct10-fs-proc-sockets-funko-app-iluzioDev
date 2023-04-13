import { exec } from 'child_process'
import net from 'net'

/**
 * Server class that receives a command from a client, executes it and sends the result back to the client.
 */
export class Server {
  /**
   * Port to listen to
   * @type {number}
   * @public
   */
  public port: number = -1
  /**
   * Server instance
   * @type {net.Server}
   * @public
   */
  public server: net.Server = new net.Server()

  /**
   * Initializes the server port
   * @param port Port to listen to
   * @public
   * @constructor
   */
  public constructor(port?: number) {
    if (port) this.port = port
  }

  /**
   * Method to listen and handle connections to the server
   * @param callback Response callback
   * @public
   */
  public listen = (callback: (success: boolean) => void): void => {
    if (this.port < 0) {
      console.error('Invalid port')
      callback(false)
      return
    } else {
      this.server = net
        .createServer(this.handleConnection)
        .listen(this.port, () => {
          console.log('Waiting for client')
        })
      this.server.on('close', () => {
        console.log('Server closed')
        callback(true)
      })
    }
  }

  /**
   * Method to handle a connection to the server
   * @param connection Connection to handle
   * @private
   */
  private handleConnection = (connection: net.Socket): void => {
    console.log('Client connected')
    let output = ''
    connection.on('data', (data) => {
      output += data.toString()
      if (output.includes('\n')) {
        console.log('Received data from client: ' + output)
        const file = JSON.parse(output)
        this.execute(
          file.command + ' ' + file.arguments.join(' '),
          connection,
          (success) => {
            if (success)
              console.log('Command executed and result sent to client')
            else console.error('Error executing or sending result to client')
            connection.end()
          }
        )
      }
    })
  }

  /**
   * Method to execute a command and send the result to the client
   * @param command Command to execute
   * @param connection Connection to send the result to
   * @param callback Response callback
   * @private
   */
  private execute = (
    command: string,
    connection: net.Socket,
    callback: (success: boolean) => void = () => {}
  ): void => {
    exec(command, (error, stdout, _) => {
      if (error) {
        console.error(error)
        connection.write(error.message)
        callback(false)
      } else {
        console.log(stdout)
        connection.write(stdout)
        callback(true)
      }
    })
  }
}
