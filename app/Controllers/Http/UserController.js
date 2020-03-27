'use strict'
const User = use('App/Models/User')
const Token = use('App/Models/Token')
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
    const user = await User.findBy('email', email)
    if (!user) {
      return response.status(401).send({
        message: 'User not found'
      })
    }
    if (await auth.attempt(user.email, password)) {
      const otherAdminsLogged = (await Token.query()
        .where('is_revoked', false)
        .whereNot('user_id', user.id)
        .count('id')
        .first()).count
      if (otherAdminsLogged > 0) {
        return response.status(403).send({
          message: 'There is another admin logged in'
        }) 
      }
      let accessToken = await Token.query().where('is_revoked', false).where('user_id', user.id).first()
      if (!accessToken) {
        accessToken = await auth.generate(user)
        const tokenInfo = {
          user_id: user.id,
          token: accessToken.token,
          is_revoked: false,
          type: accessToken.type
        };
        await Token.create(tokenInfo)
      }
        
      return {user, accessToken}
    } else {
      return response.status(401).send({
        message: 'Login failed'
      })
    }
  }

  async logout({auth}) {
    const user = await auth.getUser();
    await Token.query()
              .where('user_id', user.id)
              .where('is_revoked', false)
              .update({is_revoked: true})
  }

  async checkLogin({auth, request, response}) {
    try {
      await auth.check()
      let token = request.header('Authorization')
      if (token) {
        token = token.replace(/\s\s+/g, ' ')
        token = token.split(' ')
        if (token.length != 2) {
          token = ''
        } else {
          token = token[1]
        }
      } else {
        token = '';
      }
      const tokenInstance = await Token.findBy('token', token)
      if (tokenInstance.is_revoked) {
        return esponse.status(401).send({logged: false})
      }
      return response.status(200).send({logged: true})
    } catch(ex) {
      return response.status(401).send({logged: false})
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
