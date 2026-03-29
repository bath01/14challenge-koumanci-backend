/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('register', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessToken, 'store'])
        router.post('logout', [controllers.AccessToken, 'destroy']).use(middleware.auth())
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('/profile', [controllers.Profile, 'show'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [controllers.Rooms, 'index'])
        router.post('/', [controllers.Rooms, 'store'])
        router.get('/:code', [controllers.Rooms, 'show'])
        router.delete('/:code', [controllers.Rooms, 'destroy'])

        router.post('/:code/join', [controllers.Rooms, 'join'])
        router.post('/:code/leave', [controllers.Rooms, 'leave'])

        router.get('/:code/participants', [controllers.Participants, 'index'])
        router.post('/:code/participants', [controllers.Participants, 'store'])
        router.delete('/:code/participants/:userId', [controllers.Participants, 'destroy'])

        router.get('/:code/rtc/capabilities', [controllers.Rtcs, 'capabilities'])
        router.post('/:code/rtc/transport', [controllers.Rtcs, 'createTransport'])
        router.post('/:code/rtc/transport/connect', [controllers.Rtcs, 'connectTransport'])
        router.get('/:code/rtc/producers', [controllers.Rtcs, 'producers'])
        router.post('/:code/rtc/produce', [controllers.Rtcs, 'produce'])
        router.post('/:code/rtc/consume', [controllers.Rtcs, 'consume'])
        router.post('/:code/rtc/consume/resume', [controllers.Rtcs, 'resumeConsumer'])
      })
      .prefix('/rooms')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
