'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  Route.post('/', 'UserController.store')
  Route.post('/login', 'UserController.login')
}).prefix('users')

Route.group(() => {
  Route.post('/', 'CandidateController.store').validator('StoreCandidate')
  Route.get('/:id', 'CandidateController.findById')
  Route.get('/', 'CandidateController.search')
  Route.patch('/:id', 'CandidateController.update')
  Route.delete('/:id', 'CandidateController.delete')
  Route.delete('/:id/attachments/:attachment_id', 'CandidateController.deleteAttachment')
}).middleware(['auth']).prefix('candidates')

Route.group(() => {
  Route.get('/:id', 'AttachmentController.download')
}).middleware(['auth']).prefix('attachments')