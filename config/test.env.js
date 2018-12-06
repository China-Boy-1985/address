'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  EVN_CONFIG:'"test"',
  API_HOST:'"http://172.16.1.103:8075/headset"'
})
