'use strict'

let assert = require('chai').assert
let TESTS = {}

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
    if (grid == null ) {
        grid = Grid()
        let openingPiece = Piece([
            'CCC',
            'RRR',
            'FFF'
        ])
        grid.set(0, 0, Tile(openingPiece, SIDES.TOP))
    }

    // True iff `piece` could be legally placed at (x, y, rotation)
    let isLegal = (piece, x, y, rotation) => {
        let neighbors = grid.getNeighbors(x, y)
        let tile = Tile(piece, rotation)
        return !_.isEmpty(neighbors) && _.every(
            _.map(neighbors, (otherTile, side) => {
                return tile.getSide(side) == otherTile.getSide(Sides.getOpposite(side))
            })
        )
    }
    TESTS['isLegal'] = {
        'road next to city': () => {
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

    // All {x, y} locations attached to the `terrain` at (x, y). Empty if no `terrain` at (x, y).
    // terrain - TERRAIN
    let getConnected = (x, y, type) => []

    
    return {
        isLegal,
        addTile
    }
}

module.exports = Board

if (require.main === module) {
    let { simpleRun } = require('./testing')
    Board() // necessary to populate TESTS
    simpleRun(TESTS)
}
