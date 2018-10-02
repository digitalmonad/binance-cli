const blessed = require('blessed')
const contrib = require('blessed-contrib')
const WebSocket = require('ws');
const request = require('request');
const screen = blessed.screen();

const { createStore } = require('./flux/store/createStore');
const { reducer } = require('./flux/reducers/reducer');
const { toTwoDecPlaces } = require('./utils/utils');

const initialState = {
  lastPrice:0,
  priceHistory:[],
  currentPair:{
    baseAsset: 'USDT',
    quoteAsset: 'BTC'
  }
}

const store = createStore(reducer, initialState)

//Components
const header = require('./components/header').header

function startStream(){
  const state = store.getState()
  const baseAsset = state.currentPair.baseAsset
  const quoteAsset = state.currentPair.quoteAsset

  const HOST = 'wss://stream.binance.com:9443/ws/'
    + quoteAsset.toLowerCase()
    + baseAsset.toLowerCase()
    + '@depth';

  const wss = new WebSocket(HOST)

  wss.onmessage = (event) => {
    let lastPrice = store.getState().lastPrice
    let data = JSON.parse(event.data)
    if (!!data.b[0]) {
      lastPrice = toTwoDecPlaces(data.b[0][0])
    }
    store.dispatch({
        type: 'SOCKET_MESSAGE',
        price: lastPrice
    })
    const state = store.getState()
    header.children[0]
      .setContent(state.lastPrice + ' ' + quoteAsset + '/' + baseAsset )
    screen.render()
  };
}

request('https://api.binance.com/api/v1/exchangeInfo', {json:true}, (err, res, body) => {
  if(err) {console.log('TODO: push error to global state');}

  const quoteAssets = {}
  for (let i in body.symbols){
    const current = body.symbols[i].quoteAsset
    if(typeof quoteAssets[current] === 'undefined'){
      quoteAssets[current] = []
    }
    quoteAssets[current].push(body.symbols[i])
  }

  store.dispatch({
      type: 'CURRENCIES_LOADED',
      currencies: quoteAssets,
  })
});

const orderBook = blessed.box({
  label: 'Order Book',
  top: '10%',
  width: '20%',
  height: '91%',
  border: {
    type: 'line'
  },
  content:'asd',
  style: {
    fg: 'white',
    border: {
      fg: 'yellow'
    },
    hover: {
      border: {
        fg: 'green'
      }
    }
  }
})
const box2 = blessed.box({
  top: '70%',
  left: '20%',
  width: '60%',
  height: '31%',
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    border: {
      fg: 'yellow'
    },
    hover: {
      border: {
        fg: 'green'
      }
    }
  }
})
const box3 = blessed.box({
  top: '0%',
  left: '80%',
  width: '20%',
  height: '100%',
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    border: {
      fg: 'yellow'
    },
    hover: {
      border: {
        fg: 'green'
      }
    }
  }
})
const chart = contrib.line(
  { top: '10%',
    left: '20%',
    width: '60%',
    height: '50%',
    minY: 6538,
    showLegend: true,
    label: 'Chart',
    border: {
      type: 'line'
    },
    style: {
      line: 'yellow',
      text: 'green',
      baseline: 'cyan',
      fg: 'white',
      border: {
        fg: 'yellow'
      },
      hover: {
        border: {
          fg: 'green'
        }
      }
    }
  }
  )
const data = {
      title: 'BTC/USDT',
      x: ['t1', 't2', 't3', 't4', 't5'],
      y: [6550, 6538, 6540, 6581, 6555]
   }
screen.append(header)
screen.append(orderBook)
screen.append(chart) //must append before setting data
screen.append(box2)
screen.append(box3)

chart.setData([data])

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});
startStream()
screen.render()
