const path = require('path')
const express = require('express')
const xss = require('xss')
const PupsService = require('./pups-service')

const pupsRouter = express.Router()
const jsonParser = express.json()

const sanitizedPup = pup => ({
    id: pup.id,
    pup_name: xss(pup.pup_name),
    parent_id: pup.parent_id,
    breed: xss(pup.breed),
    allergies: xss(pup.allergies),
    hobbies: xss(pup.hobbies),
    image_url: xss(pup.image_url),
    services: pup.services || {},
    parent: pup.parent || {},
})

pupsRouter
    .route('/')
    .get((req, res, next) =>{
        PupsService.getAllPupInfo(
            req.app.get('db')
        )
        .then(pups =>{
            res.json(pups.map(sanitizedPup))
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) =>{
        const {pup_name, parent_id, breed, allergies, hobbies, image_url} = req.body
        const newPup = {pup_name, parent_id, breed}

        for(const [key, value] of Object.entries(newPup)){
            if(value == null){
                return res.status(400).json({
                    error: {message: `Missing '${key}' in request body`}
                })
            }
        }

        newPup.allergies = allergies
        newPup.hobbies = hobbies
        newPup.image_url = image_url
        PupsService.insertPup(
            req.app.get('db'),
            newPup
        )
        .then(pup =>{
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${pup.id}`))
                .json(sanitizedPup(pup))
        })
        .catch(next)
    })

pupsRouter
    .route('/:pup_id')
    .all((req, res, next) =>{
        PupsService.getById(
            req.app.get('db'),
            req.params.pup_id
        )
        .then(pup =>{
            if(!pup){
                return res.status(404).json({
                    error: `Pup doesn't exist`
                })
            }

            res.pup = pup
            next()
        })
        .catch(next)
    })
    .get((req, res) => {
        res.json(sanitizedPup(res.pup))
    })
    .patch(jsonParser, (req, res, next) =>{
        const {pup_name, breed, allergies, hobbies} = req.body
        const pupToUpdate = {pup_name, breed, allergies, hobbies}
        const numberOfValues = Object.values(pupToUpdate).filter(Boolean).length
        
        if(numberOfValues === 0){
            return res.status(400).json({
                error: `Request must contain either 'pup_name', 'breed', 'allergies', or 'hobbies'`
            })
        }

        PupsService.updatePup(
            req.app.get('db'),
            req.params.pup_id,
            pupToUpdate
        )
        .then(numRowsAffected =>{
            res.status(204).end()
        })
        .catch(next)
    })

pupsRouter
    .route('/:pup_id/services/')
    .all((req, res, next) =>{
        PupsService.getById(
            req.app.get('db'),
            req.params.pup_id
        )
        .then(pup =>{
            if(!pup){
                return res.status(404).json({
                    error: `Pup doesn't exist`
                })
            }

            res.pup = pup
            next()
        })
        .catch(next)
    })
    .get((req, res, next) =>{
        PupsService.getServicesForPups(
            req.app.get('db'),
            req.params.pup_id
        )
        .then(services =>{
            res.json(services)
        })
        .catch(next)
    })

module.exports = pupsRouter