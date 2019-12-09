const CONSOLE_LOG = 'on'
const PORT = 5003
const ML = {
  SERVER_URL: 'https://mluat-api.twnextdigital.com/',
  // search keyword (tag)
  SEARCH_NEWS_URL: '/v1/1/Search?KeyWord=',
  // RTN
  RTN_HOT_NEWS_URL: '/v1/1/ArticleList?Type=RTN_ALL&sortBy=VIEW',
  RTN_LATEST_NEWS_URL: '/v1/1/ArticleList?Type=RTN_ALL&sortBy=LATEST',
  RTN_CAT_NEWS_URL: '/v1/1/ArticleList?Type=RTN&CatId='
}
const CAT_ID = {
  POLITICAL: '101',
  SOCIETY: '102',
  INTERNATIONAL: '103',
  FINANCE: '104',
  LIFE: '105',
  ENTERTAINMENT: '106',
  SPORT: '107',
  GIRL: '124',
  FORUM: '113',
  MICROMOIVE: '123',
  SUPPLEMENT: '118'
}

module.exports = {
  CONSOLE_LOG: CONSOLE_LOG,
  PORT: PORT,
  ML: ML,
  CAT_ID: CAT_ID
}