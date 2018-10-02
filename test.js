const WebSocket = require('ws');
const request  = require('request');

const { createStore } = require('./flux/store/createStore');
const { reducer } = require('./flux/reducers/reducer');
const { toTwoDecPlaces } = require('./utils/utils');

const HOST = 'wss://stream.binance.com:9443/ws/btcusdt@depth'
const wss = new WebSocket(HOST)

const initialState = {
  lastPrice:0,
  priceHistory:[],
  currentPair:{
    baseAsset: 'USDT',
    quoteAsset: 'BTC'
  }
}

const store = createStore(reducer, initialState)

request('https://api.binance.com/api/v1/exchangeInfo', {json:true}, (err, res, body) => {
  if(err) {console.log('TODO: push error to global state');}

  const quotedAssets = {}
  for (let i in body.symbols){
    const current = body.symbols[i].quoteAsset
    if(typeof quotedAssets[current] === 'undefined'){
      quotedAssets[current] = []
    }
    quotedAssets[current].push(body.symbols[i])
  }

  store.dispatch({
      type: 'CURRENCIES_LOADED',
      currencies: quotedAssets
  })
});

wss.onmessage = (event) => {

  console.log(quoteAsset);
  let lastPrice = store.getState().lastPrice
  let data = JSON.parse(event.data)
  if (!!data.b[0]) {
    lastPrice = toTwoDecPlaces(data.b[0][0])
  }
  store.dispatch({
      type: 'SOCKET_MESSAGE',
      price: lastPrice
  })
  console.log(data.s);
  console.log(store.getState().lastPrice);
};
