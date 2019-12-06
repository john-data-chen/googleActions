// Google Action Max Return
const GOOGLE_ACTIONS_MAX_RETURN = 3
const GOOGLE_ACTIONS_WELCOME_SPEECH = {
  TW: '您好，我可以唸新聞給您聽，請對我說 我要找林志玲的新聞！',
  HK: '您好，我可以唸新聞給您聽，請對我說 我要找林鄭的新聞！'
}

const GOOGLE_ACTIONS_SUGGESTION = {
  TW: '我要找林志玲的新聞',
  HK: '我要找林鄭的新聞'
}
const HOW_TO_USE_SPEECH = {
  TW: '不知道從哪裡開始嗎？您可以用這些例句:\n我要找娛樂新聞\n我要找蔡英文的新聞',
  HK: '不知道從哪裡開始嗎？您可以用這些例句:\n我要找娛樂新聞\n我要找香港的新聞'
}
const NO_RESULT_SPEECH = '抱歉！你搜尋的條件，目前沒有符合的新聞，請更換條件，謝謝！'
const DEFAULT_FALLBACK_TW_SPEECH_POOL = [
  '對不起，我聽不懂你的問題。請參考例句：幫我找娛樂新聞',
  '這個格式才正確喔！例句：幫我找蔡英文的新聞'
]
const DEFAULT_FALLBACK_HK_SPEECH_POOL = [
  '對不起，我聽不懂你的問題。請參考例句：幫我找娛樂新聞',
  '這個格式才正確喔！例句：幫我找蔡英文的新聞'
]

module.exports = {
  GOOGLE_ACTIONS_MAX_RETURN: GOOGLE_ACTIONS_MAX_RETURN,
  GOOGLE_ACTIONS_WELCOME_SPEECH: GOOGLE_ACTIONS_WELCOME_SPEECH,
  GOOGLE_ACTIONS_SUGGESTION: GOOGLE_ACTIONS_SUGGESTION,
  HOW_TO_USE_SPEECH: HOW_TO_USE_SPEECH,
  NO_RESULT_SPEECH: NO_RESULT_SPEECH,
  DEFAULT_FALLBACK_TW_SPEECH_POOL: DEFAULT_FALLBACK_TW_SPEECH_POOL,
  DEFAULT_FALLBACK_HK_SPEECH_POOL: DEFAULT_FALLBACK_HK_SPEECH_POOL
}