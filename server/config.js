const CONSOLE_LOG = 'on'
const PORT = 5003
const ML = {
  SERVER_URL: 'http://mluat.api.twnextdigital.com',
  // search keyword (tag)
  SEARCH_NEWS_URL: '/v1/2/Search?KeyWord=',
  // RTN
  RTN_HOT_NEWS_URL: '/v1/2/ArticleList?Type=RTN_ALL&sortBy=VIEW',
  RTN_LATEST_NEWS_URL: '/v1/2/ArticleList?Type=RTN_ALL&sortBy=LATEST',
  RTN_CAT_NEWS_URL: '/v1/2/ArticleList?Type=RTN&CatId='
}
const CAT_ID = {
  SOCIETY: '400001',
  ENTERTAINMENT: '400003',
  PEOPLE: '400004',
  FASHION: '400005',
  LIFE: '400006',
  FOODANDTRAVEL: '400007',
  COLUMN: '400008',
  HILIGHT: '400011',
  TECH: '400012',
  INTERNATIONAL: '400013',
  RECOMMEND: '400020',
  ONEPOINT: '400014',
  CLASSIC: '400015',
  MAKEUP: '400016'
}

module.exports = {
  CONSOLE_LOG: CONSOLE_LOG,
  PORT: PORT,
  ML: ML,
  CAT_ID: CAT_ID
}