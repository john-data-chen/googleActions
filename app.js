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

const { WebhookClient, Suggestion } = require('dialogflow-fulfillment');
const { Carousel } = require('actions-on-google');
const express = require('express');
const bodyParser = require('body-parser');
const rpn = require('request-promise-native');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', async (req, res) => {
  // console.log(require('util').inspect(req.body, { depth: null }));
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
    let conv = agent.conv();
    var speech = ''
    var carousel = {
      title: 'News',
      items: {}
    }
    if (req.body.queryResult.parameters.any)
      await rpn.get(advanceSearchUrl(req.body.queryResult.parameters.any))
        .then(body => {
          body = JSON.parse(body);
          return body
        }).then(body => {
          if (body.content.length <= 0) {
            conv.ask(constants.NO_RESULT_SPEECH);
          }
          speech = speechMaker(body)
          var news = carouselMaker(body)
          for (let index = 0; index < news.length; index++) {
            const element = news[index];
            carousel.items['News' + (index + 1) + 'ItemKey'] = element
            if (index == news.length - 1) {
              conv.ask(speech);
              conv.ask(new Carousel(carousel));
            }
          }
        });
    if (req.body.queryResult.parameters.category)
      await rpn.get(categorySearchUrl(req.body.queryResult.parameters.category))
        .then(body => {
          body = JSON.parse(body);
          console.log(require('util').inspect(body, { depth: null }));
          return body
        }).then(body => {
          if (body.content.length <= 0) {
            conv.ask(constants.NO_RESULT_SPEECH);
          }
          speech = speechMaker(body)
          var news = carouselMaker(body)
          for (let index = 0; index < news.length; index++) {
            const element = news[index];
            carousel.items['News' + (index + 1) + 'ItemKey'] = element
            if (index == news.length - 1) {
              conv.ask(speech);
              conv.ask(new Carousel(carousel));
            }
          }
        });
    agent.add(conv);
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
    case '最新':
      url =
        config.ML.SERVER_URL + config.ML.RTN_LATEST_NEWS_URL
      break

    case '熱門':
      break

    case '政治':
      url =
        config.ML.SERVER_URL +
        config.ML.RTN_CAT_NEWS_URL +
        config.CAT_ID.POLITICAL
      break

    case '社會':
      url =
        config.ML.SERVER_URL +
        config.ML.RTN_CAT_NEWS_URL +
        config.CAT_ID.SOCIETY
      break

    case '國際':
      url =
        config.ML.SERVER_URL +
        config.ML.RTN_CAT_NEWS_URL +
        config.CAT_ID.INTERNATIONAL
      break

    case '財經':
      url =
        config.ML.SERVER_URL +
        config.ML.RTN_CAT_NEWS_URL +
        config.CAT_ID.FINANCE
      break

    case '生活':
      url =
        config.ML.SERVER_URL +
        config.ML.RTN_CAT_NEWS_URL +
        config.CAT_ID.LIFE
      break

    case '娛樂':
      url =
        config.ML.SERVER_URL +
        config.ML.RTN_CAT_NEWS_URL +
        config.CAT_ID.ENTERTAINMENT
      break

    case '體育':
      url =
        config.ML.SERVER_URL +
        config.ML.RTN_CAT_NEWS_URL +
        config.CAT_ID.SPORT
      break

    case '辣蘋道':
      url =
        config.ML.SERVER_URL +
        config.ML.RTN_CAT_NEWS_URL +
        config.CAT_ID.GIRL
      break

    case '微視蘋':
      url =
        config.ML.SERVER_URL +
        config.ML.RTN_CAT_NEWS_URL +
        config.CAT_ID.MICROMOIVE
      break

    case '論壇':
      url =
        config.ML.SERVER_URL +
        config.ML.RTN_CAT_NEWS_URL +
        config.CAT_ID.FORUM
      break

    case '副刊':
      url =
        config.ML.SERVER_URL +
        config.ML.RTN_CAT_NEWS_URL +
        config.CAT_ID.SUPPLEMENT
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

function carouselMaker(body) {
  var carousel = []
  for (let index = 0; index < body.content.length; index++) {
    carousel.push({
      'title': body.content[index].title,
      'description': body.content[index].description,
      'image': {
        'url': body.content[index].sharing.image,
        'accessibilityText': body.content[index].description
      }
    })
    if (index == constants.GOOGLE_ACTIONS_MAX_RETURN - 1) {
      return carousel
    }
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

app.listen(config.PORT, function () {
  console.info(`Webhook listening on port `, config.PORT)
});