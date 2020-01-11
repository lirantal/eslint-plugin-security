'use strict'

const eslintHelpers = require('eslint-helpers')
const getRequiredMetadata = eslintHelpers.getRequiredMetadata
const getFunctionCallMetadata = eslintHelpers.getFunctionCallMetadata

module.exports = function (context) {
  const moduleName = 'fastify'
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
        functionName: 'listen',
        matchVariableList: detectedVariableNames,
        node
      })

      if (isFunctionCallFound === true) {
        // handle cases where listen function is provided a literal argument
        if (allArguments[1]) {
          const listenArgument = allArguments[1]
          if (listenArgument.type === 'Literal' && listenArgument.value !== '127.0.0.1') {
            return context.report(node, 'Found fastify server open to the world.')
          }
        }

        // handle cases where listen function is provided an object config
        if (allArguments[0] && allArguments[0].type === 'ObjectExpression') {
          for (const nodeObject of allArguments[0].properties) {
            if (nodeObject.key && nodeObject.key.name === 'host') {
              if (nodeObject.value.value !== '127.0.0.1') {
                return context.report(node, 'Found fastify server open to the world.')
              }
            }
          }
        }
      }
    }
  }
}
