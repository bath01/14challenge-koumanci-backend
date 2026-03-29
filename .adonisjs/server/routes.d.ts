import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'rooms.index': { paramsTuple?: []; params?: {} }
    'rooms.store': { paramsTuple?: []; params?: {} }
    'rooms.show': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'rooms.destroy': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'rooms.join': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'rooms.leave': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'participants.index': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'participants.store': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'participants.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'code': ParamValue,'userId': ParamValue} }
    'rtcs.capabilities': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'rtcs.create_transport': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'rtcs.connect_transport': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'rtcs.producers': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'rtcs.produce': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'rtcs.consume': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'rtcs.resume_consumer': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'rooms.index': { paramsTuple?: []; params?: {} }
    'rooms.show': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'participants.index': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'rtcs.capabilities': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'rtcs.producers': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'rooms.index': { paramsTuple?: []; params?: {} }
    'rooms.show': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'participants.index': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'rtcs.capabilities': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'rtcs.producers': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
    'rooms.store': { paramsTuple?: []; params?: {} }
    'rooms.join': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'rooms.leave': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'participants.store': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'rtcs.create_transport': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'rtcs.connect_transport': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'rtcs.produce': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'rtcs.consume': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'rtcs.resume_consumer': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
  }
  DELETE: {
    'rooms.destroy': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'participants.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'code': ParamValue,'userId': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}