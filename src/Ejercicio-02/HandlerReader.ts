import fs, { createReadStream } from 'fs'
import { BasicReader } from './BasicReader.js'

/**
 * Class for the handler version of the reader of files.
 */
export class HandlerReader extends BasicReader {
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
    const readStream = fs.createReadStream(this.path, 'utf8')
    let lines = 0
    readStream.on('data', (chunk) => {
      lines += chunk.toString().split(/\r\n|\r|\n/).length - 1
    })
    readStream.on('end', () => {
      callback(lines)
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
    const readStream = fs.createReadStream(this.path, 'utf8')
    let words = 0
    readStream.on('data', (chunk) => {
      words += chunk.toString().replace(/\s+/g, '\n').split(/\n/).length - 1
    })
    readStream.on('end', () => {
      callback(words)
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
    const readStream = createReadStream(this.path, 'utf8')
    let characters = 0
    readStream.on('data', (chunk) => {
      characters += chunk.toString().length
    })
    readStream.on('end', () => {
      callback(characters)
    })
  }
}
