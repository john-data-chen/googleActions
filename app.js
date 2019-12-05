'use strict'
global.reqlib = require('app-root-path').require
global.__base = require('path').resolve(__dirname)
var config = require(__base + '/server/config.js')
if (config.CONSOLE_LOG == 'off') {
  console.log = function () { }
}

'use strict';

const { WebhookClient } = require('dialogflow-fulfillment');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


function welcome(agent) {
  agent.add(`Welcome to Express.JS webhook!`);
}

function fallback(agent) {
  agent.add(`I didn't understand`);
  agent.add(`I'm sorry, can you try again?`);
}

function WebhookProcessing(req, res) {
  const agent = new WebhookClient({ request: req, response: res });
  console.info(`agent set`);

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  // intentMap.set('<INTENT_NAME_HERE>', yourFunctionHandler);
  agent.handleRequest(intentMap);
}


// Webhook
app.post('/webhook', function (req, res) {
  console.info(`\n\n>>>>>>> S E R V E R   H I T <<<<<<<`);
  WebhookProcessing(req, res);
});

app.listen(5003, function () {
  console.info(`Webhook listening on port 8080!`)
});