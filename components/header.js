const blessed = require('blessed');
const contrib = require('blessed-contrib');
//const compPrice = require('./compPrice').compPrice

const price = blessed.Box({
  content: 'Connecting...',
  style: {
    fg: 'blue',
  },
  top: '25%',
  left: '5%'
})


const header = blessed.Box({
  border: {
    type: 'line'
  },
  top: '0%',
  width: '80%',
  height: '10%',
  tags: true,
  children: [price],
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

module.exports = {
  header
}
