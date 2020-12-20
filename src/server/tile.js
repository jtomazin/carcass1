'use strict'

let assert = require('chai').assert
let TOP_TESTS = {'tile': {}}
let TESTS = TOP_TESTS['tile']
let { runTests } = require('./testing')

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

/* this is not actually correct. there are two distinct tiles with this geography:
   F R F
   R R R
   F R F
   - 4 way intersection, all roads terminating in the center
   - 2 perpendicular roads, one crossing over the other with a bridge

   or maybe, we could do this for the former case?
   F R F
   R F R
   F R F
*/


let SIDE_TO_GRID_LOOKUP = {
    [SIDES.TOP]: [0, 1],
    [SIDES.RIGHT]: [1, 2],
    [SIDES.BOTTOM]: [2, 1],
    [SIDES.LEFT]: [1, 0]
}

// sides must be adjacent. throws otherwise
let getCornerLookup = (side1, side2) => {
    if (!Sides.isAdjacent(side1, side2)) {
        throw new Error('given sides were not adjacent')
    }
    let SIDE_TO_GRID_ROW = {
        [SIDES.TOP]: 0,
        [SIDES.BOTTOM]: 2
    }
    let SIDE_TO_GRID_COL = {
        [SIDES.LEFT]: 0,
        [SIDES.RIGHT]: 2
    }
    // TODO nicer number -> string conversion?
    let rowSide = _.keys(SIDE_TO_GRID_ROW).includes('' + side1) ? side1 : side2
    let colSide = _.keys(SIDE_TO_GRID_COL).includes('' + side1) ? side1 : side2
    return [rowLookup[rowSide], colLookup[colSide]]
}

let Tile = ({geography}, rotation = SIDES.TOP, occupation = undefined) => {
    // TERRAIN at SIDE
    let getTerrain = (side) => {
        let rotatedSide = (parseInt(side) + rotation) % 4
        let [r, c] = SIDE_TO_GRID_LOOKUP[rotatedSide]
        return geography[r][c]
    }
    TESTS['getTerrain'] = {
        'should lookup sides correctly': () => {
            let piece = Piece([
                'CCC',
                'RRR',
                'FFF'
            ])
            let t = Tile(piece, SIDES.TOP)
            assert.equal(t.getTerrain(SIDES.TOP), TERRAIN.CITY)
            assert.equal(t.getTerrain(SIDES.RIGHT), TERRAIN.ROAD)
            assert.equal(t.getTerrain(SIDES.BOTTOM), TERRAIN.FIELD)
            assert.equal(t.getTerrain(SIDES.LEFT), TERRAIN.ROAD)
            return
        }
    }

    // Map of SIDE to TERRAIN
    let getAllTerrain = () => _.fromPairs(
        _.values(SIDES).map((side) => [side, getTerrain(side)])
    )

    let getCornerTerrain = (side1, side2) => _.get(geography, getCornerLookup(side1, side2))

    // list of SIDEs connected to the feature on `side` (inclusive)
    let getConnectedSides = (side) => {
        /*
          F
          F C C   insufficient to determine the tile;
          F     could be either of:

          F F C    C F C
          F C C    F C C
          C F C    F F C

          a side is connected to another side if they are part of
          continuous path of TERRAIN within the tile?


          C F F  F F C
          C C F  F C C
          C F C  C F C

          C C C
          C F C  none of these city sides are connected
          C C C


          - if the center is TERRAIN, any sides with TERRAIN are connected (not
          true for the bridge road piece)
          - if a side is FIELD, another side is connected if it is adjacent
          and the shared corner is FIELD
        */
        let terrain = getTerrain(side)
        let centerTerrain = geography[1][1]
        if (terrain == centerTerrain) {
            return _.keys(_.pickBy(
                getAllTerrain(),
                (otherTerrain, otherSide) => terrain == otherTerrain
            ))
        }
        if (terrain == TERRAIN.FIELD) {
            // TODO: i don't think there are any tiles that have connected fields on
            // opposite sides WITHOUT having field in the middle. this should be audited.
            let FIELD = TERRAIN.FIELD
            return [
                side,
                ..._.filter(
                    Sides.getAdjacent(side),
                    (aSide) => (getTerrain(aSide) == FIELD &&
                                getCornerTerrain(side, aSide) == FIELD)
                )
            ]
        }
        return [side]
    }

    return {
        getTerrain,
        getAllTerrain,
        geography: () => geography,
        getConnectedSides
    }
}

module.exports = Tile

runTests(() => {
    Tile({geography: []}) // necessary to populate TESTS
    return TOP_TESTS
})
