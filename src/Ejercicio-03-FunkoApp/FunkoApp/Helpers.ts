import chalk from 'chalk'
import yargs from 'yargs'

import { FunkoType } from '../Funko/FunkoType.js'
import { FunkoGenre } from '../Funko/FunkoGenre.js'
import { FunkoPop } from '../Funko/FunkoPop.js'

/**
 * Checks if a string belongs to the FunkoType enum.
 * @param type Type to check.
 * @returns True if the string belongs to the FunkoType enum, false otherwise.
 */
export function checkType(type: string): boolean {
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
export function checkGenre(genre: string): boolean {
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
export function createFunko(argv: yargs.Arguments) {
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
