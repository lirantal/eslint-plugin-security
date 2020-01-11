'use strict'

const path = require('path')
const RULE_NAME = path.parse(__filename).name

const RuleTester = require('eslint').RuleTester
const rule = require('../../src/rules/detect-child-process-exec')

const tester = new RuleTester()

const validCode = {
  child_process_exec: `child_process.execFile('ls')`,
  child_process_exec_require_and_literal: `
  var cp = require('child_process');
  cp.exec('ls')
  `,
  child_process_exec_require_and_no_argument: `
  var cp = require('child_process');
  cp.exec()
  `
}

const invalidCode = {
  child_process_exec: `var cp = require('child_process');
  cp.exec(dd)`,
  child_process_exec_multiple_require: `
  var cp = require('child_process');
  var a = require('child_process');
  a.exec(dd)
  `
}

const errorMessages = {
  foundRequire: `Found child_process.exec() with non Literal first argument`
}

tester.run(RULE_NAME, rule, {
  valid: [
    { code: validCode['child_process_exec'] },
    { code: validCode['child_process_exec_require_and_literal'] },
    { code: validCode['child_process_exec_require_and_no_argument'] }
  ],
  invalid: [
    {
      code: invalidCode['child_process_exec'],
      errors: [{ message: errorMessages['foundRequire'] }]
    },
    {
      code: invalidCode['child_process_exec_multiple_require'],
      errors: [{ message: errorMessages['foundRequire'] }]
    }
  ]
})
