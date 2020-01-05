'use strict'

module.exports.getRequiredMetadata = function getRequiredMetadata ({moduleName, literal, node}) {
  let isRequiredFound = false
  let declaredVarName

  if (node.callee.name === 'require') {
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
  let argumentName
  let isLiteral
  let argumentType

  const currentNodeFunctionName = node.property.name
  const currentObjectName = node.object.name
  console.log(currentNodeFunctionName)
  console.log(currentObjectName)
  if (currentNodeFunctionName === functionName && matchVariableList.has(currentObjectName)) {
    if (node.parent && node.parent.arguments) {
      isFunctionCallFound = true
      argumentName = node.parent.arguments[0].value
      isLiteral = node.parent.arguments[0].type === 'Literal'
      argumentType = node.parent.arguments[0].type
    }
  }

  return {
    isFunctionCallFound,
    argumentName,
    isLiteral,
    argumentType
  }
}
