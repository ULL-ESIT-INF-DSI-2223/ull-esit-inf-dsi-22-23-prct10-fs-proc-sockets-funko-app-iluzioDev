import fs from 'fs'
import chalk from 'chalk'

import { FunkoPop } from '../Funko/FunkoPop.js'

/**
 * Interface that represents the information of a User of the Funko App.
 */
export interface UserInfo {
  /**
   * Name of the User.
   * @type {string}
   */
  name: string
  /**
   * Collection of Funko Pops of the User.
   * @type {FunkoPop[]}
   */
  collection: FunkoPop[]
  /**
   * Method that adds a Funko Pop to the User's collection.
   * @param funkoPop Funko Pop to add to the User's collection.
   * @returns {string} Message that indicates if the Funko Pop was added to the User's collection or not.
   */
  addFunko(funkoPop: FunkoPop): string
  /**
   * Method that modifies a Funko Pop in the User's collection.
   * @param funkoPop Funko Pop to modify in the User's collection.
   * @returns {string} Message that indicates if the Funko Pop was modified in the User's collection or not.
   */
  updateFunko(funkoPop: FunkoPop): string
  /**
   * Method that removes a Funko Pop from the User's collection.
   * @param id ID of the Funko Pop to remove from the User's collection.
   * @returns {string} Message that indicates if the Funko Pop was removed from the User's collection or not.
   */
  removeFunko(id: number): string
  /**
   * Method that prints the collection of Funko Pops of the User.
   * @returns {void}
   */
  listFunkos(): void
  /**
   * Method that searches a Funko Pop in the User's collection.
   * @param id ID of the Funko Pop to search in the User's collection.
   * @returns {string} Message that indicates if the Funko Pop was found in the User's collection or not.
   */
  searchFunko(id: number): string
  /**
   * Method that saves the User's collection in a JSON file.
   * @returns {void}
   */
  save(): void
  /**
   * Method that loads the User's collection from a JSON file.
   * @returns {void}
   */
  load(): void
}

/**
 * Class that represents a User of the Funko App.
 * All users can add, remove, search and list their Funko Pops.
 */
export class User implements UserInfo {
  /**
   * Collection of Funko Pops of the User.
   * @public
   * @type {FunkoPop[]}
   */
  public collection: FunkoPop[]

  /**
   * Initializes a new instance of the User class.
   * @param name Name of the User.
   * @param funkoPops Collection of Funko Pops of the User.
   */
  constructor(public readonly name: string, ...funkoPops: FunkoPop[]) {
    this.collection = funkoPops
  }

  /**
   * Method that adds a Funko Pop to the User's collection.
   * @param funkoPop Funko Pop to add to the User's collection.
   * @returns Message that indicates if the Funko Pop was added to the User's collection or not.
   * @example
   * ```typescript
   * const funkoPop = new FunkoPop(0, 'Funko Pop 1', 'Description 1', 'Type 1', 'Genre 1', 'Brand 1', 0)
   * const funkoPop2 = new FunkoPop(1, 'Funko Pop 2', 'Description 2', 'Type 2', 'Genre 2', 'Brand 2', 1)
   * const user = new User('User 1', funkoPop)
   * const message = user.addFunko(funkoPop2)
   * const message2 = user.addFunko(funkoPop)
   * ```
   */
  public addFunko(funkoPop: FunkoPop): string {
    const notSameId = this.collection.filter((f) => f.id !== funkoPop.id)
    if (notSameId.length !== this.collection.length)
      return chalk.red(
        `Already exists a Funko Pop with id ${funkoPop.id} in ${this.name}'s collection`
      )
    this.collection.push(funkoPop)
    return chalk.green(`${funkoPop.name} added to ${this.name}'s collection`)
  }

  /**
   * Method that modifies a Funko Pop in the User's collection.
   * @param funkoPop Funko Pop to modify in the User's collection.
   * @returns Message that indicates if the Funko Pop was modified in the User's collection or not.
   * @example
   * ```typescript
   * const funkoPop = new FunkoPop(0, 'Funko Pop 1', 'Description 1', 'Type 1', 'Genre 1', 'Brand 1', 0)
   * const funkoPop2 = new FunkoPop(1, 'Funko Pop 2', 'Description 2', 'Type 2', 'Genre 2', 'Brand 2', 1)
   * const user = new User('User 1', funkoPop)
   * const message = user.updateFunko(funkoPop2)
   * const message2 = user.updateFunko(funkoPop)
   */
  public updateFunko(funkoPop: FunkoPop): string {
    const notSameId = this.collection.filter((f) => f.id !== funkoPop.id)
    if (notSameId.length === this.collection.length)
      return chalk.red(
        `Funko Pop with id ${funkoPop.id} not in ${this.name}'s collection`
      )
    this.collection = this.collection.map((f) =>
      f.id === funkoPop.id ? funkoPop : f
    )
    return chalk.green(
      `Funko Pop with id ${funkoPop.id} modified in ${this.name}'s collection`
    )
  }

