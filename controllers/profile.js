const handleProfileGet = (db) => (req, res) => {
  const { id } = req.params
  db.select('*').from('users').where({
    id
  })
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('Error getting user'))
}

const handleProfileUpdate = (db) => (req, res) => {
  const { id } = req.params
  const { name } = req.body.formInput
  db('users')
    .where({
      id
    })
    .update({
      name
    })
    .then(data => {
      if (data) {
        res.json('success')
      } else {
        res.status(400).json('Unable to update')
      }
    })
    .catch(err => res.status(400).json('Error updating user'))
}
module.exports = {
  handleProfileGet,
  handleProfileUpdate
}