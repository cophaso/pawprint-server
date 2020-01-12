const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Pups Services Endpoints', function() {
    let db 
    
    let fillPupServices = [
    {
      id: 1, 
      appt_date: '12/30/2019',
      service_type: 'Grooming',
      note: 'Loves the blow dryer'
    },
    {
      id: 2, 
      appt_date: '1/3/2020',
      service_type: 'Daycare',
      note: 'Hates chihuahuas'
    },
    {
      id: 3, 
      appt_date: '2/07/2020',
      service_type: 'Vet',
      note: 'Update shots'
    }
]

    before('make knex instance', () => {
        db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())
    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`GET /api/pup-services`, () => {

        beforeEach('insert pup services', () => {
            return db('pup_services').insert(fillPupServices);
          })
          
          it('GET /pup-services and return array of pup services with status 200', function () {
            return supertest(app)
              .get('/api/pup-services')
              .expect(200)
              .expect(res => {
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.length(fillPupServices.length);
                res.body.forEach((item) => {
                  expect(item).to.be.a('object');
                  expect(item).to.include.keys('id', 'appt_date', 'service_type', 'note');
                });
              });
          });
      
        });

})