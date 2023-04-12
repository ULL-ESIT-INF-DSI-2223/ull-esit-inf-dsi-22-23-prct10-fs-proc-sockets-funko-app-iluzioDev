import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { BasicReader } from './BasicReader.js'
import { PipeReader } from './PipeReader.js'
import { HandlerReader } from './HandlerReader.js'

/**
 * Options for the program
 */
interface Options {
  path: string
  lines: boolean
  words: boolean
  characters: boolean
  handler: boolean
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
 * Fill the options to read the file.
 * @param yargs Yargs instance.
 * @returns Option object.
 */
const ReadData = (yargs: yargs.Argv<Options>) => {
  return yargs
    .option('path', FillOption('Path of the text file', 'string', true))
    .option('lines', FillOption('Read the number of lines', 'boolean', false))
    .option('words', FillOption('Read the number of words', 'boolean', false))
    .option(
      'characters',
      FillOption('Read the number of characters', 'boolean', false)
    )
    .option(
      'handler',
      FillOption(
        'Use the handler version of the reader (Default option is Pipe Version)',
        'boolean',
        false
      )
    )
}

/**
 * Tests the reader.
 * @param reader PipeReader or HandlerReader.
 * @param lines Lines option.
 * @param words Words option.
 * @param characters Characters option.
 */
function test(
  reader: BasicReader,
  lines: boolean,
  words: boolean,
  characters: boolean
) {
  if (lines)
    reader.lines((l) => {
      if (l) console.log(`Number of lines: ${l}`)
      else console.log('Error reading the file')
    })
  if (words)
    reader.words((w) => {
      if (w) console.log(`Number of words: ${w}`)
      else console.log('Error reading the file')
    })
  if (characters)
    reader.characters((c) => {
      if (c) console.log(`Number of characters: ${c}`)
      else console.log('Error reading the file')
    })
}

/**
 * Main function of the Funko Pop app.
 */
function main() {
  const commands = yargs(hideBin(process.argv))
    .command('read-info', 'Read the info of a file', ReadData, (argv) => {
      if (argv.handler)
        test(
          new HandlerReader(argv.path as string),
          argv.lines as boolean,
          argv.words as boolean,
          argv.characters as boolean
        )
      else
        test(
          new PipeReader(argv.path as string),
          argv.lines as boolean,
          argv.words as boolean,
          argv.characters as boolean
        )
    })
    .help()
  if (commands.argv) return 0
  else return 1
}

main()
