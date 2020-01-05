'use strict'

const path = require('path')
const RULE_NAME = path.parse(__filename).name

const RuleTester = require('eslint').RuleTester
const rule = require('../../src/rules/detect-child-process')

const tester = new RuleTester()

const validCode = {
  child_process_exec: `child_process.execFile('ls')`
}

const invalidCode = {
  require_child_process: `var cp = require('child_process');`,
  require_assignment: `var a = require('child_process');
  var b = require('child_process');
  var c = d = require('child_process');
  b.execFile(dd)
  `
}

const errorMessages = {
  foundRequire: `Found require('child_process')`
}

tester.run(RULE_NAME, rule, {
  valid: [{ code: validCode['child_process_exec'] }],
  invalid: [
    {
      code: invalidCode['require_child_process'],
      errors: [{ message: errorMessages['foundRequire'] }]
    },
    {
      code: invalidCode['require_assignment'],
      errors: [
        {
          message: errorMessages['foundRequire']
        },
        {
          message: errorMessages['foundRequire']
        },
        {
          message: errorMessages['foundRequire']
        }
      ]
    }
  ]
})
