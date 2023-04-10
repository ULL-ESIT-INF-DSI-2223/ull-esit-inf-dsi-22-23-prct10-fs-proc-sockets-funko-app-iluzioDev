import chalk from 'chalk'

import { BasicFunkoPop } from './BasicFunkoPop.js'

import { FunkoType } from './FunkoType.js'
import { FunkoGenre } from './FunkoGenre.js'

/**
 * Interface for FunkoPop class.
 * Defines specific information of a Funko Pop, like brand, brandId, marketPrice and exclusive.
 */
export interface FunkoPopInfo {
  /**
   * Brand of the Funko Pop.
   * @type {string}
   */
  brand: string
  /**
   * Unique Id of the brand of the Funko Pop.
   * @type {number}
   */
  brandId: number
  /**
   * Market price of the Funko Pop.
   * @type {number}
   */
  marketPrice: number
  /**
   * Indicates if the Funko Pop is exclusive or not.
   * @type {boolean}
   */
  exclusive: boolean
  /**
   * Array of special features of the Funko Pop.
   * @type {string[]}
   */
  especial: string[]
}

/**
 * Class that represents a Funko Pop Product.
 * @see https://funko.com
 */
export class FunkoPop extends BasicFunkoPop implements FunkoPopInfo {
  /**
   * Indicates if the Funko Pop is exclusive or not.
   * @public
   * @type {boolean}
   */
  public exclusive = false

  /**
   * Array of special features of the Funko Pop.
   * @public
   * @type {string[]}
   */
  public especial: string[] = []

  /**
   * Initializes a new instance of the FunkoPop class.
   * @param name Name of the Funko Pop.
   * @param description Brief description of the Funko Pop.
   * @param type Type of the Funko Pop.
   * @param genre Genre of the Funko Pop.
   * @param brand Brand of the Funko Pop.
   * @param brandId Id in the brand of the Funko Pop.
   * @constructor
   * @example
   * ```typescript
   * const funkoPop = new FunkoPop(
   *  'Harry Potter',
   *  'Harry Potter Funko Pop! Vinyl Figure',
   *  FunkoType.POP,
   *  FunkoGenre.MOVIES_AND_TV,
   *  'Harry Potter',
   *  0,
   *
   * )
   */
  constructor(
    id: number,
    name: string,
    description: string,
    type: FunkoType,
    genre: FunkoGenre,
    public brand = '',
    public brandId = 0,
    public marketPrice = 0
  ) {
    super(id, name, description, type, genre)
  }

  /**
   * Method that prints the information of the Funko Pop.
   * @returns {void}
   * @example
   * ```typescript
   * const funkoPop = new FunkoPop(0, 'Harry Potter', 'Harry Potter Funko Pop! Vinyl Figure', FunkoType.POP, FunkoGenre.MOVIES_AND_TV, 'Harry Potter', 0)
   * FunkoPop.print(funkoPop)
   * ```
   */
  /* c8 ignore start */
  public static print(funko: FunkoPop): void {
    console.table({
      id: funko.id,
      name: funko.name,
      description: funko.description,
      type: funko.type,
      genre: funko.genre,
      brand: funko.brand,
      brandId: funko.brandId,
      exclusive: funko.exclusive,
      especial: funko.especial,
    })
    if (funko.marketPrice < 10)
      console.log(chalk.greenBright(`Market Price: $${funko.marketPrice}`))
    else if (funko.marketPrice < 20)
      console.log(chalk.green(`Market Price: $${funko.marketPrice}`))
    else if (funko.marketPrice < 30)
      console.log(chalk.yellow(`Market Price: $${funko.marketPrice}`))
    else console.log(chalk.redBright(`Market Price: $${funko.marketPrice}`))
  }
  /* c8 ignore stop */
}
