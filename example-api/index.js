const express = require('express')

const app = express()
app.use(express.json())

app.get('/hello/:user', (req, res) => {
  res.send('Hello, ' + req.params.user + "\n")
})

app.listen(3000, ()=> console.log("Example API Listening on Port 3000"))

