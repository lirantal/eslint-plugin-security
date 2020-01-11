'use strict'

module.exports.getRequiredMetadata = function getRequiredMetadata ({moduleName, literal, node}) {
  let isRequiredFound = false
  let declaredVarName

  if (node.callee && node.callee.name === 'require') {
    const requiredModule = node.arguments[0]
    if (literal === true) {
      if (requiredModule && requiredModule.type === 'Literal') {
        if (requiredModule.value === moduleName) {
          isRequiredFound = true
        }
      }
    }

    if (node.parent.type === 'VariableDeclarator') {
      declaredVarName = node.parent.id.name
    }

    if (node.parent.type === 'AssignmentExpression' && node.parent.operator === '=') {
      declaredVarName = node.parent.left.name
    }
  }

  return {
    isRequiredFound,
    declaredVarName
  }
}

module.exports.getFunctionCallMetadata = function getFunctionCallMetadata ({
  matchVariableList,
  functionName,
  node
}) {
  let isFunctionCallFound = false
  let firstArgumentValue
  let allArguments
  let isLiteral
  let argumentType

  const currentNodeFunctionName = node.property.name
  const currentObjectName = node.object.name
  if (currentNodeFunctionName === functionName && matchVariableList.has(currentObjectName)) {
    if (node.parent && node.parent.arguments) {
      isFunctionCallFound = true
      firstArgumentValue = node.parent.arguments[0] && node.parent.arguments[0].value
      allArguments = node.parent.arguments
      isLiteral = node.parent.arguments[0] && node.parent.arguments[0].type === 'Literal'
      argumentType = node.parent.arguments[0] && node.parent.arguments[0].type
    }
  }

  return {
    isFunctionCallFound,
    allArguments,
    firstArgumentValue,
    isLiteral,
    argumentType
  }
}
