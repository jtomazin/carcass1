'use strict'

_ = require('lodash')

// Different types of tile
const TYPES = {
  FIELD: 0
  CITY: 1
  ROAD: 2
  RIVER: -1
  // mission?
}

// also number of clockwise rotations
const SIDES = {
  TOP: 0
  RIGHT: 1
  BOTTOM: 2
  LEFT: 3
}

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

   `geography` - 3x3 array of TYPES
   `rotation` - SIDES
 */

const SIDE_TO_GRID_LOOKUP = {
  [TOP]: [0, 1]
  [RIGHT]: [1, 2]
  [BOTTOM]: [2, 1]
  [LEFT]: [1, 0]
}

let Tile = (geography, rotation) => {

  let getSide = (side) => {
    rotatedSide = (side + rotation) % 4 
    [r, c] = SIDE_TO_GRID_LOOKUP[rotatedSide]
    return geography[r][c]
  }
  
  return {
    getSide,
    getSides: () => _.fromPairs(
      _.values(SIDES).map((side) => [side, getSide(side)])
    )
    
  }
  
}
}

Module.exports = {Tile, TYPES, SIDES}
