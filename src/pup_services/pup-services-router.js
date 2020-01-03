const path = require('path')
const express = require('express')
const xss = require('xss')
const PupServiceService = require('./pup-services-service')

const pupServicesRouter = express.Router()
const jsonParser = express.json()

const sanitizedPupService = pup_service => ({
    id: pup_service.id,
    appt_date: xss(pup_service.date),
    service_type: xss(pup_service.service_type),
    note: xss(pup_service.note),

})

pupServicesRouter
    .route('/')
    .get((req, res, next) =>{
      PupServiceService.getAllServiceInfo(
          req.app.get('db')
      )
      .then(pup_service =>{
          res.json(pup_service.map(sanitizedPupService))
      })
      .catch(next)
    })
    .post(jsonParser, (req, res, next) =>{
      const { pup_id, appt_date, service_type, note } = req.body
      const newPupService = { pup_id, appt_date, service_type }

      for(const [key, value] of Object.entries(newPupService)){
        if(value == null){
          return res.status(400).json({
            error: {message: `Missing '${key}' in request body`}
          })
        }
      }

      newPupService.note = note

      PupServiceService.insertService(
        req.app.get('db'),
        newPupService
      )
      .then(pup_service =>{
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${pup_service.id}`))
          .json(sanitizedPupService(pup_service))
      })
      .catch(next)
    })

pupServicesRouter
  .route('/:pup_services_id')
  .all((req, res, next) =>{
    PupServiceService.getById(
      req.app.get('db'),
      req.params.pup_services_id
    )
    .then(pup_service =>{
      if(!pup_service){
          return res.status(404).json({
              error: {message: `Pup Service doesn't exist`}
          })
      }

      res.pup_service = pup_service
      next()
    })
    .catch(next)
  })
  .get((req, res) => {
    res.json(sanitizedPupService(res.pup_service))
  })
  .delete((req, res, next) => {
    PupServiceService.deleteService(
      req.app.get('db'),
      req.params.pup_services_id
    )
    .then(() => {
      res.json({});
    })
    .catch(next)
  })

module.exports = pupServicesRouter