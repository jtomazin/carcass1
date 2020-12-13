'use strict'

_ = require('lodash')

// Different types of tile
TYPES = {
  FIELD: 0
  CITY: 1
  ROAD: 2
  RIVER: -1
  // mission?
}

SIDES = {
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
 */

Tile = () => {

  return {
    getEdges: () => []
          
  }
}

Module.exports = {Tile, TYPES, SIDES}
