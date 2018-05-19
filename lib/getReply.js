
const stringSimilarity = require('string-similarity');

function getReply(message, latestData){
  const cleanedMessage = cleanMessage(message);
  const dictionary = makeDictionary(latestData)

  const matches = stringSimilarity.findBestMatch(cleanedMessage, Object.keys(dictionary));

  if(matches.bestMatch.rating > 0.6){
    return Object.assign(dictionary[matches.bestMatch.target],{'rating':matches.bestMatch.rating})
  }
}

module.exports = getReply


////////////////////
////////////////////

function makeDictionary(latestData){
  const newsChannel = "<#428888110634500097>";
  const faqChannel =  "<#427877188990402571>";

  // set template variables
  const hashrate = `${Number((latestData.chain.hashrate/1e9).toPrecision(2))} GH`
  const difficulty = `${Math.round(latestData.chain.difficulty)}`
  const blockTime = `${(latestData.chain.blockTime/60).toFixed(1)} min`
  const retarget = `${2016 - latestData.chain.height % 2016} blocks`
  const retargetTime = `${Number(((2016 - latestData.chain.height % 2016) * latestData.chain.blockTime/60 / 60).toPrecision(2))} hours`

  const priceBtc = `${Math.round(latestData.market.priceBtc * 1e8)} satoshis`
  const volumeBtc = `${Number(latestData.market.volumeBtc.toPrecision(2))} BTC`
  const marketCapBtc = `${Number(latestData.market.marketCapBtc.toPrecision(2))} BTC`

  const supply = `${Number((latestData.chain.supply / 1e6).toPrecision(2))}M PGN`
  const height = `${latestData.chain.height.toLocaleString()} blocks`

  const capacity = `${Math.round(latestData.pool.miners / 1000 * 100)}%`
  const miners = `${Math.round(latestData.pool.miners)}`

  const payoutTime = `${Math.round(180 - (Date.now()/1000/60-60) % 180)} minutes`

  // generate dictionary
  let dictionary = {

    'stats':          {response: `!price, !volume, !marketcap, !supply, !hashrate, !difficulty, !blocktime, !retarget :chart_with_upwards_trend:`},
    'blockchain':     {response: `${hashrate}, ${difficulty} diff, ${blockTime} blocks and ${retargetTime} to retarget`},
    'market':         {response: `we're trading at ${priceBtc}, with ${volumeBtc} daily volume, and a ${marketCapBtc} market cap`},
    'pool':           {response: `https://pool.pigeoncoin.org/ is at ${capacity} capacity, with ${miners} miners, and ${payoutTime} until next payout`},

    'price':          {response: `price is **${priceBtc}**`},
    'volume':         {response: `volume is **${volumeBtc}** per day`},
    'marketcap':      {response: `market cap is **${marketCapBtc}**`},
    'supply':         {response: `circulating supply is **${supply}**`},
    'hashrate':       {response: `network hashrate is **${hashrate}**.`},
    'difficulty':     {response: `difficulty is **${difficulty}** for the next **${retargetTime}**.`},
    'blocktime':      {response: `blocktime is approximately **${blockTime}**, with a target of 1 minute`},
    'height':         {response: `blockheight is **${height}**`},
    'retarget':       {response: `difficulty will retarget in **${retarget}** and **${retargetTime}**`},

    'explorer':       {response: `https://explorer.pigeoncoin.org`},
    'website':        {response: `https://pigeoncoin.org`},
    'exchange':       {response: `we have trading pairs with Ravencoin, Litecoin, and Bitcoin on CryptoBridge! https://crypto-bridge.org/`},
    'roadmap':        {response: `roadmap is in progress! We will announce updates in ${newsChannel}`},
    'whitepaper':     {response: `the X16S (shuffle) mini-whitepaper is here https://pigeoncoin.org/assets/X16S-whitepaper.pdf`},
    'whattomine':     {response: `Pigeoncoin, of course! https://pool.pigeoncoin.org/`},
    'miners':         {response: `https://pigeoncoin.org/mining`},
    'release':        {response: `https://github.com/Pigeoncoin/pigeoncoin/releases`},
    'donate':         {response: 'please donate!\n\nPigeoncoin: `PDiZ89gk5HMqwrcGp6Hs9WdgFALzLbD4HG` \nBitcoin: `1NaVP4cKiWY6MxSDkTCZ2kh5Xm3coA27Qv`'},

    'twitter':        {response: `https://twitter.com/Pigeoncoin`},
    'github':         {response: `https://github.com/Pigeoncoin`},
    'reddit':         {response: `https://www.reddit.com/r/Pigeoncoin/`},
    'telegram':       {response: `https://t.me/Pigeoncoin`},
    'medium':         {response: `https://medium.com/@pigeoncoin`},

    'mobile':         {response: `keep an eye out for the roadmap!  ${newsChannel}`},

    'masternode':     {response: `never.`},

    'coinmarketcap':  {response: `when we have $100k USD daily volume on all exchanges.`},
    'coingecko':      {response: `we're there! https://www.coingecko.com/en/coins/pigeoncoin`},
    'livecoinwatch':  {response: `livecoinwatch listing is in progress!`},
    'whattomine':     {response: `we need to be listed on Abucoins, Bitfinex, Bittrex, Binance, Cryptopia, HitBTC, Poloniex or YoBit first!`},

    'cryptobridge':   {response: `we have trading pairs with Ravencoin, Litecoin, and Bitcoin on CryptoBridge! https://crypto-bridge.org/`},
    'cobinhood':      {response: `we are speaking with Cobinhood and are expecting a determination around Q3 2018.`},
    'cryptopia':      {response: 'when you donate all your Pigeon to `PDiZ89gk5HMqwrcGp6Hs9WdgFALzLbD4HG`'},
    'bittrex':        {response: 'when you donate all your Pigeon to `PDiZ89gk5HMqwrcGp6Hs9WdgFALzLbD4HG`'},
    'binance':        {response: 'when you donate all your Pigeon to `PDiZ89gk5HMqwrcGp6Hs9WdgFALzLbD4HG`'},
    'coinbase':       {response: 'when you donate all your Pigeon and your first born child to `PDiZ89gk5HMqwrcGp6Hs9WdgFALzLbD4HG`'},

    'birthday':       {response: `March 21st!`},
    'timestamp':      {response: `Reuters 21/Mar/2018 China stays on the sidelines as Venezuela spirals downward.`},
    'maxsupply':      {response: `max supply is **21B PGN**`},
    'blockreward':    {response: `**5000 PGN** is awarded every minute`},

    'moon':           {reaction: '🚀'},
    'lambo':          {response: `when lambo?! When land!`},
    'surfin':         {response: `:surfer:\nhttps://www.youtube.com/watch?time_continue=80&v=gBexh377HbQ`},
    'handsome boy':   {files: ['./img/handsome-boy.jpg']},
    'nasdaq':         {reaction: '📈'},
    'good bot':       {reaction: '👍'},
    'bad bot':        {reaction: '👎'},
    'lorem ipsum':    {response: `dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`},

    'lunch':          {reaction: '430547800363630602'},
    'pigeon soup':    {reaction: '🍜'},

    'stuck transaction': {response: `check this out https://bitzuma.com/posts/how-to-clear-a-stuck-bitcoin-transaction/`}
  }

  // set commandAlternatives
  const commandAlternatives = {
    'difficulty':     ['diff'],
    'retarget':       ['diff change','difficulty change'],
    'height':         ['blockheight','chain length'],
    'release':        ['wallet','desktop wallet'],
    'height':         ['blockheight','chain length'],
    'mobile':         ['ios','android','spv','spv wallet','mobile wallet'],
    'masternode':     ['airdrop','faucet','securenode'],
    'coinmarketcap':  ['cmc'],
    'cryptobridge':   ['cb'],
    'coinbase':       ['gdax'],
    'good bot':       ['thanks', 'thanks bot'],
    'bad bot':        ['stupid bot','stupid','dumb bot'],
  }

  // generate alternatives
  for([command, alternatives] of Object.entries(commandAlternatives)){
    for(alternative of alternatives){
      if(dictionary[command]){
        dictionary[alternative] = dictionary[command]
      }
    }
  }

  return dictionary
}


//////////////////////
function cleanMessage(message){
  let deleteThis = ['!','when','help','who','what','where','how','why','?']
  let result = message

  for(item in deleteThis){
    result = result.replace(deleteThis[item],'');
  }

  // delete all leading and trailing spaces
  result = result.trim()

  return result;
}