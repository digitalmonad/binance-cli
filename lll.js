const request = require('request')

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

})
