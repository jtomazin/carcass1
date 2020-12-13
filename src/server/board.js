'use strict'

/* Entry point for querying and updating game state.
   Supports two fundamental operations:
   - given a tile, is a given (x,y,tile,rotation) legal to play
   - given an (x,y,type), what are all the (x,y) locations attached to that one
 */

Board = () => {
  
  return {
    // True iff `tile` could be legally placed at (x, y, rotation)
    isLegal: (tile, x, y, rotation) => false

    // All {x, y} locations attached to the `type` at (x, y). Empty if no `type` at (x, y).
    getConnected: (x, y, type) => []
  }
}




