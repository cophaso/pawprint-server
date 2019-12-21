const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Pups Endpoints', function() {
    let db 

    const {
        testPups,
        testUsers,
      } = helpers.makePupsFixtures()

    before('make knex instance', () => {
        db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`GET /api/pups`, () => {
        context(`Given no pups`, () => {
          it(`responds with 200 and an empty list`, () => {
            return supertest(app)
              .get('/api/pups')
              .expect(200, [])
          })
        })
    
        context('Given there are pups in the database', () => {
          beforeEach('insert pups', () =>
            helpers.seedPupsTables(
              db,
              testUsers,
              testPups,
            )
          )
    
          it('responds with 200 and all of the pups', () => {
            return supertest(app)
              .get('/api/pups')
              .expect(200, testPups)
          })
        })
    })
})