import net from 'net'
import { argv } from 'process'

/**
 * Client class, sends a command to the server and receives the output
 */
export class Client {
  /**
   * The client that sends the command
   * @type {net.Socket}
   * @public
   */
  public client: net.Socket

  /**
   * Creates a new client.
   * @constructor
   */
  constructor(port = 3000) {
    this.client = new net.Socket()
    this.connect(port)
  }

  /**
   * Connects to the server and sends the command.
   * @param {number} port The port to connect to.
   * @public
   */
  public connect(port: number): void {
    this.client.connect(port)
    this.write()
  }

  /**
   * Sends the command to the server.
   * @public
   */
  public write(): void {
    if (argv.length >= 3) {
      this.client.write(
        JSON.stringify({ command: argv[2], arguments: argv.slice(3) })
      )
    }

    this.client.on('data', (data) => {
      console.log(data.toString())
      this.close()
    })
  }

  /**
   * Closes the connection to the server.
   */
  private close(): void {
    this.client.destroy()
  }
}

let client = new Client(3000)
