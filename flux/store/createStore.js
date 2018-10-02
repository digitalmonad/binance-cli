const createStore = function (reducer, initialState) {
  let state = initialState;


  const getState = () => state;
  const dispatch = (action) => {
    state = reducer(state, action)
  }

  return {
    getState,
    dispatch
  }
}

module.exports = {
  createStore
}
