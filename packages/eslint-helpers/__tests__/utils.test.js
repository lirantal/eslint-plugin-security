'use strict'

const eslint = require('eslint')
const utils = require('../index')

describe('Utils', () => {
  describe('Match require()', () => {
    test('Simple: var cp = require("something")', () => {
      const linter = new eslint.Linter()

      const code = 'var cp = require("child_process");'
      const selector = "CallExpression[callee.name='require']"

      let actual = null
      linter.defineRule('test', context => ({
        [selector] (node) {
          actual = utils.getRequiredMetadata({
            moduleName: 'child_process',
            literal: true,
            node: node
          })
        }
      }))

      linter.verify(code, {
        rules: {
          test: 'error'
        }
      })

      expect(actual).toEqual({
        isRequiredFound: true,
        declaredVarName: 'cp'
      })
    })
  })
})
