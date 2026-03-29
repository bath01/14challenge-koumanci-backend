/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessToken: {
      store: typeof routes['auth.access_token.store']
      destroy: typeof routes['auth.access_token.destroy']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
  }
  rooms: {
    index: typeof routes['rooms.index']
    store: typeof routes['rooms.store']
    show: typeof routes['rooms.show']
    destroy: typeof routes['rooms.destroy']
    join: typeof routes['rooms.join']
    leave: typeof routes['rooms.leave']
  }
  participants: {
    index: typeof routes['participants.index']
    store: typeof routes['participants.store']
    destroy: typeof routes['participants.destroy']
  }
  rtcs: {
    capabilities: typeof routes['rtcs.capabilities']
    createTransport: typeof routes['rtcs.create_transport']
    connectTransport: typeof routes['rtcs.connect_transport']
    producers: typeof routes['rtcs.producers']
    produce: typeof routes['rtcs.produce']
    consume: typeof routes['rtcs.consume']
    resumeConsumer: typeof routes['rtcs.resume_consumer']
  }
}
