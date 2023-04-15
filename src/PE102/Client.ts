import net from 'net'
import { argv } from 'process'

/**
 * Client class, sends a command to the server and receives the output
 */
export class Client {
  /**
   * Port to connect to
   * @type {number}
   * @public
   */
  public port = -1
  /**
   * Socket to connect to the server
   * @type {net.Socket}
   * @public
   */
  public socket: net.Socket

  /**
   * Initializes the client
   * @param port Port to connect to
   * @public
   * @constructor
   */
  public constructor(port?: number) {
    if (port) this.port = port
    this.socket = new net.Socket()
  }

  /**
   * Method to connect to the server, send a command and receive the output
   * @param args Arguments passed to the program
   * @param callback Response callback
   * @public
   * @example
   * ```typescript
   * client.connect(["node", "test.spec.ts", "ls", "-l"], (success) => {
   *  expect(success).to.be.true
   *  web_server.server.close()
   * })
   * ```
   */
  public connect = (
    args: string[],
    callback: (success: boolean) => void = () => {}
  ): void => {
    if (this.port >= 0) {
      this.socket.connect(this.port)
      this.sendCommand(args, (success) => {
        if (success) {
          this.receiveOutput((data) => {
            console.log(data)
            this.socket.end()
            callback(true)
          })
        } else {
          console.log('Invalid command')
        }
      })
    } else {
      console.log('Invalid port')
      callback(false)
    }
  }

  /**
   * Method to send a command to the server
   * @param args Arguments passed to the program
   * @param callback Response callback
   * @private
   */
  private sendCommand = (
    args: string[],
    callback: (success: boolean) => void
  ): void => {
    if (argv.length >= 3) {
      this.socket.write(
        JSON.stringify({ command: args[2], arguments: args.slice(3) }) + '\n'
      )
      callback(true)
    } else {
      callback(false)
    }
  }

  /**
   * Method to receive the output from the server
   * @param callback Response callback
   * @private
   */
  private receiveOutput = (callback: (data?: string) => void): void => {
    let output = ''
    this.socket.on('data', (data) => {
      output += data.toString()
    })
    this.socket.on('end', () => {
      callback(output)
    })
  }
}
