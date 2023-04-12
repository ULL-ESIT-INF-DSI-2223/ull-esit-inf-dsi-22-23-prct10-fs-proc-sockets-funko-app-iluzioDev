import { FunkoType } from './FunkoType.js'
import { FunkoGenre } from './FunkoGenre.js'

/**
 * Interface for BasicFunkoPop class.
 * Defines the basic information of a Funko Pop, like name, description, type and genre.
 */
export interface BasicFunkoPopInfo {
  /**
   * Unique id of the Funko Pop.
   * @type {number}
   */
  id: number
  /**
   * Name of the Funko Pop.
   * @type {string}
   */
  name: string
  /**
   * Brief description of the Funko Pop.
   * @type {string}
   */
  description: string
  /**
   * Type of the Funko Pop.
   * @type {FunkoType}
   */
  type: FunkoType
  /**
   * Genre of the Funko Pop.
   * @type {FunkoGenre}
   */
  genre: FunkoGenre
}

/**
 * Class that represents a Funko Pop Product.
 * Does not include the brand, brandId, marketPrice and exclusive properties.
 * @abstract
 */
export abstract class BasicFunkoPop implements BasicFunkoPopInfo {
  /**
   * Initializes a new instance of the BasicFunkoPop class.
   * @param name Name of the Funko Pop.
   * @param description Brief description of the Funko Pop.
   * @param type Type of the Funko Pop.
   * @param genre Genre of the Funko Pop.
   * @constructor
   */
  constructor(
    public readonly id: number,
    public name: string,
    public description: string,
    public type: FunkoType,
    public genre: FunkoGenre
  ) {}
}
