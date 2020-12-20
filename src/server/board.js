'use strict'

let assert = require('chai').assert
let TOP_TESTS = {'board': {}}
let TESTS = TOP_TESTS['board']
let { runTests } = require('./testing')

let _ = require('lodash')

let Grid = require('./grid')
let Tile = require('./tile')
let Sides = require('./sides')
let SIDES = Sides.SIDES
let Piece = require('./piece')
let TERRAIN = require('./terrain')


/* Entry point for querying and updating game state.
   Supports two fundamental operations:
   - given a tile, is a given (x,y,tile,rotation) legal to play
   - given an (x,y,type), what are all the (x,y) locations attached to that one
*/
let Board = (grid = undefined) => {

    // initialization
    let openingPiece = Piece([
        'CCC',
        'RRR',
        'FFF'
    ])
    if (grid == null) {
        grid = Grid().set(0, 0, Tile(openingPiece, SIDES.TOP))
    }
    let dump = () => grid.getGrid()

    TESTS['initialization'] = {
        'openingPiece': () => {
            assert.deepEqual(Board().dump()[0][0].geography(), openingPiece.geography)
        }
    }

    // True iff `piece` could be legally placed at (x, y, rotation)
    let isLegal = (piece, x, y, rotation) => {
        let neighbors = grid.getNeighbors(x, y)
        let tile = Tile(piece, rotation)
        return !_.isEmpty(neighbors) && _.every(
            _.map(neighbors, (otherTile, side) => {
                return tile.getTerrain(side) == otherTile.getTerrain(Sides.getOpposite(side))
            })
        )
    }
    TESTS['isLegal'] = {
        'legal - road next to city': () => {
            let piece = Piece([
                'FFF',
                'RRR',
                'FFF'
            ])
            assert.isTrue(Board().isLegal(piece, 1, 0, SIDES.TOP))
            return
        }
    }

    let addTile = (piece, x, y, rotation) => {
        if (isLegal(piece, x, y, rotation)) {
            return Board(grid.set(x, y, Tile(piece, rotation)))
        } else {
            return false
        }
    }

    // helper method to determine if the feature on the `featureSide` of
    // `tile` is connected to the `otherTile` on `side` of `tile`
    let isConnectedTo = (tile, featureSide) => (otherTile, side) =>
        (tile.getConnectedSides(featureSide).includes(side) &&
         tile.getTerrain(featureSide) == otherTile.getTerrain(Sides.getOpposite(side)))

    /* a note on feature lookups: the same feature can be referred to
       multiple ways. for example, in the tile

       F F C      both BOTTOM and RIGHT refer to the same city,
       F C C      as would any city part of another tile connected to it
       C C C
    */

    let sideToXY = (x, y) => (side) => {
        let [dx, dy] = Sides.toDirection(side)
        return [x + dx, y + dy]
    }

    // All {x, y} locations of tiles with features attached to the
    // feature on the `side` of the tile at (x, y).
    let getConnected = (x, y, startSide, explored = new Set()) => {
        let tile = grid.get(x, y)
        if (tile == null) {
            return []
        }
        let terrain = tile.getTerrain(startSide)
        let neighbors = grid.getNeighbors(x, y)
        let isConnected = isConnectedTo(tile, startSide)

        return _.flatten(_.map(
            tile.getConnectedSides(startSide),
            (side) => {
                let otherTile = neighbors[side]
                if (explored.has(otherTile)) {
                    return []
                }
                if (isConnected(otherTile, side)) {
                    explored.add(otherTile)
                    let [otherX, otherY] = sideToXY(x, y)(side)
                    return [
                        {x: otherX, y: otherY},
                        ...getConnected(otherX, otherY, Sides.getOpposite(side), explored)
                    ]
                }
            }
        ))
    }
    TESTS['getConnected'] = {
        'cities': () => assert.sameDeepMembers(
            Board(Grid({
                0: {
                    0: Tile(openingPiece),
                    1: Tile(Piece([
                        'FFC',
                        'FCC',
                        'CCC'
                    ]))
                },
                1: {
                    0: Tile(Piece([
                        'FFF',
                        'RRR',
                        'FFF'
                    ])),
                    1: Tile(Piece([
                        'CFF',
                        'CFF',
                        'CFF'
                    ]))
                }
            })).getConnected(0, 0, SIDES.TOP),
            [{x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}]
        )
    }

// [{x, y, rotation}] of all possible placements of `piece`
let getAvailableMoves = (piece) => []

return {
    isLegal,
    addTile,
    getConnected,
    dump
}
}

module.exports = Board

runTests(() => {
    Board() // necessary to populate TESTS
    return TOP_TESTS
})
