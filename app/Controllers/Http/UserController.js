'use strict'
const User = use('App/Models/User')
const { validate } = use('Validator')
const uniqid = require('uniqid')
class UserController {
  async store({request, response}) {
    const data = request.only([
      'username',
      'email',
      'password'
    ])
    const validationRules = {
      email: 'required|email|unique:users,email',
      username: 'required|unique:users,email',
      password: 'required'
    }
    const validation = await validate(data, validationRules)
    if (validation.fails()) {
      return response.status(400).send(validation.messages())
    }
    const user = await User.create(data)
    return user
  }

  async login({request, response, auth}) {
    const {email, password} = request.all()
    if (auth.attempt(email, password)) {
      const user = await User.findBy('email', email)
      const accessToken = await auth.generate(user)
      return {user, accessToken}
    } else {
      return response.status(401).send({
        message: 'Login failed'
      })
    }
  }

  async findById({params, response}) {
    const user = await User.findBy('id', params.id);
    if (!user)
      return response.status(404).send({
        message: 'User not found'
      });
    return user;
  }
}

module.exports = UserController
