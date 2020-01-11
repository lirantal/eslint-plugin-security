'use strict'

const path = require('path')
const RULE_NAME = path.parse(__filename).name

const RuleTester = require('eslint').RuleTester
const rule = require('../../src/rules/detect-bind-on-all-ifaces')

const tester = new RuleTester()

const validCode = {
  fastify_listen: `fastify.listen(3000)`
}

const invalidCode = {
  listen_on_all_ifaces_simple: `var fastify = require('fastify');
  fastify.listen(3000, '0.0.0.0', 511, function (err, address) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  });
  `,
  listen_on_all_ifaces_object: `var fastify = require('fastify');
  fastify.listen({ port: 3000, host: '0.0.0.0', backlog: 511 }, function(err) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  });
  `
}

const errorMessages = {
  foundFastifyListenToTheWorld: `Found fastify server open to the world.`
}

tester.run(RULE_NAME, rule, {
  valid: [{ code: validCode['fastify_listen'] }],
  invalid: [
    {
      code: invalidCode['listen_on_all_ifaces_simple'],
      errors: [{ message: errorMessages['foundFastifyListenToTheWorld'] }]
    },
    {
      code: invalidCode['listen_on_all_ifaces_object'],
      errors: [{ message: errorMessages['foundFastifyListenToTheWorld'] }]
    }
  ]
})
