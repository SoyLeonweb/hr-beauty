require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const morgan  = require('morgan')
const routes  = require('./routes')
const { errorHandler } = require('./middleware/error.middleware')

const app  = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }))
app.use(express.json())
app.use(morgan('dev'))

app.use('/api', routes)
app.use(errorHandler)

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
