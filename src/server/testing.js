'use strict'

const _ = require('lodash')

// const simpleRun = (tests) => _.forEach(tests, (test, heading) => {
//     if (!_.isEmpty(test)) {
//         return simpleRun(test)
//     } else {
//         let failStr = 'FAILED  '
//         try {
//             test()
//         } catch (e) {
//             console.log(failStr, heading+'\n', e)
//         }
//         console.log(_.fill(Array(failStr.length), ' ').join(''), heading)
//     }
// })

const runTests = (testsFn) => {
    if (require.main.path.includes('mocha')) {
        _.forEach(testsFn(), (test, heading) => {
            if (!_.isEmpty(test)) {
                describe(heading, () => runTests(() => test))
            } else {
                it(heading, test)
            }
        })
    }
}

module.exports = { runTests }
