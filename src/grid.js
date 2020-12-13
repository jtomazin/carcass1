'use strict'

_ = require('lodash')

let Grid = () => {
    const grid = {}
    
    return {
        get: (x, y) => {
            if (grid[x] == null) {
                return null
            } else {
                return grid[x][y]
            }
        }
        
        set: (x, y, val) => {
            if (grid[x] == null) {
                grid[x] = {}
            }
            grid[x][y] = val
            return grid
        }

        getNeighbors: (x, y) => {
            return _.flatten(
                // [x-1, x, x+1].map((x) => [y-1, y, y-2]grid[x])
            )
        }
    }
}



module.exports = Grid
