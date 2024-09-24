const functions = {
  datetime: (timestamp) => new Date(timestamp).toISOString().slice(0, 19).replace('T', ' '),
  timestamp: (datetime) => Math.floor(datetime.getTime() / 1000)
}

module.exports = functions;