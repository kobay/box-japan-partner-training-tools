import {Settings} from '../utils/settings'

export default abstract class ServiceBase {
  protected settings: Settings

  protected constructor(settings: Settings) {
    this.settings = settings
  }
}