  /**
   * Method that removes a Funko Pop from the User's collection.
   * @param id ID of the Funko Pop to remove from the User's collection.
   * @returns Message that indicates if the Funko Pop was removed from the User's collection or not.
   * @example
   * ```typescript
   * const funkoPop = new FunkoPop(0, 'Funko Pop 1', 'Description 1', 'Type 1', 'Genre 1', 'Brand 1', 0)
   * const funkoPop2 = new FunkoPop(1, 'Funko Pop 2', 'Description 2', 'Type 2', 'Genre 2', 'Brand 2', 1)
   * const user = new User('User 1', funkoPop, funkoPop2)
   * const message = user.removeFunko(0)
   * const message2 = user.removeFunko(1)
   */
  public removeFunko(id: number): string {
    const notSameId = this.collection.filter((f) => f.id !== id)
    if (notSameId.length === this.collection.length)
      return chalk.red(
        `Funko Pop with id ${id} not in ${this.name}'s collection`
      )
    this.collection = notSameId
    return chalk.green(
      `Funko Pop with id ${id} removed from ${this.name}'s collection`
    )
  }

  /**
   * Method that searches a Funko Pop in the User's collection.
   * @param id ID of the Funko Pop to search in the User's collection.
   * @returns Message that indicates if the Funko Pop was found in the User's collection or not.
   * @example
   * ```typescript
   * const funkoPop = new FunkoPop(0, 'Funko Pop 1', 'Description 1', 'Type 1', 'Genre 1', 'Brand 1', 0)
   * const funkoPop2 = new FunkoPop(1, 'Funko Pop 2', 'Description 2', 'Type 2', 'Genre 2', 'Brand 2', 1)
   * const user = new User('User 1', funkoPop)
   * const message = user.searchFunko(0)
   * const message2 = user.searchFunko(1)
   */
  public searchFunko(id: number): string {
    const notSameId = this.collection.filter((f) => f.id !== id)
    if (notSameId.length === this.collection.length)
      return chalk.red(
        `Funko Pop with id ${id} not in ${this.name}'s collection`
      )

    const result = this.collection.find((f) => f.id === id)
    if (result) FunkoPop.print(result)
    return chalk.green(
      `Funko Pop with id ${id} found in ${this.name}'s collection`
    )
  }

  /**
   * Method that prints the collection of Funko Pops of the User.
   * @returns {void}
   * @example
   * ```typescript
   * const funkoPop = new FunkoPop(0, 'Funko Pop 1', 'Description 1', 'Type 1', 'Genre 1', 'Brand 1', 0)
   * const funkoPop2 = new FunkoPop(1, 'Funko Pop 2', 'Description 2', 'Type 2', 'Genre 2', 'Brand 2', 1)
   * const user = new User('User 1', funkoPop, funkoPop2)
   * user.listFunkos()
   * ```
   */
  /* c8 ignore start */
  public listFunkos(): void {
    this.collection.forEach((funkoPop) => FunkoPop.print(funkoPop))
  }
  /* c8 ignore stop */

  /**
   * Method that loads the User's collection from JSON files inside the user folder.
   * @returns {void}
   */
  /* c8 ignore start */
  public load(): void {
    if (!fs.existsSync('./data')) fs.mkdirSync('./data')
    const name = this.name.replace(/ /g, '_')
    if (!fs.existsSync(`./data/${name}`)) {
      fs.mkdirSync(`./data/${name}`)
      return
    }
    fs.readdirSync(`./data/${name}`).forEach((file) => {
      if (file.match(/Funko-\d+.json/)) {
        if (file !== undefined) {
          const fd = fs.readFileSync(`./data/${name}/${file}`, 'utf8')
          const funkoPop = JSON.parse(fd)
          this.collection.push(
            new FunkoPop(
              funkoPop.id,
              funkoPop.name,
              funkoPop.description,
              funkoPop.type,
              funkoPop.genre,
              funkoPop.brand,
              funkoPop.brandId,
              funkoPop.marketPrice,
              funkoPop.exclusive,
              funkoPop.especial
            )
          )
        }
      }
    })
  }
  /* c8 ignore stop */

  /**
   * Method that saves the User's collection in a JSON file for each Funko Pop.
   * @returns {void}
   */
  /* c8 ignore start */
  public save(): void {
    this.collection.sort((a, b) => (a.id < b.id ? -1 : 1))
    const name = this.name.replace(/ /g, '_')
    for (const funkoPop of this.collection) {
      const data = JSON.stringify(funkoPop)
      fs.writeFileSync(`./data/${name}/Funko-${funkoPop.id}.json`, data)
    }
  }
  /* c8 ignore stop */
}
