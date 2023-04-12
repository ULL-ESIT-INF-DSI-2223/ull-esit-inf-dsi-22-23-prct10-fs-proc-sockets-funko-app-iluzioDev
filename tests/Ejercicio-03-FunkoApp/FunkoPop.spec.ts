import 'mocha'
import { expect } from 'chai'

import { FunkoType } from '../../src/Ejercicio-03-FunkoApp/Funko/FunkoType.js'
import { FunkoGenre } from '../../src/Ejercicio-03-FunkoApp/Funko/FunkoGenre.js'
import { FunkoPop } from '../../src/Ejercicio-03-FunkoApp/Funko/FunkoPop.js'

const Oswald_The_Lucky_Rabbit = new FunkoPop(
  0,
  'Oswald The Lucky Rabbit',
  'First character of Walt Disney',
  FunkoType.POP_BLACK_AND_WHITE,
  FunkoGenre.ANIMATION,
  'Disney',
  0
)

describe('Funko class tests', () => {
  it('Funkos should have different types and genres', () => {
    expect(FunkoType).to.be.a('object')
    expect(FunkoGenre).to.be.a('object')
  })
  it('Funkos should have an unique id', () => {
    expect(Oswald_The_Lucky_Rabbit.id).to.be.a('number')
    expect(Oswald_The_Lucky_Rabbit.id).to.equal(0)
  })
  it('Funkos should have a name', () => {
    expect(Oswald_The_Lucky_Rabbit.name).to.be.a('string')
    expect(Oswald_The_Lucky_Rabbit.name).to.equal('Oswald The Lucky Rabbit')
  })
  it('Funkos should have a description', () => {
    expect(Oswald_The_Lucky_Rabbit.description).to.be.a('string')
    expect(Oswald_The_Lucky_Rabbit.description).to.equal(
      'First character of Walt Disney'
    )
  })
  it('Funkos should have a type', () => {
    expect(Oswald_The_Lucky_Rabbit.type).to.be.a('string')
    expect(Oswald_The_Lucky_Rabbit.type).to.equal(FunkoType.POP_BLACK_AND_WHITE)
  })
  it('Funkos should have a genre', () => {
    expect(Oswald_The_Lucky_Rabbit.genre).to.be.a('string')
    expect(Oswald_The_Lucky_Rabbit.genre).to.equal(FunkoGenre.ANIMATION)
  })
  it('Funkos should have a brand', () => {
    expect(Oswald_The_Lucky_Rabbit.brand).to.be.a('string')
    expect(Oswald_The_Lucky_Rabbit.brand).to.equal('Disney')
  })
  it('Funkos should have an unique id in their brand', () => {
    expect(Oswald_The_Lucky_Rabbit.brandId).to.be.a('number')
    expect(Oswald_The_Lucky_Rabbit.brandId).to.equal(0)
  })
  it('Funkos should have a Market Price', () => {
    Oswald_The_Lucky_Rabbit.marketPrice = 20
    expect(Oswald_The_Lucky_Rabbit.marketPrice).to.be.a('number')
    expect(Oswald_The_Lucky_Rabbit.marketPrice).to.equal(20)
  })
  it('Funkos can be exclusive', () => {
    Oswald_The_Lucky_Rabbit.exclusive = true
    expect(Oswald_The_Lucky_Rabbit.exclusive).to.be.a('boolean')
    expect(Oswald_The_Lucky_Rabbit.exclusive).to.equal(true)
  })
})
