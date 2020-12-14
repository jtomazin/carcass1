'use strict'

const _ = require('lodash')

const simpleRun = (tests) => _.forEach(tests, (test, heading) => {
    if (!_.isEmpty(test)) {
        return simpleRun(test)
    } else {
        let failStr = 'FAILED  '
        try {
            test()
        } catch (e) {
            console.log(failStr, heading+'\n', e)
        }
        console.log(_.fill(Array(failStr.length), ' ').join(''), heading)
    }
})


module.exports = { simpleRun }
