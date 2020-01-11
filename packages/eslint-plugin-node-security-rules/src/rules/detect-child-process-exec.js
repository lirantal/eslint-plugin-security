'use strict'

const eslintHelpers = require('eslint-helpers')
const getRequiredMetadata = eslintHelpers.getRequiredMetadata
const getFunctionCallMetadata = eslintHelpers.getFunctionCallMetadata

module.exports = function (context) {
  const moduleName = 'child_process'
  const detectedVariableNames = new Set()

  return {
    CallExpression: function (node) {
      const requiredOptions = {
        moduleName,
        literal: true,
        node
      }

      const { isRequiredFound, declaredVarName } = getRequiredMetadata(requiredOptions)
      if (isRequiredFound === true) {
        detectedVariableNames.add(declaredVarName)
      }
    },

    MemberExpression: function (node) {
      const { isFunctionCallFound, allArguments } = getFunctionCallMetadata({
        functionName: 'exec',
        matchVariableList: detectedVariableNames,
        node
      })

      if (isFunctionCallFound === true) {
        // handle cases where listen function is provided a literal argument
        if (allArguments[0]) {
          const execDeclration = allArguments[0]
          if (execDeclration.type !== 'Literal') {
            return context.report(
              node,
              'Found child_process.exec() with non Literal first argument'
            )
          }
        }
      }
    }
  }
}
