import { defineConfig } from '@adonisjs/transmit'

export default defineConfig({
  /*
  |--------------------------------------------------------------------------
  | Ping interval
  |--------------------------------------------------------------------------
  | Intervalle en ms pour envoyer un ping SSE "keep-alive" aux clients
  | connectés. Mettre à false pour désactiver.
  */
  pingInterval: false,

  /*
  |--------------------------------------------------------------------------
  | Transport
  |--------------------------------------------------------------------------
  | "memory" convient en développement et sur un seul serveur.
  | En production multi-instances, utiliser Redis (nécessite
  | @adonisjs/transmit-redis) :
  |
  |   transport: {
  |     driver: 'redis',
  |     config: { host: '127.0.0.1', port: 6379 },
  |   }
  */
  transport: null,
})