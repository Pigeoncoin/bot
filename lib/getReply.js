
const stringSimilarity = require('string-similarity');
const shortenLinks = require('./shortenLinks.js');
const settings = require('../settings.json');

async function getReply(message, latestData){
  const cleanedMessage = cleanMessage(message.content);
  const dictionary = makeDictionary(latestData)

  const matches = stringSimilarity.findBestMatch(cleanedMessage, Object.keys(dictionary));
  if(cleanedMessage.includes('bitly')){
    const team = !!message.member.roles.find('name', settings.teamRole)
    console.log(`team is ${team}`)
    let response = ''
    if(team){
      response = await shortenLinks(cleanedMessage)
    }else{
      response = null
    }

    return {response}
  }else{
    if(matches.bestMatch.rating > 0.6){
      return Object.assign(dictionary[matches.bestMatch.target],{'rating':matches.bestMatch.rating})
    }
  }
}

module.exports = getReply


////////////////////
////////////////////

function makeDictionary(latestData){

  const retargetingPeriod = latestData.chain.height < 87570 ? 2016 : 360

  const newsChannel = "<#428888110634500097>";
  const faqChannel =  "<#427877188990402571>";

  // set template variables
  const hashrate = `${Number((latestData.chain.hashrate/1e9).toPrecision(2))} GH`
  const difficulty = `${Math.round(latestData.chain.difficulty)}`
  const blockTime = `${(latestData.chain.blockTime/60).toFixed(1)} min`

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
    'blockchain':     {response: `${hashrate}, ${difficulty} diff, ${blockTime}/block, and retargeting every block`},
    'market':         {response: `we're trading at ${priceBtc}, with ${volumeBtc} daily volume, and a ${marketCapBtc} market cap`},
    'pool':           {response: `https://pool.pigeoncoin.org/ is at ${capacity} capacity, with ${miners} miners, and ${payoutTime} until next payout`},
    'commands':       {response: `https://github.com/Pigeoncoin/bot/blob/master/lib/getReply.js#L64-L157`},

    'price':          {response: `price is **${priceBtc}**`},
    'volume':         {response: `volume is **${volumeBtc}** per day`},
    'marketcap':      {response: `market cap is **${marketCapBtc}**`},
    'supply':         {response: `circulating supply is **${supply}**`},
    'hashrate':       {response: `network hashrate is **${hashrate}**.`},
    'difficulty':     {response: `difficulty is **${difficulty}**`},
    'blocktime':      {response: `blocktime is approximately **${blockTime}**, with a target of 1 minute`},
    'height':         {response: `blockheight is **${height}**`},
    'retarget':       {response: `we now use LWMA which retargets every block`},

    'explorer':       {response: `https://explorer.pigeoncoin.org`},
    'website':        {response: `https://pigeoncoin.org`},
    'exchange':       {response: `we have trading pairs with Ravencoin, Litecoin, and Bitcoin on CryptoBridge! https://crypto-bridge.org/`},
    'roadmap':        {response: `https://pigeoncoin.org/roadmap/`},
    'whitepaper':     {response: `the X16S (shuffle) mini-whitepaper is here https://pgn.gg/whitepaper`},
    'whattomine':     {response: `Pigeoncoin, of course! https://pool.pigeoncoin.org/`},
    'resources':      {response: `https://pigeoncoin.org/#resources`},
    'release':        {response: `https://github.com/Pigeoncoin/pigeoncoin/releases`},
    'nodes':          {response: `http://explorer.pigeoncoin.org/network`},

    'twitter':        {response: `https://twitter.com/Pigeoncoin`},
    'github':         {response: `https://github.com/Pigeoncoin`},
    'reddit':         {response: `https://www.reddit.com/r/Pigeoncoin/`},
    'telegram':       {response: `https://t.me/Pigeoncoin`},
    'medium':         {response: `https://medium.com/@pigeoncoin`},
    'youtube':        {response: `https://pgn.gg/youtube`},

    'mobile':         {response: `yesterday?`},

    'masternode':     {response: `tomorrow?`},

    'coinmarketcap':  {response: `https://coinmarketcap.com/currencies/pigeoncoin/`},
    'coingecko':      {response: `we're there! https://www.coingecko.com/en/coins/pigeoncoin`},
    'livecoinwatch':  {response: `:thinking:`},
    'whattomine':     {response: `https://pgn.gg/whattomine`},

    'cryptobridge':   {response: `we have trading pairs with Ravencoin, Litecoin, and Bitcoin on CryptoBridge! https://crypto-bridge.org/`},
    'cobinhood':      {response: `:thinking:`},
    'cryptopia':      {response: ':thinking:'},
    'bittrex':        {response: ':thinking:'},
    'binance':        {response: ':thinking:'},
    'coinbase':       {response: ':thinking:'},

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
    'dinglehopper':   {reaction: '🍴'},

    'stuck transaction': {response: `check this out https://bitzuma.com/posts/how-to-clear-a-stuck-bitcoin-transaction/`}
  }

  // temporary for retarget
  // under 87,570 blocks
  if(latestData.chain.height < 87570){
    Object.assign(dictionary, {
      'rule change':  {response: `difficulty rules change in **${87570 - latestData.chain.height} blocks**`}
    })
  }

  // set commandAlternatives
  const commandAlternatives = {
    'difficulty':     ['diff'],
    'retarget':       ['diff change','difficulty change'],
    'height':         ['blockheight','chain length'],
    'height':         ['blockheight','chain length'],
    'mobile':         ['ios','android','spv','spv wallet','mobile wallet'],
    'masternode':     ['airdrop','faucet','securenode'],
    'coinmarketcap':  ['cmc'],
    'cryptobridge':   ['cb'],
    'coinbase':       ['gdax'],
    'good bot':       ['thanks', 'thanks bot'],
    'bad bot':        ['stupid bot','stupid','dumb bot'],
    'nodes':          ['node list', 'send nodes'],
    'resources':      ['wallet','desktop wallet', 'miners', 'broadcasts']
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
