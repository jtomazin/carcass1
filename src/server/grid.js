'use strict'

let _ = require('lodash')
let Sides = require('./sides')

let Grid = (grid = undefined) => {
    if (grid == null) {
        grid = {}
    }

    let get = (x, y) => {
        if (grid[x] == null) {
            return null
        } else {
            return grid[x][y]
        }
    }
    
    return {
        get,
        
        set: (x, y, val) => {
            let newGrid = _.cloneDeep(Grid)
            if (newGrid[x] == null) {
                newGrid[x] = {}
            }
            newGrid[x][y] = val
            return Grid(newGrid)
        },

        getGrid: () => _.cloneDeep(grid),

        getNeighbors: (x, y) => _.fromPairs(
            _.values(Sides.SIDES).map((side) => {
                let [dx, dy] = Sides.toDirection(side)
                return [side, get(x + dx, y + dy)]
            }).filter(([side, tile]) => tile != null)
        )
    }
}



module.exports = Grid
