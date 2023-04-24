import net from 'net'
import chalk from 'chalk'

import { FunkoPop } from '../Funko/FunkoPop.js'
import { User } from '../User/User.js'

/**
 * Operations that the server can handle
 */
export type Operation =
  | 'add'
  | 'update'
  | 'remove'
  | 'search'
  | 'list'
  | 'unknown'

/**
 * Request type made by the clients
 */
export type RequestType = {
  /**
   * User that makes the request
   * @type {string}
   */
  user: string
  /**
   * Type of the request, it can be:
   * - add: Add a new FunkoPop
   * - update: Update an existing FunkoPop
   * - remove: Remove an existing FunkoPop
   * - search: Read an existing FunkoPop
   * - list: List all the existing FunkoPops
   * @type {Operation}
   */
  type: Operation
  /**
   * The requests could need a FunkoPop to be processed
   * @type {FunkoPop}
   */
  funkoPop?: FunkoPop
  /**
   * Some request need an id to be processed
   * @type {number}
   */
  id?: number
}

/**
 * Response type made by the server
 */
export type ResponseType = {
  /**
   * Type of the response, it can be:
   * - add: Add a new FunkoPop
   * - update: Update an existing FunkoPop
   * - remove: Remove an existing FunkoPop
   * - search: Read an existing FunkoPop
   * - list: List all the existing FunkoPops
   * @type {Operation}
   */
  type: Operation
  /**
   * Result of the operation. True if the operation was successful, false otherwise
   */
  success: boolean
  /**
   * The response could return one or more FunkoPops to the client
   */
  funkoPops?: FunkoPop[]
}

/**
 * Class that represents the server of the FunkoApp
 */
export class FunkoApp {
  /**
   * Instance of the server
   * @type {net.Server}
   * @public
   */
  public server: net.Server = new net.Server()

  /**
   * Initializes the FunkoApp server
   * @param port Port to listen to
   * @public
   * @constructor
   */
  public constructor(public port = -1) {
    if (this.port >= 0) {
      this.start()
    } else {
      console.log(chalk.red('Invalid port'))
    }
  }

  /**
   * Method to start the server
   * @public
   */
  public start(): void {
    this.server = net
      .createServer(this.handleConnection)
      .listen(this.port, () => {
        console.log(chalk.green(`Server listening on port ${this.port}`))
      })
  }

  /**
   * Method to handle each connection to the server
   * @param connection Connection with client to handle
   * @private
   */
  private handleConnection = (connection: net.Socket): void => {
    console.log(chalk.yellow('Client connected'))
    let data = ''
    connection.on('data', (chunk) => {
      data += chunk.toString()
      if (data.includes('\n')) {
        const request: RequestType = JSON.parse(data)
        connection.write(JSON.stringify(this.proccessRequest(request)))
        connection.end()
        console.log(chalk.yellow('Client disconnected'))
      }
    })
  }

  /**
   * Method to process Client requests
   * @param request Request to process
   * @returns Response to the request
   * @private
   */
  private proccessRequest = (request: RequestType): ResponseType => {
    const user = new User(request.user)
    user.load()
    let response: ResponseType = { type: 'unknown', success: false }
    switch (request.type) {
      case 'add':
        response = this.processAdd(user, request.funkoPop)
        break
      case 'update':
        response = this.processUpdate(user, request.funkoPop)
        break
      case 'remove':
        response = this.processRemove(user, request.funkoPop)
        break
      case 'search':
        response = this.processSearch(user, request.funkoPop)
        break
      case 'list':
        response = this.processList(user)
        break
    }
    user.save()
    return response
  }

  /**
   * Method to process add requests
   * @param user User to add the FunkoPop
   * @param funkoPop FunkoPop to add
   * @returns Response to the request, success or failure
   * @private
   */
  private processAdd = (
    user: User,
    funkoPop: FunkoPop | undefined
  ): ResponseType => {
    if (funkoPop)
      return user.addFunko(funkoPop).includes('Already exists')
        ? { type: 'add', success: false }
        : { type: 'add', success: true }
    return { type: 'add', success: false }
  }

  /**
   * Method to process update requests
   * @param user User to be updated
   * @param funkoPop FunkoPop to update
   * @returns Response to the request, success or failure
   * @private
   */
  private processUpdate = (
    user: User,
    funkoPop: FunkoPop | undefined
  ): ResponseType => {
    if (funkoPop)
      return user
        .updateFunko(funkoPop)
        .includes(`not in ${user.name}'s collection`)
        ? { type: 'update', success: false }
        : { type: 'update', success: true }
    return { type: 'update', success: false }
  }

  /**
   * Method to process remove requests
   * @param user User to remove the FunkoPop
   * @param funkoPop FunkoPop to remove
   * @returns Response to the request, success or failure
   * @private
   */
  private processRemove = (
    user: User,
    funkoPop: FunkoPop | undefined
  ): ResponseType => {
    if (funkoPop)
      return user
        .removeFunko(funkoPop.id)
        .includes(`not in ${user.name}'s collection`)
        ? { type: 'remove', success: false }
        : { type: 'remove', success: true }
    return { type: 'remove', success: false }
  }

  /**
   * Method to process search requests
   * @param user User to search the FunkoPop
   * @param funkoPop FunkoPop to search
   * @returns Response to the request, success or failure
   * @private
   */
  private processSearch = (
    user: User,
    funkoPop: FunkoPop | undefined
  ): ResponseType => {
    if (funkoPop)
      return user
        .searchFunko(funkoPop.id)
        .includes(`not in ${user.name}'s collection`)
        ? { type: 'search', success: false }
        : { type: 'search', success: true, funkoPops: [funkoPop] }
    return { type: 'search', success: false }
  }

  /**
   * Method to process list requests
   * @param user User to list the FunkoPops
   * @returns Response to the request, success or failure
   */
  private processList = (user: User): ResponseType => {
    if (user.collection.length === 0) return { type: 'list', success: false }
    return { type: 'list', success: true, funkoPops: user.collection }
  }

  /**
   * Method to stop the server
   * @public
   */
  public stop(): void {
    this.server.close()
  }
}
new FunkoApp(3030)
