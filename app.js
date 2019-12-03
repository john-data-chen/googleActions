'use strict'
global.reqlib = require('app-root-path').require
global.__base = require('path').resolve(__dirname)
var config = require(__base + '/server/config.js')
if (config.CONSOLE_LOG == 'off') {
  console.log = function () {}
}
const express = require('express')
const bodyParser = require('body-parser')
const {
  dialogflow,
  Image,
} = require('actions-on-google')

// Create an app instance
const app = dialogflow()

// Register handlers for Actions SDK intents

app.intent('Default Welcome Intent', conv => {
  conv.ask('')
})

const expressApp = express().use(bodyParser.json())

expressApp.post('/webhook', app)
expressApp.set('port', config.PORT || 5004)
expressApp.listen(config.PORT || 5004)
console.log('running on port', expressApp.get('port'))