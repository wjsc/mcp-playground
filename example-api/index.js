const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.use(express.json())

app.get('/time', (req, res) => {
  res.send( new Date(new Date().getTime() - 3 * 60 * 60 * 1000).toISOString())
})

app.listen(3000, ()=> console.log("Example API Listening on Port 3000"))

