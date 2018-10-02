function reducer(state, action) {
  if (action.type === 'SOCKET_MESSAGE'){

    if(state.priceHistory.length >= 5){
      state.priceHistory.shift();
    }
    state.priceHistory.push(action.price)
    return ( Object.assign({}, state, {
      lastPrice: action.price,
      priceHistory: state.priceHistory,
      currentPair: action.currentPair
    })
    )
  } if (action.type === 'CURRENCIES_LOADED'){
    return ( Object.assign({}, state, {
      currencies: action.currencies
    })
    )
  } else {
    state
  }
}

module.exports = {
  reducer
}
