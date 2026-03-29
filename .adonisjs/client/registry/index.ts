/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/register',
    tokens: [{"old":"/api/v1/auth/register","type":0,"val":"api","end":""},{"old":"/api/v1/auth/register","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/register","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/register","type":0,"val":"register","end":""}],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.access_token.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.access_token.store']['types'],
  },
  'auth.access_token.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/auth/logout',
    tokens: [{"old":"/api/v1/auth/logout","type":0,"val":"api","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['auth.access_token.destroy']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'rooms.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/rooms',
    tokens: [{"old":"/api/v1/rooms","type":0,"val":"api","end":""},{"old":"/api/v1/rooms","type":0,"val":"v1","end":""},{"old":"/api/v1/rooms","type":0,"val":"rooms","end":""}],
    types: placeholder as Registry['rooms.index']['types'],
  },
  'rooms.store': {
    methods: ["POST"],
    pattern: '/api/v1/rooms',
    tokens: [{"old":"/api/v1/rooms","type":0,"val":"api","end":""},{"old":"/api/v1/rooms","type":0,"val":"v1","end":""},{"old":"/api/v1/rooms","type":0,"val":"rooms","end":""}],
    types: placeholder as Registry['rooms.store']['types'],
  },
  'rooms.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/rooms/:code',
    tokens: [{"old":"/api/v1/rooms/:code","type":0,"val":"api","end":""},{"old":"/api/v1/rooms/:code","type":0,"val":"v1","end":""},{"old":"/api/v1/rooms/:code","type":0,"val":"rooms","end":""},{"old":"/api/v1/rooms/:code","type":1,"val":"code","end":""}],
    types: placeholder as Registry['rooms.show']['types'],
  },
  'rooms.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/rooms/:code',
    tokens: [{"old":"/api/v1/rooms/:code","type":0,"val":"api","end":""},{"old":"/api/v1/rooms/:code","type":0,"val":"v1","end":""},{"old":"/api/v1/rooms/:code","type":0,"val":"rooms","end":""},{"old":"/api/v1/rooms/:code","type":1,"val":"code","end":""}],
    types: placeholder as Registry['rooms.destroy']['types'],
  },
  'rooms.join': {
    methods: ["POST"],
    pattern: '/api/v1/rooms/:code/join',
    tokens: [{"old":"/api/v1/rooms/:code/join","type":0,"val":"api","end":""},{"old":"/api/v1/rooms/:code/join","type":0,"val":"v1","end":""},{"old":"/api/v1/rooms/:code/join","type":0,"val":"rooms","end":""},{"old":"/api/v1/rooms/:code/join","type":1,"val":"code","end":""},{"old":"/api/v1/rooms/:code/join","type":0,"val":"join","end":""}],
    types: placeholder as Registry['rooms.join']['types'],
  },
  'rooms.leave': {
    methods: ["POST"],
    pattern: '/api/v1/rooms/:code/leave',
    tokens: [{"old":"/api/v1/rooms/:code/leave","type":0,"val":"api","end":""},{"old":"/api/v1/rooms/:code/leave","type":0,"val":"v1","end":""},{"old":"/api/v1/rooms/:code/leave","type":0,"val":"rooms","end":""},{"old":"/api/v1/rooms/:code/leave","type":1,"val":"code","end":""},{"old":"/api/v1/rooms/:code/leave","type":0,"val":"leave","end":""}],
    types: placeholder as Registry['rooms.leave']['types'],
  },
  'participants.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/rooms/:code/participants',
    tokens: [{"old":"/api/v1/rooms/:code/participants","type":0,"val":"api","end":""},{"old":"/api/v1/rooms/:code/participants","type":0,"val":"v1","end":""},{"old":"/api/v1/rooms/:code/participants","type":0,"val":"rooms","end":""},{"old":"/api/v1/rooms/:code/participants","type":1,"val":"code","end":""},{"old":"/api/v1/rooms/:code/participants","type":0,"val":"participants","end":""}],
    types: placeholder as Registry['participants.index']['types'],
  },
  'participants.store': {
    methods: ["POST"],
    pattern: '/api/v1/rooms/:code/participants',
    tokens: [{"old":"/api/v1/rooms/:code/participants","type":0,"val":"api","end":""},{"old":"/api/v1/rooms/:code/participants","type":0,"val":"v1","end":""},{"old":"/api/v1/rooms/:code/participants","type":0,"val":"rooms","end":""},{"old":"/api/v1/rooms/:code/participants","type":1,"val":"code","end":""},{"old":"/api/v1/rooms/:code/participants","type":0,"val":"participants","end":""}],
    types: placeholder as Registry['participants.store']['types'],
  },
  'participants.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/rooms/:code/participants/:userId',
    tokens: [{"old":"/api/v1/rooms/:code/participants/:userId","type":0,"val":"api","end":""},{"old":"/api/v1/rooms/:code/participants/:userId","type":0,"val":"v1","end":""},{"old":"/api/v1/rooms/:code/participants/:userId","type":0,"val":"rooms","end":""},{"old":"/api/v1/rooms/:code/participants/:userId","type":1,"val":"code","end":""},{"old":"/api/v1/rooms/:code/participants/:userId","type":0,"val":"participants","end":""},{"old":"/api/v1/rooms/:code/participants/:userId","type":1,"val":"userId","end":""}],
    types: placeholder as Registry['participants.destroy']['types'],
  },
  'rtcs.capabilities': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/rooms/:code/rtc/capabilities',
    tokens: [{"old":"/api/v1/rooms/:code/rtc/capabilities","type":0,"val":"api","end":""},{"old":"/api/v1/rooms/:code/rtc/capabilities","type":0,"val":"v1","end":""},{"old":"/api/v1/rooms/:code/rtc/capabilities","type":0,"val":"rooms","end":""},{"old":"/api/v1/rooms/:code/rtc/capabilities","type":1,"val":"code","end":""},{"old":"/api/v1/rooms/:code/rtc/capabilities","type":0,"val":"rtc","end":""},{"old":"/api/v1/rooms/:code/rtc/capabilities","type":0,"val":"capabilities","end":""}],
    types: placeholder as Registry['rtcs.capabilities']['types'],
  },
  'rtcs.create_transport': {
    methods: ["POST"],
    pattern: '/api/v1/rooms/:code/rtc/transport',
    tokens: [{"old":"/api/v1/rooms/:code/rtc/transport","type":0,"val":"api","end":""},{"old":"/api/v1/rooms/:code/rtc/transport","type":0,"val":"v1","end":""},{"old":"/api/v1/rooms/:code/rtc/transport","type":0,"val":"rooms","end":""},{"old":"/api/v1/rooms/:code/rtc/transport","type":1,"val":"code","end":""},{"old":"/api/v1/rooms/:code/rtc/transport","type":0,"val":"rtc","end":""},{"old":"/api/v1/rooms/:code/rtc/transport","type":0,"val":"transport","end":""}],
    types: placeholder as Registry['rtcs.create_transport']['types'],
  },
  'rtcs.connect_transport': {
    methods: ["POST"],
    pattern: '/api/v1/rooms/:code/rtc/transport/connect',
    tokens: [{"old":"/api/v1/rooms/:code/rtc/transport/connect","type":0,"val":"api","end":""},{"old":"/api/v1/rooms/:code/rtc/transport/connect","type":0,"val":"v1","end":""},{"old":"/api/v1/rooms/:code/rtc/transport/connect","type":0,"val":"rooms","end":""},{"old":"/api/v1/rooms/:code/rtc/transport/connect","type":1,"val":"code","end":""},{"old":"/api/v1/rooms/:code/rtc/transport/connect","type":0,"val":"rtc","end":""},{"old":"/api/v1/rooms/:code/rtc/transport/connect","type":0,"val":"transport","end":""},{"old":"/api/v1/rooms/:code/rtc/transport/connect","type":0,"val":"connect","end":""}],
    types: placeholder as Registry['rtcs.connect_transport']['types'],
  },
  'rtcs.producers': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/rooms/:code/rtc/producers',
    tokens: [{"old":"/api/v1/rooms/:code/rtc/producers","type":0,"val":"api","end":""},{"old":"/api/v1/rooms/:code/rtc/producers","type":0,"val":"v1","end":""},{"old":"/api/v1/rooms/:code/rtc/producers","type":0,"val":"rooms","end":""},{"old":"/api/v1/rooms/:code/rtc/producers","type":1,"val":"code","end":""},{"old":"/api/v1/rooms/:code/rtc/producers","type":0,"val":"rtc","end":""},{"old":"/api/v1/rooms/:code/rtc/producers","type":0,"val":"producers","end":""}],
    types: placeholder as Registry['rtcs.producers']['types'],
  },
  'rtcs.produce': {
    methods: ["POST"],
    pattern: '/api/v1/rooms/:code/rtc/produce',
    tokens: [{"old":"/api/v1/rooms/:code/rtc/produce","type":0,"val":"api","end":""},{"old":"/api/v1/rooms/:code/rtc/produce","type":0,"val":"v1","end":""},{"old":"/api/v1/rooms/:code/rtc/produce","type":0,"val":"rooms","end":""},{"old":"/api/v1/rooms/:code/rtc/produce","type":1,"val":"code","end":""},{"old":"/api/v1/rooms/:code/rtc/produce","type":0,"val":"rtc","end":""},{"old":"/api/v1/rooms/:code/rtc/produce","type":0,"val":"produce","end":""}],
    types: placeholder as Registry['rtcs.produce']['types'],
  },
  'rtcs.consume': {
    methods: ["POST"],
    pattern: '/api/v1/rooms/:code/rtc/consume',
    tokens: [{"old":"/api/v1/rooms/:code/rtc/consume","type":0,"val":"api","end":""},{"old":"/api/v1/rooms/:code/rtc/consume","type":0,"val":"v1","end":""},{"old":"/api/v1/rooms/:code/rtc/consume","type":0,"val":"rooms","end":""},{"old":"/api/v1/rooms/:code/rtc/consume","type":1,"val":"code","end":""},{"old":"/api/v1/rooms/:code/rtc/consume","type":0,"val":"rtc","end":""},{"old":"/api/v1/rooms/:code/rtc/consume","type":0,"val":"consume","end":""}],
    types: placeholder as Registry['rtcs.consume']['types'],
  },
  'rtcs.resume_consumer': {
    methods: ["POST"],
    pattern: '/api/v1/rooms/:code/rtc/consume/resume',
    tokens: [{"old":"/api/v1/rooms/:code/rtc/consume/resume","type":0,"val":"api","end":""},{"old":"/api/v1/rooms/:code/rtc/consume/resume","type":0,"val":"v1","end":""},{"old":"/api/v1/rooms/:code/rtc/consume/resume","type":0,"val":"rooms","end":""},{"old":"/api/v1/rooms/:code/rtc/consume/resume","type":1,"val":"code","end":""},{"old":"/api/v1/rooms/:code/rtc/consume/resume","type":0,"val":"rtc","end":""},{"old":"/api/v1/rooms/:code/rtc/consume/resume","type":0,"val":"consume","end":""},{"old":"/api/v1/rooms/:code/rtc/consume/resume","type":0,"val":"resume","end":""}],
    types: placeholder as Registry['rtcs.resume_consumer']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
