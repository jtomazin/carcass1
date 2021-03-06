'use strict'

let assert = require('chai').assert
let TOP_TESTS = {'sides': {}}
let { runTests } = require('./testing')

// also number of clockwise rotations
const TOP = 0
const RIGHT = 1
const BOTTOM = 2
const LEFT = 3

let SIDES = {
    TOP, RIGHT, BOTTOM, LEFT
}

let TO_DIRECTION = {
    [TOP]: [0, 1],
    [RIGHT]: [1, 0],
    [BOTTOM]: [0, -1],
    [LEFT]: [-1, 0]
}

let getAdjacent = (side) => _.map(
    [1, -1],
    (d) => (parseInt(side) + d) % 4
)

let Sides = {
    SIDES,
    getOpposite: (side) => (parseInt(side) + 2) % 4,
    getAdjacent,
    areAdjacent: (side1, side2) => getAdjacent(parseInt(side1)).includes(parseInt(side2)),
    toDirection: (side) => TO_DIRECTION[side]

}

module.exports = Sides

TOP_TESTS['sides'] = {
    'getOpposite': {
        'top': () => assert.equal(Sides.getOpposite(TOP), BOTTOM),
        'bottom': () => assert.equal(Sides.getOpposite(BOTTOM), TOP),
        'right': () => assert.equal(Sides.getOpposite(RIGHT), LEFT),
        'left': () => assert.equal(Sides.getOpposite(LEFT), RIGHT)
    }
}

runTests(() => TOP_TESTS)
