import chalk from 'chalk'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { FunkoType } from './Funko/FunkoType.js'
import { FunkoGenre } from './Funko/FunkoGenre.js'
import { FunkoPop } from './Funko/FunkoPop.js'

import { User } from './User/User.js'

/**
 * Checks if a string belongs to the FunkoType enum.
 * @param type Type to check.
 * @returns True if the string belongs to the FunkoType enum, false otherwise.
 */
function checkType(type: string): boolean {
  if (Object.values(FunkoType).indexOf(type as FunkoType) === -1) {
    console.log(chalk.red('Invalid type'))
    return false
  }
  return true
}

/**
 * Checks if a string belongs to the FunkoGenre enum.
 * @param genre Genre to check.
 * @returns True if the string belongs to the FunkoGenre enum, false otherwise.
 */
function checkGenre(genre: string): boolean {
  if (Object.values(FunkoGenre).indexOf(genre as FunkoGenre) === -1) {
    console.log(chalk.red('Invalid genre'))
    return false
  }
  return true
}

/**
 * Creates a FunkoPop object from the command line arguments.
 * @param argv Arguments from the command line.
 * @returns New FunkoPop object.
 */
function createFunko(argv: yargs.Arguments) {
  return new FunkoPop(
    argv.id as number,
    argv.name as string,
    argv.desc as string,
    argv.type as FunkoType,
    argv.genre as FunkoGenre,
    argv.brand as string,
    argv.brandId as number,
    argv.price as number
  )
}

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
}

/**
 * Main function of the Funko Pop app.
 */
function main() {
  /**
   * Handler for the Funko Pop app commands.
   * It has the following commands:
   * - add: Adds a Funko Pop to the User's collection.
   * - update: Updates a Funko Pop in the User's collection.
   * - remove: Removes a Funko Pop from the User's collection.
   * - list: Lists all the Funko Pops in the User's collection.
   * - search: Searches for a Funko Pop in the User's collection.
   */
  const commands = yargs(hideBin(process.argv))
    .command('add', 'Adds a funko', FunkoData, (argv) => {
      if (argv.type && !checkType(argv.type as string)) return
      if (argv.genre && !checkGenre(argv.genre as string)) return

      const user = new User(argv.user as string)
      const funkoPop = createFunko(argv)
      user.load()
      console.log(user.addFunko(funkoPop))
      user.save()
    })
    .command('update', 'Updates a funko', FunkoData, (argv) => {
      if (argv.type && !checkType(argv.type as string)) return
      if (argv.genre && !checkGenre(argv.genre as string)) return

      const user = new User(argv.user as string)
      const funkoPop = createFunko(argv)
      user.load()
      console.log(user.updateFunko(funkoPop))
      user.save()
    })
    .command('remove', 'Removes a funko', BasicData, (argv) => {
      const user = new User(argv.user as string)
      user.load()
      console.log(user.removeFunko(argv.id as number))
      user.save()
    })
    .command('list', 'Lists all funkos', UserData, (argv) => {
      const user = new User(argv.user as string)
      user.load()
      user.listFunkos()
    })
    .command('search', 'Searches for a funko', BasicData, (argv) => {
      const user = new User(argv.user as string)
      user.load()
      console.log(user.searchFunko(argv.id as number))
    })
    .help()
  if (commands.argv) return 0
  else return 1
}

main()
