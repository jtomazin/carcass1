'use strict'

let assert = require('chai').assert
let TESTS = {}

let _ = require('lodash')

let Piece = require('./piece')
let Sides = require('./sides')
let SIDES = Sides.SIDES
let TERRAIN = require('./terrain')

/* Each tile is uniquely identified by 9 nodes representing the type of its
   corners, sides, and center. This is necessary because the connectivity of the
   pieces is important. For example, these three tiles differ by only one node
   but are different, legitimate pieces:
   
   cities       cities       weird
   unconnected  connected    piece
   F F C        F F C        F F C
   F F C        F C C        F C C
   C C C        C C C        C F C
   
   As a basic rule, edges matter for piece placement, and corners matter for connectivity

   `geography` - 3x3 array of TERRAIN
   `rotation` - SIDES
*/

let SIDE_TO_GRID_LOOKUP = {
    [SIDES.TOP]: [0, 1],
    [SIDES.RIGHT]: [1, 2],
    [SIDES.BOTTOM]: [2, 1],
    [SIDES.LEFT]: [1, 0]
}

let Tile = ({geography}, rotation) => {
    let getSide = (side) => {
        let rotatedSide = (parseInt(side) + rotation) % 4
        let [r, c] = SIDE_TO_GRID_LOOKUP[rotatedSide]
        return geography[r][c]
    }
    TESTS['getSide'] = {
        'should lookup sides correctly': () => {
            let piece = Piece([
                'CCC',
                'RRR',
                'FFF'
            ])
            let t = Tile(piece, SIDES.TOP)
            assert.equal(t.getSide(SIDES.TOP), TERRAIN.CITY)
            assert.equal(t.getSide(SIDES.RIGHT), TERRAIN.ROAD)
            assert.equal(t.getSide(SIDES.BOTTOM), TERRAIN.FIELD)
            assert.equal(t.getSide(SIDES.LEFT), TERRAIN.ROAD)
            return
        }
    }

    let getSides = () => _.fromPairs(
        _.values(SIDES).map((side) => [side, getSide(side)])
    )
    
    return {
        getSide,
        getSides
    }
}

module.exports = Tile

if (require.main === module) {
    let { simpleRun } = require('./testing')
    Tile({geography: []}) // necessary to populate TESTS
    simpleRun(TESTS)
}
