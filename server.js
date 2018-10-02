const WebSocket = require('ws');

const HOST = 'wss://stream.binance.com:9443/ws/btcusdt@depth'
const wss = new WebSocket(HOST)


let priceHistory = []
let lastPrice;

wss.onmessage = (event) => {
  //printHorizontalLine()
  process.stdout.write('\r');
  let data = JSON.parse(event.data)
  if (!!data.b[0]) {
    lastPrice = toTwoDecPlaces(data.b[0][0])
  }
  priceHistory.push(lastPrice)
  process.stdout.write('BNB/BTC' + lastPrice + ' ');
};

function toTwoDecPlaces(x){
  return Number.parseFloat(x).toFixed(2)
}

function printHorizontalLine(){
  process.stdout.clearLine()
  process.stdout.cursorTo(0)
}
