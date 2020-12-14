'use strict'

let assert = require('chai').assert
let TESTS = {}

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

let Sides = {
    SIDES,
    getOpposite: (side) => (parseInt(side) + 2) % 4,
    toDirection: (side) => TO_DIRECTION[side]
}

module.exports = Sides

TESTS = {
    'getOpposite': {
        'top': () => assert.equal(Sides.getOpposite(TOP), BOTTOM),
        'bottom': () => assert.equal(Sides.getOpposite(BOTTOM), TOP),
        'right': () => assert.equal(Sides.getOpposite(RIGHT), LEFT),
        'left': () => assert.equal(Sides.getOpposite(LEFT), RIGHT)
    }
}

if (require.main === module) {
    let { simpleRun } = require('./testing')
    simpleRun(TESTS)
}
