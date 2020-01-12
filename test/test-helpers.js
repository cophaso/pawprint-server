const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsersArray() {
  return [
    {
      id: 1,
      name: 'test-user-1',
      email: 'test-user1@test.com',
      password: "Password1!",
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      name: 'test-user-2',
      email: 'test-user2@test.com',
      password: "Password1!",
      date_created: '2029-01-22T16:28:32.615Z',
    }
  ]
}

function makePupsArray(users){
  return [
    {
      id: 1,
      pup_name: 'Cookie',
      parent_id: users[0].id,
      breed: 'Pitbull',
      allergies: 'Chicken',
      hobbies: 'chasing squirrels'
    },
    {
      id: 2,
      pup_name: 'Waffles',
      parent_id: users[0].id,
      breed: 'Corgi',
      allergies: 'Peanuts',
      hobbies: 'chasing potatoes'
    },
    {
      id: 3,
      pup_name: 'Tofu',
      parent_id: users[1].id,
      breed: 'White Shiba Inu',
      allergies: 'Turkey',
      hobbies: 'chasing cats'
    }
  ]
}


function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('users').insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

function seedPupsTables(db, users, pups) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('pups').insert(pups)
    // update the auto sequence to match the forced id values
    await trx.raw(
      `SELECT setval('pups_id_seq', ?)`,
      [pups[pups.length - 1].id],
    )
  })
}


function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

function makePupsFixtures() {
  const testUsers = makeUsersArray()
  const testPups = makePupsArray(testUsers)

  return { testUsers, testPups }
}

function cleanTables(db) {
  return db.destroy()
}

module.exports = {
  makeUsersArray,
  makeAuthHeader,

  makePupsFixtures,
  seedUsers,

  seedPupsTables,
  cleanTables
}