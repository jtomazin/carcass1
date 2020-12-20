'use strict'

let TERRAIN = require('./terrain')

let _ = require('lodash')

let CORNER_INDICES = [
    [0, 0],  [0, 1],
    [2, 0],  [2, 2]
]

let TERRAIN_SHORTHAND = {
    'F': TERRAIN.FIELD,
    'C': TERRAIN.CITY,
    'R': TERRAIN.ROAD,
    '~': TERRAIN.RIVER
}

/* An unplaced tile piece.
   geography - TYPES[3][3]
*/
let Piece = (geography) => {
    let constraints = {
        'no roads in corners': () => !_.some(
            _.map(CORNER_INDICES, ([r, c]) => geography[r][c] == TERRAIN.ROAD)
        )
    }
    let errMsg = _.map(constraints, (c, name) => c() ? '' : name).join('\n')
    if (!_.isEmpty(errMsg)) {
        throw new Error('Invalid geography: \n' + errMsg)
    }

    if (_.isString(geography[0])) {
        geography = geography.map(
            (row) => row.split('').map((c) => TERRAIN_SHORTHAND[c.toUpperCase()])
        )
    }

    // TODO true iff exists some rotation where geographies are the same
    let equals = () => false

    return {
        geography
    }
}

module.exports = Piece
