'use strict'

let _ = require('lodash')
let Sides = require('./sides')

let Grid = () => {
    const grid = {}

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
            if (grid[x] == null) {
                grid[x] = {}
            }
            grid[x][y] = val
            return grid
        },

        getGrid: () => grid, 
        
        getNeighbors: (x, y) => _.fromPairs(
            _.values(Sides.SIDES).map((side) => {
                let [dx, dy] = Sides.toDirection(side)
                return [side, get(x + dx, y + dy)]
            }).filter(([side, tile]) => tile != null)
        )
    }
}



module.exports = Grid
