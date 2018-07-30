const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcrypt-nodejs')
const knex = require('knex')
const morgan = require('morgan')

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')
const auth = require('./middleware/authorization')

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
})

const app = express()

const whitelist = ['https://orin-facial-recognition.herokuapp.com/']
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    }
    callback(new Error('Not allowed by CORS'))
  }
}

app.use(bodyParser.json())
app.use(cors(corsOptions))
app.use(morgan('combined'))

app.get('/', (req, res) => res.send('it works'))
app.post('/signin', signin.signinAuthentication(db, bcrypt))
app.post('/register', register.handleRegister(db, bcrypt))
app.get('/profile/:id', auth.requireAuth, profile.handleProfileGet(db))
app.post('/profile/:id', auth.requireAuth, profile.handleProfileUpdate(db))
app.put('/image', auth.requireAuth, image.handleNewEntry(db))
app.post('/imageurl', auth.requireAuth, image.handleApiCall())

app.listen(process.env.PORT || 3000)
