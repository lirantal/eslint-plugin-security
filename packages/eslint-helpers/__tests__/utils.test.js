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

  test('Assignment expression: var cp = a = require("something")', () => {
    const linter = new eslint.Linter()

    const code = 'var cp = a = require(abc);'
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
      isRequiredFound: false,
      declaredVarName: 'a'
    })
  })

  describe('Match a function call()', () => {
    test('Literal function call matching: cp.exec("ls")', () => {
      const linter = new eslint.Linter()

      const code = 'cp.exec("ls")'
      const selector = "MemberExpression[property.name='exec']"

      let actual = null
      linter.defineRule('test', context => ({
        [selector] (node) {
          actual = utils.getFunctionCallMetadata({
            matchVariableList: new Map([['cp']]),
            functionName: 'exec',
            node: node
          })
        }
      }))

      linter.verify(code, {
        rules: {
          test: 'error'
        }
      })

      expect(actual).toEqual(
        expect.objectContaining({
          isFunctionCallFound: true,
          firstArgumentValue: 'ls',
          isLiteral: true,
          argumentType: 'Literal'
        })
      )
    })
  })
})
