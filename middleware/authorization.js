const redisClient = require('../controllers/signin').redisClient

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) {
    return res.status(401).json('Unauthorized')
  }
  return redisClient.get(authorization, (err, response) => {
    if (err || !response) {
      return res.status(401).json('Unauthorized')
    }
    return next()
  })
}

module.exports = {
  requireAuth
}
