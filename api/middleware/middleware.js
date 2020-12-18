const Auth = require('../auth/auth-model');

const isValid = (req, res, next) => {
  const user = req.body;
  if(!user || !user.username || !user.password) {
    res.status(401).json({ message: 'username and password required' });
  } else {
    next();
  }
};

const isAvailable = async (req, res, next) => {
  const data = await Auth.findBy({ username: req.body.username });
  if(data.length) {
    res.status(400).json({ message: 'username taken' });
  } else {
    next();
  }
};

const isExistent = async (req, res, next) => {
  const data = await Auth.findBy({ username: req.body.username });
  if(!data.length) {
    res.status(404).json({ message: 'invalid credentials' });
  } else {
    next();
  }
};

module.exports = {
  isValid,
  isAvailable,
  isExistent
};