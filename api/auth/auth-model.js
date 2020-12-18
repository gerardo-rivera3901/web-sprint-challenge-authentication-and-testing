const db = require('../../data/dbConfig');

module.exports = {
  addUser,
  findById,
  findBy
};

async function addUser(user) {
  const [id] = await db('users').insert(user);
  return findById(id);
}

function findById(id) {
  return db('users').where('id', id).first();
}

function findBy(filter) {
  return db('users').where(filter);
}