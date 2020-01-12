const express = require('express');
const path = require('path');
const UsersService = require('./users-service');

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { name, email, password } = req.body

    for(const field of ['name', 'email', 'password'])
      if(!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })

    const badPassword = UsersService.validatePassword(password)

    if(badPassword)
      return res.status(400).json({
        error: badPassword
      })

    UsersService.hasUserWithEmail(
      req.app.get('db'),
      email
    )
      .then(hasEmail =>{
        if(hasEmail)
          return res.status(400).json({
            error: `Email already taken`
          })

        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              name,
              email,
              password: hashedPassword,
              date_created: 'now()'
            }
        
            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(UsersService.serializeUser(user))
              })
          })
      })
      .catch(next)
  })

module.exports = usersRouter