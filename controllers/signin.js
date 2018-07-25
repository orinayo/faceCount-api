const jwt = require('jsonwebtoken')
const redis = require('redis')

// Setup Redis
const redisClient = redis.createClient(process.env.REDIS_URI)

const handleSignin = (db, bcrypt, req, res) => {
  const {
    email,
    password
  } = req.body

  if (!email || !password) {
    return Promise.reject('Incorrect form submission')
  }
  return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      if (bcrypt.compareSync(password, data[0].hash)) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => user[0])
          .catch(err => Promise.reject('Unable to get user'))
      } else {
        Promise.reject('Wrong credentials')
      }
    })
    .catch(err => Promise.reject('Wrong credentials'))
}

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers
  return redisClient.get(authorization, (err, response) => {
    if (err || !response) {
      return res.status(400).json('Unauthorized')
    }
    return res.json({id: response})
  })
}

const signToken = email => {
  const jwtPayload = { email }
  return jwt.sign(jwtPayload, process.env.JWT_SECRET, {expiresIn: '2 days'})
}

const setToken = (token, id) => {
  return Promise.resolve(redisClient.set(token, id))
}

const createSessions = user => {
  const { email, id } = user
  const token = signToken(email)
  return setToken(token, id)
    .then(() => {
      return {
        success: 'true',
        userId: id,
        token
      }
    })
    .catch(console.log)
}

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const {
    authorization
  } = req.headers

  return authorization ? getAuthTokenId(req, res) : handleSignin(db, bcrypt, req, res)
    .then(data => {
      return data.id && data.email ? createSessions(data) : Promise.reject(data)
    })
    .then(session => {
      res.json(session)
    })
    .catch(err => res.status(400).json(err))
}

module.exports = {
  signinAuthentication,
  redisClient
}
