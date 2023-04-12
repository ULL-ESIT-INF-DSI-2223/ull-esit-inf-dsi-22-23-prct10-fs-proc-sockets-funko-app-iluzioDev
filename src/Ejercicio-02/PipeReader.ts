import fs from 'fs'
import { spawn } from 'child_process'
import { BasicReader } from './BasicReader.js'

/**
 * Class for the pipe version of the reader of files.
 */
export class PipeReader extends BasicReader {
  /**
   * Initializes the path of the file to read.
   * @param path
   */
  public constructor(protected path: string) {
    super(path)
  }

  /**
   * Method to read the number of lines of the file.
   * @returns Void.
   * @override
   * @see BasicReader.lines
   * @example
   * ```typescript
   * const read = new PipeReader('file.txt')  /// file.txt: 1 line, 8 words, 40 characters
   * read.lines((l) => {
   *  if (l)
   *    console.log(l)                      /// 8
   *  else
   *    console.log('Error')                /// Error
   * })
   * ```
   */
  public lines = (callback: (data: number | undefined) => void): void => {
    if (!fs.existsSync(this.path)) {
      callback(undefined)
      return
    }
    const wc = spawn('wc', ['-l', this.path])
    // wc.stdout.pipe(process.stdout)
    let output = ''
    wc.stdout.on('data', (chunk) => {
      output += chunk.toString()
    })
    wc.on('exit', () => {
      callback(parseInt(output.split(' ')[0]))
    })
  }

  /**
   * Method to read the number of words of the file.
   * @returns Void.
   * @override
   * @see BasicReader.words
   * @example
   * ```typescript
   * const read = new PipeReader('file.txt')  /// file.txt: 1 line, 8 words, 40 characters
   * read.words((w) => {
   *  if (w)
   *    console.log(w)                      /// 8
   *  else
   *    console.log('Error')                /// Error
   * })
   * ```
   */
  public words = (callback: (data: number | undefined) => void): void => {
    if (!fs.existsSync(this.path)) {
      callback(undefined)
      return
    }
    const wc = spawn('wc', ['-w', this.path])
    // wc.stdout.pipe(process.stdout)
    let output = ''
    wc.stdout.on('data', (chunk) => {
      output += chunk.toString()
    })
    wc.on('exit', () => {
      callback(parseInt(output.split(' ')[0]))
    })
  }

  /**
   * Method to read the number of characters of the file.
   * @returns Void.
   * @override
   * @see BasicReader.characters
   * @example
   * ```typescript
   * const read = new PipeReader('file.txt')  /// file.txt: 1 line, 8 words, 40 characters
   * read.characters((chars) => {
   *  if (chars)
   *    console.log(chars)                 /// 40
   *  else
   *    console.log('Error')               /// Error
   * })
   * ```
   */
  public characters = (callback: (data: number | undefined) => void): void => {
    if (!fs.existsSync(this.path)) {
      callback(undefined)
      return
    }
    const wc = spawn('wc', ['-m', this.path])
    // wc.stdout.pipe(process.stdout)
    let output = ''
    wc.stdout.on('data', (chunk) => {
      output += chunk.toString()
    })
    wc.on('exit', () => {
      callback(parseInt(output.split(' ')[0]))
    })
  }
}
