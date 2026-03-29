/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'auth.new_account.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/register'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.access_token.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_token_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_token_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.access_token.destroy': {
    methods: ["POST"]
    pattern: '/api/v1/auth/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_token_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_token_controller').default['destroy']>>>
    }
  }
  'profile.profile.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/account/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
    }
  }
  'rooms.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/rooms'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/rooms_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/rooms_controller').default['index']>>>
    }
  }
  'rooms.store': {
    methods: ["POST"]
    pattern: '/api/v1/rooms'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/rooms_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/rooms_controller').default['store']>>>
    }
  }
  'rooms.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/rooms/:code'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { code: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/rooms_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/rooms_controller').default['show']>>>
    }
  }
  'rooms.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/rooms/:code'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { code: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/rooms_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/rooms_controller').default['destroy']>>>
    }
  }
  'rooms.join': {
    methods: ["POST"]
    pattern: '/api/v1/rooms/:code/join'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { code: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/rooms_controller').default['join']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/rooms_controller').default['join']>>>
    }
  }
  'rooms.leave': {
    methods: ["POST"]
    pattern: '/api/v1/rooms/:code/leave'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { code: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/rooms_controller').default['leave']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/rooms_controller').default['leave']>>>
    }
  }
  'participants.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/rooms/:code/participants'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { code: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/participants_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/participants_controller').default['index']>>>
    }
  }
  'participants.store': {
    methods: ["POST"]
    pattern: '/api/v1/rooms/:code/participants'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { code: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/participants_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/participants_controller').default['store']>>>
    }
  }
  'participants.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/rooms/:code/participants/:userId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { code: ParamValue; userId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/participants_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/participants_controller').default['destroy']>>>
    }
  }
  'rtcs.capabilities': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/rooms/:code/rtc/capabilities'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { code: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/rtcs_controller').default['capabilities']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/rtcs_controller').default['capabilities']>>>
    }
  }
  'rtcs.create_transport': {
    methods: ["POST"]
    pattern: '/api/v1/rooms/:code/rtc/transport'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { code: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/rtcs_controller').default['createTransport']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/rtcs_controller').default['createTransport']>>>
    }
  }
  'rtcs.connect_transport': {
    methods: ["POST"]
    pattern: '/api/v1/rooms/:code/rtc/transport/connect'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { code: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/rtcs_controller').default['connectTransport']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/rtcs_controller').default['connectTransport']>>>
    }
  }
  'rtcs.producers': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/rooms/:code/rtc/producers'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { code: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/rtcs_controller').default['producers']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/rtcs_controller').default['producers']>>>
    }
  }
  'rtcs.produce': {
    methods: ["POST"]
    pattern: '/api/v1/rooms/:code/rtc/produce'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { code: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/rtcs_controller').default['produce']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/rtcs_controller').default['produce']>>>
    }
  }
  'rtcs.consume': {
    methods: ["POST"]
    pattern: '/api/v1/rooms/:code/rtc/consume'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { code: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/rtcs_controller').default['consume']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/rtcs_controller').default['consume']>>>
    }
  }
  'rtcs.resume_consumer': {
    methods: ["POST"]
    pattern: '/api/v1/rooms/:code/rtc/consume/resume'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { code: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/rtcs_controller').default['resumeConsumer']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/rtcs_controller').default['resumeConsumer']>>>
    }
  }
}
