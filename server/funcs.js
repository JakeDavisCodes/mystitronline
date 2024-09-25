const functions = {
  datetime: (timestamp) => new Date(timestamp).toISOString().slice(0, 19).replace('T', ' '),
  timestamp: (datetime) => Math.floor(datetime.getTime() / 1000),

  error: {
    cardNotFound: (err, res) => {
      console.error(err, 'Card Not found')
      res.status(404).json({error: 'Cannot claim card'})
    }
  }
}

module.exports = functions;