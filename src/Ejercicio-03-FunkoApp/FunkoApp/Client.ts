import net from 'net'
import chalk from 'chalk'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { FunkoPop } from '../Funko/FunkoPop.js'
import { RequestType, ResponseType } from './FunkoApp.js'
import { checkType, checkGenre, createFunko } from './Helpers.js'

/**
 * Options for the list command.
 */
interface UserOptions {
  user: string
}

/**
 * Options for the majority of the commands.
 */
interface BasicOptions {
  user: string
  id_: number
}

/**
 * Options for the add and update commands.
 */
interface Options extends BasicOptions {
  name: string
  desc: string
  type: string
  genre: string
  brand: string
  brandId: number
  price: number
  exclusive: boolean
}

/**
 * Fills an option object to be used in the yargs builder.
 * @param desc Description of the option.
 * @param tp Type of the option.
 * @param demand If the option is required or not.
 * @returns Option object.
 */
function FillOption(desc: string, tp: string, demand: boolean) {
  const option = {}
  Object.assign(option, {
    description: desc,
    type: tp,
    demandOption: demand,
  })
  return option
}

/**
 * Fill the user option for the list command.
 * @param yargs Yargs instance.
 * @returns Option object.
 */
const UserData = (yargs: yargs.Argv<UserOptions>) => {
  return yargs.option('user', FillOption('User name', 'string', true))
}

/**
 * Builder for the majority of the commands.
 * @param yargs Yargs instance.
 * @returns Builder Object.
 */
const BasicData = (yargs: yargs.Argv<BasicOptions>) => {
  return yargs
    .option('user', FillOption('User name', 'string', true))
    .option('id', FillOption('Funko ID', 'number', true))
}

/**
 * Builder for the add and update commands.
 * @param yargs Yargs instance.
 * @returns Builder Object.
 */
const FunkoData = (yargs: yargs.Argv<Options>) => {
  return yargs
    .option('user', FillOption('User name', 'string', true))
    .option('id', FillOption('Funko ID', 'number', true))
    .option('name', FillOption('Funko name', 'string', true))
    .option('desc', FillOption('Funko description', 'string', true))
    .option('type', FillOption('Funko type', 'string', true))
    .option('genre', FillOption('Funko genre', 'string', true))
    .option('brand', FillOption('Funko brand', 'string', true))
    .option('brandId', FillOption('Funko brand ID', 'number', true))
    .option('price', FillOption('Funko price', 'number', true))
    .option('exclusive', FillOption('Funko exclusive', 'boolean', false))
}

/**
 * Class that represents a client of the FunkoApp Server
 */
export class Client {
  /**
   * Socket to connect to the server
   * @type {net.Socket}
   * @public
   */
  public socket = new net.Socket()

  /**
   * Initializes the client
   * @param port Port to connect to
   * @public
   * @constructor
   */
  public constructor(
    public port = -1,
    public request: RequestType = { type: 'unknown', user: '' },
  ) {
    const commands = yargs(hideBin(process.argv))
      .command('add', 'Adds a funko', FunkoData, (argv) => {
        if (argv.type && !checkType(argv.type as string)) return
        if (argv.genre && !checkGenre(argv.genre as string)) return
        const funko = createFunko(argv)
        this.request = {
          user: argv.user as string,
          type: 'add',
          funkoPop: funko,
        }
      })
      .command('update', 'Updates a funko', FunkoData, (argv) => {
        if (argv.type && !checkType(argv.type as string)) return
        if (argv.genre && !checkGenre(argv.genre as string)) return

        const funko = createFunko(argv)
        this.request = {
          user: argv.user as string,
          type: 'update',
          funkoPop: funko,
        }
      })
      .command('remove', 'Removes a funko', BasicData, (argv) => {
        this.request = {
          user: argv.user as string,
          type: 'remove',
          id: argv.id as number,
        }
      })
      .command('list', 'Lists all funkos', UserData, (argv) => {
        this.request = {
          user: argv.user as string,
          type: 'list',
        }
      })
      .command('search', 'Searches for a funko', BasicData, (argv) => {
        this.request = {
          user: argv.user as string,
          type: 'search',
          id: argv.id as number,
        }
      })
      .help()

    if (process.argv.length > 2) commands.parse()
    else commands.showHelp()

    if (this.port < 0) console.log(chalk.red('Invalid port'))
    else if (this.port != 4000) this.connect(this.request, ((response) => {}))
  }

  /**
   * Method to connect to the server
   * @public
   */
  public connect(
    request: RequestType,
    callback: (response: ResponseType) => void
  ) {
    this.socket.connect(this.port, 'localhost', () => {
      console.log(chalk.blue(`Client connected to port ${this.port}`))
      this.proccessCommand(request, (response) => {
        if (response) {
          this.socket.end()
          callback(response)
        }
      })
    })
  }

  /**
   * Method to process the command
   * @param request Request to send to the server
   * @param callback Response callback
   * @private
   */
  private proccessCommand(
    request: RequestType,
    callback: (response: ResponseType | undefined) => void
  ) {
    if (request.type === 'unknown') {
      console.log(chalk.red('Unknown command'))
      callback(undefined)
    }
    console.log(
      chalk.blue(`Sending request to server: ${JSON.stringify(request)}`)
    )
    this.socket.write(JSON.stringify(request) + '\n')
    let data = ''
    this.socket.on('data', (chunk) => {
      data += chunk.toString()
    })
    this.socket.on('end', () => {
      const response: ResponseType = JSON.parse(data)
      switch (response.type) {
        case 'add':
          if (response.success)
            console.log(chalk.green('Funko added successfully'))
          else console.log(chalk.red('Already exists a funko with that ID'))
          break
        case 'update':
          if (response.success)
            console.log(chalk.green('Funko updated successfully'))
          else console.log(chalk.red('There is no funko with that ID'))
          break
        case 'remove':
          if (response.success)
            console.log(chalk.green('Funko removed successfully'))
          else console.log(chalk.red('There is no funko with that ID'))
          break
        case 'list':
          if (response.success) {
            if (response.funkoPops === undefined) return
            response.funkoPops.forEach((funko) => {
              FunkoPop.print(funko)
            })
          } else console.log(chalk.red('There are no funkos'))
          break
        case 'search':
          if (response.success) {
            if (response.funkoPops === undefined) return
            FunkoPop.print(response.funkoPops[0])
          } else console.log(chalk.red('There is no funko with that ID'))
          break
        default:
          console.log(chalk.red('Invalid response'))
      }
      callback(response)
    })
  }
}
new Client(3030)
