import mediasoup_service from '#services/mediasoup_service'
import type { ApplicationService } from '@adonisjs/core/types'

export default class MediasoupProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {
    // Nombre de workers = nombre de CPUs (min 1)
    const os = await import('node:os')
    const numWorkers = Math.max(1, os.cpus().length)
    await mediasoup_service.init(numWorkers)
  }

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {
    console.info('mediasoup: arrêt des workers...')
  }
}