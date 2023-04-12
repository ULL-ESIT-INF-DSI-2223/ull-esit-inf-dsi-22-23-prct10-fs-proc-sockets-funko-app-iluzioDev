/**
 * Abstract class for the readers of files, both pipe and handler versions.
 */
export abstract class BasicReader {
  /**
   * Constructor of the class.
   * @param path Path of the file to read.
   */
  public constructor(protected path: string) {}
  /**
   * Method to read the number of lines of the file.
   */
  public abstract lines : (callback: (data: number | undefined) => void) => void;
  /**
   * Method to read the number of words of the file.
   */
  public abstract words : (callback: (data: number | undefined) => void) => void;
  /**
   * Method to read the number of characters of the file.
   */
  public abstract characters : (callback: (data: number | undefined) => void) => void;
}
