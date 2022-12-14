'use strict'
global.reqlib = require('app-root-path').require
global.__base = require('path').resolve(__dirname)
var config = require(__base + '/server/config.js')
if (config.CONSOLE_LOG == 'off') {
  console.log = function () { }
}
var constants = require(__base + '/server/constants.js')

// add log time
require('console-stamp')(console, 'yyyy.mm.dd HH:MM:ss.l')

const { WebhookClient } = require('dialogflow-fulfillment');
const { Suggestion } = require('dialogflow-fulfillment');
const express = require('express');
const bodyParser = require('body-parser');
const rpn = require('request-promise-native');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', async (req, res) => {
  console.log(require('util').inspect(req.body, { depth: null }));
  const agent = new WebhookClient({ request: req, response: res });

  // Google Actions agent functions start from here
  function welcome(agent) {
    if (req.body.queryResult.languageCode.indexOf('tw') > -1) {
      agent.add(constants.GOOGLE_ACTIONS_WELCOME_SPEECH.TW)
      agent.add(new Suggestion(constants.GOOGLE_ACTIONS_SUGGESTION.TW))
    }
    else {
      agent.add(constants.GOOGLE_ACTIONS_WELCOME_SPEECH.HK)
      agent.add(new Suggestion(constants.GOOGLE_ACTIONS_SUGGESTION.HK))
    }
  }

  function fallback(agent) {
    var speech = ''
    if (req.body.queryResult.languageCode.indexOf('tw') > -1) 
      speech = constants.DEFAULT_FALLBACK_TW_SPEECH_POOL[
        getRandomInt(constants.DEFAULT_FALLBACK_TW_SPEECH_POOL.length)
      ]
    else 
      speech = constants.DEFAULT_FALLBACK_HK_SPEECH_POOL[
        getRandomInt(constants.DEFAULT_FALLBACK_HK_SPEECH_POOL.length)
      ]
    
    agent.add(speech)
    agent.add(new Suggestion(constants.GOOGLE_ACTIONS_SUGGESTION))
  }

  function howToUse(agent) {
    if (req.body.queryResult.languageCode.indexOf('tw') > -1) {
      agent.add(constants.HOW_TO_USE_SPEECH.TW)
      agent.add(new Suggestion(constants.GOOGLE_ACTIONS_SUGGESTION.TW))
    }
    else {
      agent.add(constants.HOW_TO_USE_SPEECH.HK)
      agent.add(new Suggestion(constants.GOOGLE_ACTIONS_SUGGESTION.HK))
    }
  }

  async function advanceSearch(agent) {
    if (req.body.queryResult.parameters.any)
      await rpn.get(advanceSearchUrl(req.body.queryResult.parameters.any))
        .then(body => {
          body = JSON.parse(body);
          return body
        }).then(body => {
          if (body.content.length <= 0) {
            agent.add(constants.NO_RESULT_SPEECH);
          }
          var speech = speechMaker(body)
          agent.add(speech);
        });
    if (req.body.queryResult.parameters.category)
      await rpn.get(categorySearchUrl(req.body.queryResult.parameters.category))
        .then(body => {
          body = JSON.parse(body);
          console.log(require('util').inspect(body, { depth: null }));
          return body
        }).then(body => {
          if (body.content.length <= 0) {
            agent.add(constants.NO_RESULT_SPEECH);
          }
          var speech = speechMaker(body)
          agent.add(speech);
        });
    return Promise.resolve(agent);
  }

  // final, set intentMap
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('returnHowToUse', howToUse);
  intentMap.set('advanceSearch', advanceSearch);
  // intentMap.set('<INTENT_NAME_HERE>', yourFunctionHandler);
  agent.handleRequest(intentMap);
})

// self-created functions start from here
function advanceSearchUrl(queryText) {
  return config.ML.SERVER_URL + config.ML.SEARCH_NEWS_URL + encodeURIComponent(queryText)
}

function categorySearchUrl(category) {
  var url =
    config.ML.SERVER_URL + config.ML.RTN_HOT_NEWS_URL

  switch (category) {
    case '??????':
      url =
        config.ML.SERVER_URL + config.ML.RTN_LATEST_NEWS_URL
      break

    case '??????':
      break

    case '????????????':
      url =
        config.ML.SERVER_URL +
        config.ML.RTN_CAT_NEWS_URL +
        config.CAT_ID.ONEPOINT
      break

    case '??????':
      url =
        config.ML.SERVER_URL +
        config.ML.RTN_CAT_NEWS_URL +
        config.CAT_ID.RECOMMEND
      break

    case '??????':
      url =
        config.ML.SERVER_URL +
        config.ML.RTN_CAT_NEWS_URL +
        config.CAT_ID.HILIGHT
      break

    case '??????':
      url =
        config.ML.SERVER_URL +
        config.ML.RTN_CAT_NEWS_URL +
        config.CAT_ID.SOCIETY
      break

    case '??????':
      url =
        config.ML.SERVER_URL +
        config.ML.RTN_CAT_NEWS_URL +
        config.CAT_ID.ENTERTAINMENT
      break

    case '??????':
      url =
        config.ML.SERVER_URL +
        config.ML.RTN_CAT_NEWS_URL +
        config.CAT_ID.PEOPLE
      break

    case '??????':
    case '??????':
    case '????????????':
      url =
        config.ML.SERVER_URL +
        config.ML.RTN_CAT_NEWS_URL +
        config.CAT_ID.MAKEUP
      break

    case '??????':
      url =
        config.ML.SERVER_URL +
        config.ML.RTN_CAT_NEWS_URL +
        config.CAT_ID.LIFE
      break

    case '??????':
      url =
        config.ML.SERVER_URL +
        config.ML.RTN_CAT_NEWS_URL +
        config.CAT_ID.TECH
      break

    case '??????':
      url =
        config.ML.SERVER_URL +
        config.ML.RTN_CAT_NEWS_URL +
        config.CAT_ID.FASHION
      break

    case '??????':
      url =
        config.ML.SERVER_URL +
        config.ML.RTN_CAT_NEWS_URL +
        config.CAT_ID.INTERNATIONAL
      break

    case '??????':
    case '??????':
    case '????????????':
      url =
        config.ML.SERVER_URL +
        config.ML.RTN_CAT_NEWS_URL +
        config.CAT_ID.FOODANDTRAVEL
      break

    case '??????':
    case '????????????':
      url =
        config.ML.SERVER_URL +
        config.ML.RTN_CAT_NEWS_URL +
        config.CAT_ID.CLASSIC
      break

    case '??????':
      url =
        config.ML.SERVER_URL +
        config.ML.RTN_CAT_NEWS_URL +
        config.CAT_ID.COLUMN
      break

    default:
      console.log('default, set to hot')
      break
  }
  return url
}

function speechMaker(body) {
  var speech = ''
  for (let index = 0; index < body.content.length; index++) {
    speech += body.content[index].title + '\n'
    if (index == constants.GOOGLE_ACTIONS_MAX_RETURN - 1) {
      return speech
    }
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

app.listen(config.PORT, function () {
  console.info(`Webhook listening on port `, config.PORT)
});