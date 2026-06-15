require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const morgan  = require('morgan')
const routes  = require('./routes')
const { errorHandler } = require('./middleware/error.middleware')

const app  = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }))

// express.json con verify para capturar rawBody.
// El webhook de Wompi lo necesita para verificar la firma HMAC.
app.use(express.json({
  verify: function(req, res, buf) {
    req.rawBody = buf.toString()
  },
}))

app.use(morgan('dev'))
app.use('/api', routes)
app.use(errorHandler)

app.listen(PORT, function() {
  console.log('HR Beauty API en http://localhost:' + PORT)
})
