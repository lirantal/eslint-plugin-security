'use strict'

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
